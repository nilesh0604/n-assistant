import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaChevronDown, FaChevronRight, FaCodeBranch, FaLayerGroup, FaBullseye, FaInfoCircle } from 'react-icons/fa';

interface TaskStep {
  id: string;
  description: string;
  type: 'action' | 'navigation' | 'verification' | 'decision';
  status: 'pending' | 'completed' | 'failed' | 'skipped';
  dependencies: string[];
  estimatedDuration?: number;
  actualDuration?: number;
  confidence?: number;
  warnings?: string[];
  substeps?: TaskStep[];
}

interface TaskDecompositionValidationProps {
  task: {
    id: string;
    description: string;
    goal: string;
    steps: TaskStep[];
  };
  onValidateTask: (taskId: string, validation: TaskValidation) => void;
  onModifyStep: (stepId: string, modifications: Partial<TaskStep>) => void;
  onAddStep: (parentId: string, step: Omit<TaskStep, 'id'>) => void;
  onDeleteStep: (stepId: string) => void;
  readOnly?: boolean;
}

interface TaskValidation {
  isValid: boolean;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    stepId?: string;
  }>;
  metrics: {
    totalSteps: number;
    estimatedDuration: number;
    confidence: number;
    complexity: 'low' | 'medium' | 'high';
  };
}

export const TaskDecompositionValidation: React.FC<TaskDecompositionValidationProps> = ({
  task,
  onValidateTask,
  onModifyStep,
  onAddStep,
  onDeleteStep,
  readOnly = false,
}) => {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [stepEdits, setStepEdits] = useState<Record<string, Partial<TaskStep>>>({});
  const [validation, setValidation] = useState<TaskValidation | null>(null);
  const [isAddingStep, setIsAddingStep] = useState<string | null>(null);
  const [newStep, setNewStep] = useState<Partial<TaskStep>>({});

  // Validate task whenever steps change
  useEffect(() => {
    const validation = validateTaskDecomposition(task);
    setValidation(validation);
    onValidateTask(task.id, validation);
  }, [task.steps]);

  const validateTaskDecomposition = (taskToValidate: typeof task): TaskValidation => {
    const issues: TaskValidation['issues'] = [];
    let totalEstimatedDuration = 0;
    let confidenceSum = 0;
    let confidenceCount = 0;

    const validateStep = (step: TaskStep, depth = 0) => {
      // Check for empty descriptions
      if (!step.description.trim()) {
        issues.push({
          type: 'error',
          message: 'Step description cannot be empty',
          stepId: step.id,
        });
      }

      // Check confidence
      if (step.confidence !== undefined) {
        confidenceSum += step.confidence;
        confidenceCount++;
        if (step.confidence < 0.5) {
          issues.push({
            type: 'warning',
            message: `Low confidence (${Math.round(step.confidence * 100)}%) for this step`,
            stepId: step.id,
          });
        }
      }

      // Check duration
      if (step.estimatedDuration) {
        totalEstimatedDuration += step.estimatedDuration;
        if (step.estimatedDuration > 30000) { // 30 seconds
          issues.push({
            type: 'warning',
            message: 'Step may take too long (>30s)',
            stepId: step.id,
          });
        }
      }

      // Check dependencies
      step.dependencies.forEach(depId => {
        if (!taskToValidate.steps.find(s => s.id === depId)) {
          issues.push({
            type: 'error',
            message: `Dependency on non-existent step: ${depId}`,
            stepId: step.id,
          });
        }
      });

      // Validate substeps
      if (step.substeps) {
        step.substeps.forEach(substep => validateStep(substep, depth + 1));
      }
    };

    taskToValidate.steps.forEach(step => validateStep(step));

    // Calculate complexity
    const totalSteps = countAllSteps(taskToValidate.steps);
    let complexity: 'low' | 'medium' | 'high' = 'low';
    if (totalSteps > 10) complexity = 'high';
    else if (totalSteps > 5) complexity = 'medium';

    // Check for circular dependencies
    const visited = new Set<string>();
    const recursionStack = new Set<string>();
    
    const hasCircularDependency = (stepId: string): boolean => {
      if (recursionStack.has(stepId)) return true;
      if (visited.has(stepId)) return false;
      
      visited.add(stepId);
      recursionStack.add(stepId);
      
      const step = findStep(taskToValidate.steps, stepId);
      if (step) {
        for (const depId of step.dependencies) {
          if (hasCircularDependency(depId)) return true;
        }
      }
      
      recursionStack.delete(stepId);
      return false;
    };
    
    taskToValidate.steps.forEach(step => {
      if (hasCircularDependency(step.id)) {
        issues.push({
          type: 'error',
          message: 'Circular dependency detected',
          stepId: step.id,
        });
      }
    });

    return {
      isValid: !issues.some(i => i.type === 'error'),
      issues,
      metrics: {
        totalSteps,
        estimatedDuration: totalEstimatedDuration,
        confidence: confidenceCount > 0 ? confidenceSum / confidenceCount : 1,
        complexity,
      },
    };
  };

  const countAllSteps = (steps: TaskStep[]): number => {
    return steps.reduce((count, step) => {
      return count + 1 + (step.substeps ? countAllSteps(step.substeps) : 0);
    }, 0);
  };

  const findStep = (steps: TaskStep[], stepId: string): TaskStep | undefined => {
    for (const step of steps) {
      if (step.id === stepId) return step;
      if (step.substeps) {
        const found = findStep(step.substeps, stepId);
        if (found) return found;
      }
    }
    return undefined;
  };

  const toggleStepExpanded = (stepId: string) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepId)) {
        newSet.delete(stepId);
      } else {
        newSet.add(stepId);
      }
      return newSet;
    });
  };

  const handleStepEdit = (stepId: string) => {
    setEditingStep(stepId);
    const step = findStep(task.steps, stepId);
    if (step) {
      setStepEdits(prev => ({ ...prev, [stepId]: step }));
    }
  };

  const handleStepSave = (stepId: string) => {
    const edits = stepEdits[stepId];
    if (edits) {
      onModifyStep(stepId, edits);
      setEditingStep(null);
      setStepEdits(prev => {
        const newEdits = { ...prev };
        delete newEdits[stepId];
        return newEdits;
      });
    }
  };

  const handleStepCancel = (stepId: string) => {
    setEditingStep(null);
    setStepEdits(prev => {
      const newEdits = { ...prev };
      delete newEdits[stepId];
      return newEdits;
    });
  };

  const handleAddStep = (parentId: string) => {
    if (newStep.description) {
      onAddStep(parentId, {
        description: newStep.description,
        type: newStep.type || 'action',
        status: 'pending',
        dependencies: [],
        ...newStep,
      } as Omit<TaskStep, 'id'>);
      setNewStep({});
      setIsAddingStep(null);
    }
  };

  const getStatusIcon = (status: TaskStep['status']) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <FaTimesCircle className="w-4 h-4 text-red-500" />;
      case 'skipped':
        return <FaExclamationTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />;
    }
  };

  const getTypeIcon = (type: TaskStep['type']) => {
    switch (type) {
      case 'action':
        return <FaBullseye className="w-4 h-4 text-blue-500" />;
      case 'navigation':
        return <FaLayerGroup className="w-4 h-4 text-green-500" />;
      case 'verification':
        return <FaCheckCircle className="w-4 h-4 text-purple-500" />;
      case 'decision':
        return <FaCodeBranch className="w-4 h-4 text-orange-500" />;
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-green-600 bg-green-100';
    }
  };

  const renderStep = (step: TaskStep, depth = 0) => {
    const isExpanded = expandedSteps.has(step.id);
    const isEditing = editingStep === step.id;
    const edits = stepEdits[step.id] || {};
    const isAdding = isAddingStep === step.id;

    return (
      <div key={step.id} style={{ marginLeft: `${depth * 24}px` }}>
        <div className="border rounded-lg mb-2 bg-white">
          <div className="p-3">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <button
                  onClick={() => toggleStepExpanded(step.id)}
                  className="mt-1 text-gray-400 hover:text-gray-600"
                >
                  {step.substeps && step.substeps.length > 0 ? (
                    isExpanded ? <FaChevronDown className="w-4 h-4" /> : <FaChevronRight className="w-4 h-4" />
                  ) : (
                    <div className="w-4 h-4" />
                  )}
                </button>
                {getStatusIcon(step.status)}
                {getTypeIcon(step.type)}
                <div className="flex-1 min-w-0">
                  {isEditing ? (
                    <input
                      type="text"
                      value={edits.description || ''}
                      onChange={(e) => setStepEdits(prev => ({
                        ...prev,
                        [step.id]: { ...prev[step.id], description: e.target.value },
                      }))}
                      className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                  ) : (
                    <p className="text-gray-900">{step.description}</p>
                  )}
                  
                  {step.dependencies.length > 0 && (
                    <div className="mt-1 flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Dependencies:</span>
                      {step.dependencies.map(depId => (
                        <span key={depId} className="px-2 py-0.5 text-xs bg-gray-100 rounded">
                          {depId}
                        </span>
                      ))}
                    </div>
                  )}

                      {step.warnings && step.warnings.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {step.warnings.map((warning, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm text-yellow-600">
                              <FaExclamationTriangle className="w-3 h-3" />
                              <span>{warning}</span>
                            </div>
                          ))}
                        </div>
                      )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {step.confidence && (
                  <span className="text-sm text-gray-500">
                    {Math.round(step.confidence * 100)}%
                  </span>
                )}
                {step.estimatedDuration && (
                  <span className="text-sm text-gray-500">
                    {(step.estimatedDuration / 1000).toFixed(1)}s
                  </span>
                )}
                {!readOnly && (
                  <div className="flex items-center space-x-1">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleStepSave(step.id)}
                          className="p-1 text-green-600 hover:text-green-700"
                        >
                          <FaSave className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStepCancel(step.id)}
                          className="p-1 text-gray-600 hover:text-gray-700"
                        >
                          <FaTimes className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleStepEdit(step.id)}
                          className="p-1 text-gray-600 hover:text-gray-700"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteStep(step.id)}
                          className="p-1 text-red-600 hover:text-red-700"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Add substep button */}
          {!readOnly && isExpanded && (
            <div className="px-3 pb-3">
              {isAdding ? (
                <div className="p-3 border border-dashed border-gray-300 rounded">
                  <input
                    type="text"
                    placeholder="Step description..."
                    value={newStep.description || ''}
                    onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                    className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  />
                  <div className="flex items-center space-x-2">
                    <select
                      value={newStep.type || 'action'}
                      onChange={(e) => setNewStep({ ...newStep, type: e.target.value as TaskStep['type'] })}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="action">Action</option>
                      <option value="navigation">Navigation</option>
                      <option value="verification">Verification</option>
                      <option value="decision">Decision</option>
                    </select>
                    <button
                      onClick={() => handleAddStep(step.id)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setIsAddingStep(null);
                        setNewStep({});
                      }}
                      className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                  <button
                    onClick={() => setIsAddingStep(step.id)}
                    className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-800"
                  >
                    <FaPlus className="w-4 h-4" />
                    <span>Add substep</span>
                  </button>
              )}
            </div>
          )}

          {/* Substeps */}
          {isExpanded && step.substeps && (
            <div className="border-t">
              {step.substeps.map(substep => renderStep(substep, depth + 1))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Task Decomposition</h3>
        <p className="text-sm text-gray-600 mb-4">{task.description}</p>
        
        {validation && (
          <div className="space-y-3">
            {/* Metrics */}
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Steps:</span>
                <span className="font-medium">{validation.metrics.totalSteps}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Duration:</span>
                <span className="font-medium">{(validation.metrics.estimatedDuration / 1000).toFixed(1)}s</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Confidence:</span>
                <span className="font-medium">{Math.round(validation.metrics.confidence * 100)}%</span>
              </div>
              <div className={`px-2 py-1 text-xs font-medium rounded ${getComplexityColor(validation.metrics.complexity)}`}>
                {validation.metrics.complexity.toUpperCase()} COMPLEXITY
              </div>
            </div>

            {/* Issues */}
            {validation.issues.length > 0 && (
              <div className="space-y-2">
                {validation.issues.map((issue, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-2 p-2 rounded ${
                      issue.type === 'error' ? 'bg-red-50' :
                      issue.type === 'warning' ? 'bg-yellow-50' : 'bg-blue-50'
                    }`}
                  >
                    {issue.type === 'error' ? (
                      <FaTimesCircle className="w-4 h-4 text-red-500 mt-0.5" />
                    ) : issue.type === 'warning' ? (
                      <FaExclamationTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                    ) : (
                      <FaInfoCircle className="w-4 h-4 text-blue-500 mt-0.5" />
                    )}
                    <span className={`text-sm ${
                      issue.type === 'error' ? 'text-red-700' :
                      issue.type === 'warning' ? 'text-yellow-700' : 'text-blue-700'
                    }`}>
                      {issue.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Steps */}
      <div className="flex-1 overflow-y-auto p-4">
        {!readOnly && (
          <div className="mb-4">
                  <button
                    onClick={() => onAddStep('root', {
                      description: '',
                      type: 'action',
                      status: 'pending',
                      dependencies: [],
                    })}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    <FaPlus className="w-4 h-4" />
                    <span>Add Step</span>
                  </button>
          </div>
        )}

        {task.steps.map(step => renderStep(step))}
      </div>
    </div>
  );
};

export default TaskDecompositionValidation;

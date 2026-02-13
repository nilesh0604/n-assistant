import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaClock, FaInfoCircle } from 'react-icons/fa';

interface ActionVerificationProps {
  actions: Array<{
    id: string;
    type: string;
    description: string;
    element?: {
      selector: string;
      text: string;
      type: string;
    };
    confidence?: number;
    warnings?: string[];
  }>;
  onApprove: (actionId: string) => void;
  onReject: (actionId: string, reason?: string) => void;
  autoApprove?: boolean;
  showConfidence?: boolean;
}

interface VerificationState {
  [actionId: string]: {
    status: 'pending' | 'approved' | 'rejected' | 'modified';
    reason?: string;
    modifications?: Record<string, unknown>;
    timestamp: number;
  };
}

export const ActionVerificationPrompts: React.FC<ActionVerificationProps> = ({
  actions,
  onApprove,
  onReject,
  autoApprove = false,
  showConfidence = true,
}) => {
  const [verificationStates, setVerificationStates] = useState<VerificationState>({});
  const [expandedActions, setExpandedActions] = useState<Set<string>>(new Set());
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});

  // Auto-approve actions if enabled
  useEffect(() => {
    if (autoApprove) {
      actions.forEach(action => {
        if (!verificationStates[action.id]) {
          handleApprove(action.id);
        }
      });
    }
  }, [actions, autoApprove]);

  const handleApprove = (actionId: string) => {
    setVerificationStates(prev => ({
      ...prev,
      [actionId]: {
        status: 'approved',
        timestamp: Date.now(),
      },
    }));
    onApprove(actionId);
  };

  const handleReject = (actionId: string) => {
    const reason = rejectionReasons[actionId] || 'User rejected';
    setVerificationStates(prev => ({
      ...prev,
      [actionId]: {
        status: 'rejected',
        reason,
        timestamp: Date.now(),
      },
    }));
    onReject(actionId, reason);
  };

  const toggleExpanded = (actionId: string) => {
    setExpandedActions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(actionId)) {
        newSet.delete(actionId);
      } else {
        newSet.add(actionId);
      }
      return newSet;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <FaCheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <FaTimesCircle className="w-5 h-5 text-red-500" />;
      case 'modified':
        return <FaInfoCircle className="w-5 h-5 text-blue-500" />;
      default:
        return <FaClock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'text-gray-500';
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRiskLevel = (action: ActionVerificationProps['actions'][0]) => {
    const risks = [];
    
    // Check for potentially risky actions
    if (action.type === 'submit' || action.type === 'delete') {
      risks.push('destructive');
    }
    
    if (action.warnings && action.warnings.length > 0) {
      risks.push('warnings');
    }
    
    if (action.confidence && action.confidence < 0.7) {
      risks.push('low-confidence');
    }
    
    if (risks.length === 0) return 'low';
    if (risks.includes('destructive')) return 'high';
    if (risks.length > 1) return 'medium';
    return 'medium';
  };

  const getRiskBadge = (riskLevel: string) => {
    const styles = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[riskLevel as keyof typeof styles]}`}>
        {riskLevel.toUpperCase()} RISK
      </span>
    );
  };

  if (actions.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <FaInfoCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>No actions to verify</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Action Verification</h3>
        <span className="text-sm text-gray-500">
          {actions.filter(a => !verificationStates[a.id]?.status).length} pending
        </span>
      </div>

      {actions.map(action => {
        const state = verificationStates[action.id];
        const isExpanded = expandedActions.has(action.id);
        const riskLevel = getRiskLevel(action);
        const isPending = !state?.status;

        return (
          <div
            key={action.id}
            className={`border rounded-lg transition-all ${
              isPending ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
            }`}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  {state ? getStatusIcon(state.status) : <FaClock className="w-5 h-5 text-gray-400" />}
                  <div>
                    <h4 className="font-medium text-gray-900">{action.type}</h4>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {getRiskBadge(riskLevel)}
                  {showConfidence && action.confidence && (
                    <span className={`text-sm font-medium ${getConfidenceColor(action.confidence)}`}>
                      {Math.round(action.confidence * 100)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Element details */}
              {action.element && (
                <div className="ml-8 mt-2 p-2 bg-gray-50 rounded text-sm">
                  <div className="text-gray-600">
                    <span className="font-medium">Element:</span> {action.element.type}
                  </div>
                  <div className="text-gray-600 truncate">
                    <span className="font-medium">Text:</span> {action.element.text}
                  </div>
                  <div className="text-gray-500 font-mono text-xs">
                    {action.element.selector}
                  </div>
                </div>
              )}

                      {action.warnings && action.warnings.length > 0 && (
                        <div className="ml-8 mt-2 space-y-1">
                          {action.warnings.map((warning, index) => (
                            <div key={index} className="flex items-center space-x-2 text-sm text-yellow-600">
                              <FaExclamationTriangle className="w-4 h-4" />
                              <span>{warning}</span>
                            </div>
                          ))}
                        </div>
                      )}

              {/* Rejection reason input */}
              {state?.status === 'rejected' && state.reason && (
                <div className="ml-8 mt-2 p-2 bg-red-50 rounded text-sm text-red-700">
                  <span className="font-medium">Reason:</span> {state.reason}
                </div>
              )}

              {/* Action buttons */}
              {isPending && (
                <div className="ml-8 mt-3 flex items-center space-x-2">
                  {!autoApprove && (
                    <>
                      <button
                        onClick={() => handleApprove(action.id)}
                        className="px-3 py-1 text-sm font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => toggleExpanded(action.id)}
                        className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  {autoApprove && (
                    <span className="text-sm text-gray-500">Auto-approved</span>
                  )}
                </div>
              )}

              {/* Expanded rejection/modification form */}
              {isExpanded && isPending && (
                <div className="ml-8 mt-3 p-3 border-t">
                  {!autoApprove && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Rejection reason (optional)
                        </label>
                        <textarea
                          value={rejectionReasons[action.id] || ''}
                          onChange={(e) => setRejectionReasons(prev => ({
                            ...prev,
                            [action.id]: e.target.value,
                          }))}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={2}
                          placeholder="Why are you rejecting this action?"
                        />
                      </div>
                      <button
                        onClick={() => handleReject(action.id)}
                        className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 transition-colors"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActionVerificationPrompts;

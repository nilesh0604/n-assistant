import React, { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle, Loader2, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@extension/ui/lib/utils';

export interface ValidationStatus {
  isValid: boolean;
  isStable: boolean;
  elementExists: boolean;
  elementVisible: boolean;
  elementEnabled: boolean;
  errors: string[];
  warnings: string[];
  stabilityReason?: string;
  recommendations?: string[];
}

export interface PreActionValidationProps {
  validation: ValidationStatus | null;
  isChecking: boolean;
  className?: string;
}

export function PreActionValidation({ validation, isChecking, className }: PreActionValidationProps) {
  const [showDetails, setShowDetails] = useState(false);

  if (isChecking) {
    return (
      <div className={cn('flex items-center gap-2 p-3 bg-blue-50 rounded-lg', className)}>
        <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
        <span className="text-sm text-blue-700">Validating action...</span>
      </div>
    );
  }

  if (!validation) {
    return null;
  }

  const getStatusIcon = () => {
    if (!validation.elementExists) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    if (!validation.elementVisible) {
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    }
    if (!validation.elementEnabled) {
      return <AlertCircle className="h-4 w-4 text-orange-500" />;
    }
    if (!validation.isStable) {
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    }
    if (validation.errors.length > 0) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    if (validation.warnings.length > 0) {
      return <Info className="h-4 w-4 text-yellow-500" />;
    }
    return <CheckCircle className="h-4 w-4 text-green-500" />;
  };

  const getStatusColor = () => {
    if (!validation.elementExists) return 'bg-red-50 border-red-200';
    if (!validation.elementVisible) return 'bg-orange-50 border-orange-200';
    if (!validation.elementEnabled) return 'bg-orange-50 border-orange-200';
    if (!validation.isStable) return 'bg-yellow-50 border-yellow-200';
    if (validation.errors.length > 0) return 'bg-red-50 border-red-200';
    if (validation.warnings.length > 0) return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  const getStatusText = () => {
    if (!validation.elementExists) return 'Element not found';
    if (!validation.elementVisible) return 'Element not visible';
    if (!validation.elementEnabled) return 'Element not enabled';
    if (!validation.isStable) return 'Element not stable';
    if (validation.errors.length > 0) return 'Validation errors';
    if (validation.warnings.length > 0) return 'Validation warnings';
    return 'Action ready to execute';
  };

  const canExecute = validation.elementExists && 
    validation.elementVisible && 
    validation.elementEnabled && 
    validation.isStable && 
    validation.errors.length === 0;

  return (
    <div className={cn('border rounded-lg p-3 space-y-2', getStatusColor(), className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {getStatusIcon()}
          <span className={cn(
            'text-sm font-medium',
            canExecute ? 'text-green-700' : 'text-red-700'
          )}>
            {getStatusText()}
          </span>
        </div>
        {(validation.warnings.length > 0 || validation.errors.length > 0 || validation.stabilityReason) && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-gray-600 hover:text-gray-800"
          >
            {showDetails ? 'Hide' : 'Show'} details
          </button>
        )}
      </div>

      {/* Quick status indicators */}
      <div className="flex gap-4 text-xs">
        <div className={cn('flex items-center gap-1', validation.elementExists ? 'text-green-600' : 'text-red-600')}>
          <div className={cn('w-2 h-2 rounded-full', validation.elementExists ? 'bg-green-600' : 'bg-red-600')} />
          Exists
        </div>
        <div className={cn('flex items-center gap-1', validation.elementVisible ? 'text-green-600' : 'text-orange-600')}>
          <div className={cn('w-2 h-2 rounded-full', validation.elementVisible ? 'bg-green-600' : 'bg-orange-600')} />
          Visible
        </div>
        <div className={cn('flex items-center gap-1', validation.elementEnabled ? 'text-green-600' : 'text-orange-600')}>
          <div className={cn('w-2 h-2 rounded-full', validation.elementEnabled ? 'bg-green-600' : 'bg-orange-600')} />
          Enabled
        </div>
        <div className={cn('flex items-center gap-1', validation.isStable ? 'text-green-600' : 'text-yellow-600')}>
          <div className={cn('w-2 h-2 rounded-full', validation.isStable ? 'bg-green-600' : 'bg-yellow-600')} />
          Stable
        </div>
      </div>

      {/* Detailed information */}
      {showDetails && (
        <div className="space-y-2 pt-2 border-t border-gray-200">
          {/* Errors */}
          {validation.errors.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-red-700">Errors:</div>
              {validation.errors.map((error, index) => (
                <div key={index} className="text-xs text-red-600 pl-2">
                  • {error}
                </div>
              ))}
            </div>
          )}

          {/* Warnings */}
          {validation.warnings.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-yellow-700">Warnings:</div>
              {validation.warnings.map((warning, index) => (
                <div key={index} className="text-xs text-yellow-600 pl-2">
                  • {warning}
                </div>
              ))}
            </div>
          )}

          {/* Stability information */}
          {validation.stabilityReason && !validation.isStable && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-yellow-700">Stability Issue:</div>
              <div className="text-xs text-yellow-600 pl-2">
                {validation.stabilityReason}
              </div>
              {validation.recommendations && validation.recommendations.length > 0 && (
                <div className="mt-1">
                  <div className="text-xs font-medium text-yellow-700">Recommendations:</div>
                  {validation.recommendations.map((rec, index) => (
                    <div key={index} className="text-xs text-yellow-600 pl-2">
                      • {rec}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Execution status */}
          <div className="pt-2 border-t border-gray-200">
            <div className={cn(
              'text-xs font-medium',
              canExecute ? 'text-green-700' : 'text-red-700'
            )}>
              {canExecute ? '✓ Action can be executed' : '✗ Action cannot be executed'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

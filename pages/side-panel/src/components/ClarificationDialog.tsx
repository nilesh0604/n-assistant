import { useState, useRef, useEffect } from 'react';
import { t } from '@extension/i18n';

interface ClarificationDialogProps {
  isOpen: boolean;
  message: string;
  onSubmit: (clarification: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ClarificationDialog = ({
  isOpen,
  message,
  onSubmit,
  onCancel,
  isLoading = false,
}: ClarificationDialogProps) => {
  const [clarification, setClarification] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
      setClarification('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (clarification.trim() && !isLoading) {
      onSubmit(clarification.trim());
      setClarification('');
    }
  };

  const handleCancel = () => {
    if (!isLoading) {
      setClarification('');
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && !isLoading) {
      handleCancel();
    }
  };

  if (!isOpen) return null;

  console.log('🔍 ClarificationDialog rendering with props:', { isOpen, message, isLoading });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4"
        onKeyDown={handleKeyDown}
      >
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              I need clarification to help you better
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {message}
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="clarification" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Provide more context about your goal
              </label>
              <textarea
                ref={textareaRef}
                id="clarification"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                placeholder="Be more specific about what you want me to do"
                value={clarification}
                onChange={(e) => setClarification(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                For example: instead of 'fill the form', say 'fill the contact form with name John Doe and email john@example.com'
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!clarification.trim() || isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClarificationDialog;

import React, { useState } from 'react';
import { FaEye, FaFilter, FaChevronDown, FaChevronRight, FaInfo } from 'react-icons/fa';

// Simple className utility function
const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export interface ElementInfo {
  index: number;
  tagName: string;
  text: string;
  category: string;
  score: number;
  reasons: string[];
  isVisible: boolean;
}

export interface ProgressiveElementDisclosureProps {
  elements: ElementInfo[];
  totalElements: number;
  filteredCount: number;
  categories: Record<string, number>;
  onElementSelect?: (index: number) => void;
  className?: string;
}

export function ProgressiveElementDisclosure({
  elements,
  totalElements,
  filteredCount,
  categories,
  onElementSelect,
  className,
}: ProgressiveElementDisclosureProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredElement, setHoveredElement] = useState<number | null>(null);
  const [hiddenCategories, setHiddenCategories] = useState<Record<string, boolean>>({});

  // Filter elements by selected category
  const filteredElements = selectedCategory
    ? elements.filter(el => el.category === selectedCategory)
    : elements;

  // Toggle category visibility
  const toggleCategory = (category: string) => {
    setHiddenCategories(prev => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Get category color
  const getCategoryColor = (category: string) => {
    const colors = {
      navigation: 'text-blue-600 bg-blue-50',
      input: 'text-green-600 bg-green-50',
      content: 'text-gray-600 bg-gray-50',
      media: 'text-purple-600 bg-purple-50',
      decoration: 'text-orange-600 bg-orange-50',
      unknown: 'text-gray-500 bg-gray-50',
    };
    return colors[category as keyof typeof colors] || colors.unknown;
  };

  return (
    <div className={cn('border rounded-lg bg-white', className)}>
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaEye className="w-4 h-4 text-gray-500" />
            <h3 className="font-medium text-gray-900">Element Filtering</h3>
          </div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </button>
        </div>

        {/* Summary */}
        <div className="mt-2 text-sm text-gray-600">
          Showing {filteredElements.length} of {totalElements} elements
          {filteredCount < totalElements && ` (${filteredCount} passed filtering)`}
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium text-gray-700">Categories:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'px-3 py-1 rounded-full text-sm transition-colors',
              selectedCategory === null
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            )}
          >
            All ({elements.length})
          </button>
          {Object.entries(categories).map(([category, count]) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-3 py-1 rounded-full text-sm transition-colors flex items-center gap-1',
                selectedCategory === category
                  ? getCategoryColor(category)
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {category} ({count})
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCategory(category);
                }}
                className="ml-1 hover:opacity-70"
              >
                {!hiddenCategories[category] ? (
                  <FaChevronDown className="w-4 h-4" />
                ) : (
                  <FaChevronRight className="w-4 h-4" />
                )}
              </button>
            </button>
          ))}
        </div>
      </div>

      {/* Element List */}
      <div className="max-h-96 overflow-y-auto">
        {filteredElements.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FaFilter className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No elements match the current filters</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredElements
              .filter(el => !hiddenCategories[el.category])
              .map((element) => (
                <div
                  key={element.index}
                  onClick={() => onElementSelect?.(element.index)}
                  onMouseEnter={() => setHoveredElement(element.index)}
                  onMouseLeave={() => setHoveredElement(null)}
                  className={cn(
                    'p-3 cursor-pointer transition-colors',
                    hoveredElement === element.index ? 'bg-gray-50' : '',
                    !element.isVisible ? 'opacity-50' : ''
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-gray-500">
                          #{element.index}
                        </span>
                        <span className={cn(
                          'px-2 py-0.5 rounded text-xs font-medium',
                          getCategoryColor(element.category)
                        )}>
                          {element.category}
                        </span>
                        <span className="text-xs text-gray-500">
                          &lt;{element.tagName}&gt;
                        </span>
                        {!element.isVisible && (
                          <span className="text-xs text-red-500">Hidden</span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-900 truncate">
                        {element.text || <em className="text-gray-400">No text</em>}
                      </div>
                      
                      {showDetails && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Relevance:</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${element.score * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">
                              {(element.score * 100).toFixed(0)}%
                            </span>
                          </div>
                          
                          {element.reasons.length > 0 && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <FaInfo className="w-4 h-4 text-gray-500" />
                                <span className="text-xs text-gray-500">Why relevant:</span>
                              </div>
                              <ul className="text-xs text-gray-600 space-y-0.5 ml-4">
                                {element.reasons.map((reason, index) => (
                                  <li key={index} className="flex items-start gap-1">
                                    <span className="text-gray-400">•</span>
                                    <span>{reason}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t bg-gray-50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {selectedCategory ? `${selectedCategory} category` : 'All categories'}
          </span>
          <span>
            {filteredElements.filter(el => !hiddenCategories[el.category]).length} visible
          </span>
        </div>
      </div>
    </div>
  );
}

export const ProgressiveElementDisclosureUI = ProgressiveElementDisclosure;

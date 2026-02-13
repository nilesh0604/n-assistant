import React, { useState } from 'react';
import { FaTag, FaFilter, FaSearch, FaChevronDown, FaChevronRight, FaInfoCircle } from 'react-icons/fa';

interface SemanticCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon?: React.ReactNode;
  count?: number;
}

interface ClassifiedElement {
  id: string;
  selector: string;
  text: string;
  type: string;
  categories: string[];
  confidence: number;
  relevanceScore: number;
  attributes: Record<string, unknown>;
}

interface SemanticClassificationProps {
  elements: ClassifiedElement[];
  categories: SemanticCategory[];
  onCategoryFilter: (categoryIds: string[]) => void;
  onElementSelect: (elementIds: string[]) => void;
  onRelevanceThresholdChange: (threshold: number) => void;
  showConfidence?: boolean;
  showRelevanceScore?: boolean;
  enableMultiSelect?: boolean;
}

export const SemanticClassificationUI: React.FC<SemanticClassificationProps> = ({
  elements,
  categories,
  onCategoryFilter,
  onElementSelect,
  onRelevanceThresholdChange,
  showConfidence = true,
  showRelevanceScore = true,
  enableMultiSelect = true,
}) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedElements, setSelectedElements] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [relevanceThreshold, setRelevanceThreshold] = useState(0.5);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Filter elements based on selected categories and search
  const filteredElements = elements.filter(element => {
      // Category filter
      if (selectedCategories.length > 0) {
        const hasSelectedCategory = element.categories.some(cat => 
          selectedCategories.includes(cat)
        );
        if (!hasSelectedCategory) return false;
      }

      // Relevance threshold filter
      if (element.relevanceScore < relevanceThreshold) return false;

      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          element.text.toLowerCase().includes(searchLower) ||
          element.type.toLowerCase().includes(searchLower) ||
          element.selector.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });

  // Group elements by categories
  const elementsByCategory: Record<string, ClassifiedElement[]> = {};
  
  filteredElements.forEach(element => {
    element.categories.forEach(categoryId => {
      if (!elementsByCategory[categoryId]) {
        elementsByCategory[categoryId] = [];
      }
      elementsByCategory[categoryId].push(element);
    });
  });

  // Sort elements within each category by relevance score
  Object.keys(elementsByCategory).forEach(categoryId => {
    elementsByCategory[categoryId].sort((a, b) => b.relevanceScore - a.relevanceScore);
  });

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      onCategoryFilter(Array.from(newSet));
      return Array.from(newSet);
    });
  };

  const handleElementToggle = (elementId: string) => {
    if (!enableMultiSelect) {
      setSelectedElements(new Set([elementId]));
      onElementSelect([elementId]);
      return;
    }

    setSelectedElements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(elementId)) {
        newSet.delete(elementId);
      } else {
        newSet.add(elementId);
      }
      onElementSelect(Array.from(newSet));
      return newSet;
    });
  };

  const handleSelectAll = () => {
    const allElementIds = filteredElements.map(e => e.id);
    setSelectedElements(new Set(allElementIds));
    onElementSelect(allElementIds);
  };

  const handleClearSelection = () => {
    setSelectedElements(new Set());
    onElementSelect([]);
  };

  const toggleCategoryExpanded = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-600';
    if (confidence >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Semantic Classification</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
            >
              <FaFilter className="w-4 h-4" />
            </button>
            {enableMultiSelect && (
              <>
                <button
                  onClick={handleSelectAll}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Select All
                </button>
                <button
                  onClick={handleClearSelection}
                  className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
                >
                  Clear
                </button>
              </>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search elements..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category filters */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Categories</span>
            <span className="text-xs text-gray-500">
              {selectedCategories.length} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleCategoryToggle(category.id)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-all ${
                  selectedCategories.includes(category.id)
                    ? 'text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                style={{
                  backgroundColor: selectedCategories.includes(category.id) 
                    ? category.color 
                    : undefined,
                }}
              >
                <FaTag className="w-3 h-3 inline mr-1" />
                {category.name}
                {category.count !== undefined && (
                  <span className="ml-1 text-xs opacity-75">({category.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Relevance threshold */}
        {showRelevanceScore && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Relevance Threshold</span>
              <span className="text-sm text-gray-500">{Math.round(relevanceThreshold * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={relevanceThreshold}
              onChange={(e) => {
                const value = parseFloat(e.target.value);
                setRelevanceThreshold(value);
                onRelevanceThresholdChange(value);
              }}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Elements list */}
      <div className="flex-1 overflow-y-auto p-4">
        {Object.entries(elementsByCategory).map(([categoryId, categoryElements]) => {
          const category = categories.find(c => c.id === categoryId);
          const isExpanded = expandedCategories.has(categoryId);

          if (!category) return null;

          return (
            <div key={categoryId} className="mb-6">
              <button
                onClick={() => toggleCategoryExpanded(categoryId)}
                className="flex items-center space-x-2 w-full text-left mb-2"
              >
                {isExpanded ? (
                  <FaChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <FaChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="font-medium text-gray-900">{category.name}</span>
                <span className="text-sm text-gray-500">({categoryElements.length})</span>
              </button>

              {isExpanded && (
                <div className="ml-5 space-y-2">
                  {categoryElements.map(element => (
                    <div
                      key={element.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        selectedElements.has(element.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleElementToggle(element.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium text-gray-900 truncate">
                              {element.text}
                            </span>
                            <span className="text-xs text-gray-500">{element.type}</span>
                          </div>
                          <div className="text-xs text-gray-500 font-mono truncate">
                            {element.selector}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-2">
                          {showRelevanceScore && (
                            <span className={`px-2 py-1 text-xs font-medium rounded ${getRelevanceColor(element.relevanceScore)}`}>
                              {Math.round(element.relevanceScore * 100)}%
                            </span>
                          )}
                          {showConfidence && (
                            <span className={`text-xs font-medium ${getConfidenceColor(element.confidence)}`}>
                              {Math.round(element.confidence * 100)}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {filteredElements.length === 0 && (
          <div className="text-center py-8">
            <FaInfoCircle className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500">No elements match your filters</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {selectedElements.size > 0 && (
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">
              {selectedElements.size} element{selectedElements.size !== 1 ? 's' : ''} selected
            </span>
              <button
                onClick={() => {
                  setSelectedElements(new Set());
                  onElementSelect([]);
                }}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Clear selection
              </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SemanticClassificationUI;

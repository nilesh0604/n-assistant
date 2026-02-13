import React, { useState, useRef } from 'react';
import { FaCrosshairs, FaSearchPlus, FaSearchMinus, FaSync, FaLayerGroup, FaBullseye, FaTimes } from 'react-icons/fa';

interface ViewportRegion {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  priority: 'high' | 'medium' | 'low';
  elements: Array<{
    id: string;
    selector: string;
    text: string;
    type: string;
    visible: boolean;
    interactive: boolean;
  }>;
}

interface ViewportConfig {
  width: number;
  height: number;
  scrollX: number;
  scrollY: number;
  zoom: number;
  focusRegion?: ViewportRegion;
  showOnlyVisible: boolean;
  prioritizeInteractive: boolean;
}

interface ViewportFocusedProcessingProps {
  config: ViewportConfig;
  regions: ViewportRegion[];
  onConfigChange: (config: Partial<ViewportConfig>) => void;
  onRegionSelect: (regionId: string) => void;
  onRegionCreate: (region: Omit<ViewportRegion, 'id'>) => void;
  onRegionDelete: (regionId: string) => void;
}

export const ViewportFocusedProcessingUI: React.FC<ViewportFocusedProcessingProps> = ({
  config,
  regions,
  onConfigChange,
  onRegionSelect,
  onRegionCreate,
  onRegionDelete,
}) => {
  const [isCreatingRegion, setIsCreatingRegion] = useState(false);
  const [newRegionStart, setNewRegionStart] = useState<{ x: number; y: number } | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const viewportRef = useRef<null | { getBoundingClientRect(): { top: number; left: number; width: number; height: number } }>(null);

  // Calculate visible elements based on viewport
  const getVisibleElements = () => {
    const allElements = regions.flatMap(r => r.elements);
    if (!config.showOnlyVisible) return allElements;
    
    return allElements.filter(element => {
      // Simple visibility check - in real implementation, this would use actual viewport calculations
      return element.visible;
    });
  };

  const handleViewportMouseDown = (e: React.MouseEvent) => {
    if (!isCreatingRegion) return;
    
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = (e.clientX - rect.left) / config.zoom;
    const y = (e.clientY - rect.top) / config.zoom;
    
    setNewRegionStart({ x, y });
  };

  const handleViewportMouseMove = () => {
    if (!isCreatingRegion || !newRegionStart) return;
    
    // Update preview region (would render in real implementation)
  };

  const handleViewportMouseUp = (e: React.MouseEvent) => {
    if (!isCreatingRegion || !newRegionStart) return;
    
    const rect = viewportRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const endX = (e.clientX - rect.left) / config.zoom;
    const endY = (e.clientY - rect.top) / config.zoom;
    
    const region = {
      name: `Region ${regions.length + 1}`,
      x: Math.min(newRegionStart.x, endX),
      y: Math.min(newRegionStart.y, endY),
      width: Math.abs(endX - newRegionStart.x),
      height: Math.abs(endY - newRegionStart.y),
      priority: 'medium' as const,
      elements: [], // Would be populated based on elements in region
    };
    
    if (region.width > 10 && region.height > 10) {
      onRegionCreate(region);
    }
    
    setIsCreatingRegion(false);
    setNewRegionStart(null);
  };

  const handleRegionClick = (regionId: string) => {
    setSelectedRegion(regionId);
    onRegionSelect(regionId);
  };

  const handleZoomIn = () => {
    onConfigChange({ zoom: Math.min(config.zoom * 1.2, 3) });
  };

  const handleZoomOut = () => {
    onConfigChange({ zoom: Math.max(config.zoom / 1.2, 0.5) });
  };

  const handleResetViewport = () => {
    onConfigChange({
      scrollX: 0,
      scrollY: 0,
      zoom: 1,
    });
  };

  const getPriorityColor = (priority: ViewportRegion['priority']) => {
    switch (priority) {
      case 'high':
        return 'border-red-500 bg-red-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: ViewportRegion['priority']) => {
    const styles = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-gray-100 text-gray-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded ${styles[priority]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  const visibleElements = getVisibleElements();
  const interactiveElements = visibleElements.filter(e => e.interactive);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Viewport Processing</h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsCreatingRegion(!isCreatingRegion)}
              className={`px-3 py-1 text-sm font-medium rounded transition-colors ${
                isCreatingRegion
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <FaCrosshairs className="w-4 h-4 inline mr-1" />
              {isCreatingRegion ? 'Creating...' : 'Create Region'}
            </button>
            <button
              onClick={handleResetViewport}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              <FaSync className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewport controls */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Zoom</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleZoomOut}
                className="p-1 text-gray-600 hover:text-gray-800"
              >
                <FaSearchMinus className="w-4 h-4" />
              </button>
              <span className="text-sm font-medium w-12 text-center">
                {Math.round(config.zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-1 text-gray-600 hover:text-gray-800"
              >
                <FaSearchPlus className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <div className="text-sm text-gray-600">
              X: {Math.round(config.scrollX)}, Y: {Math.round(config.scrollY)}
            </div>
          </div>
        </div>

        {/* Processing options */}
        <div className="space-y-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.showOnlyVisible}
              onChange={(e) => onConfigChange({ showOnlyVisible: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Show only visible elements</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={config.prioritizeInteractive}
              onChange={(e) => onConfigChange({ prioritizeInteractive: e.target.checked })}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Prioritize interactive elements</span>
          </label>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-2 bg-gray-50 border-b">
        <div className="flex items-center justify-around text-sm">
          <div className="text-center">
            <div className="font-medium text-gray-900">{visibleElements.length}</div>
            <div className="text-gray-600">Visible</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900">{interactiveElements.length}</div>
            <div className="text-gray-600">Interactive</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-900">{regions.length}</div>
            <div className="text-gray-600">Regions</div>
          </div>
        </div>
      </div>

      {/* Viewport preview */}
      <div className="flex-1 overflow-hidden p-4">
        <div className="h-full bg-gray-100 rounded-lg overflow-hidden relative">
          <div
            ref={viewportRef as any} // eslint-disable-line @typescript-eslint/no-explicit-any
            className="w-full h-full bg-white relative overflow-hidden cursor-crosshair"
            style={{
              transform: `scale(${config.zoom})`,
              transformOrigin: 'top left',
            }}
            onMouseDown={handleViewportMouseDown}
            onMouseMove={handleViewportMouseMove}
            onMouseUp={handleViewportMouseUp}
          >
            {/* Simulated page content */}
            <div className="absolute inset-0 p-4">
              <div className="max-w-4xl mx-auto space-y-4">
                <div className="h-8 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-gray-200 rounded"></div>
                  <div className="h-24 bg-gray-200 rounded"></div>
                </div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>

            {/* Regions overlay */}
            {regions.map(region => (
              <div
                key={region.id}
                className={`absolute border-2 cursor-pointer transition-all ${
                  selectedRegion === region.id ? 'ring-2 ring-blue-500' : ''
                } ${getPriorityColor(region.priority)}`}
                style={{
                  left: `${region.x}px`,
                  top: `${region.y}px`,
                  width: `${region.width}px`,
                  height: `${region.height}px`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleRegionClick(region.id);
                }}
              >
                <div className="p-1">
                  <div className="text-xs font-medium truncate">{region.name}</div>
                  <div className="text-xs opacity-75">{region.elements.length} elements</div>
                </div>
              </div>
            ))}

            {/* New region preview */}
            {isCreatingRegion && newRegionStart && (
              <div className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-30 pointer-events-none">
                {/* Would show preview rectangle */}
              </div>
            )}
          </div>

          {/* Viewport info overlay */}
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-2 rounded text-xs">
            <div>Viewport: {config.width} × {config.height}</div>
            <div>Zoom: {Math.round(config.zoom * 100)}%</div>
          </div>
        </div>
      </div>

      {/* Regions list */}
      <div className="border-t p-4">
        <h4 className="font-medium text-gray-900 mb-2">Focus Regions</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {regions.map(region => (
            <div
              key={region.id}
              className={`flex items-center justify-between p-2 rounded border cursor-pointer transition-all ${
                selectedRegion === region.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleRegionClick(region.id)}
            >
              <div className="flex items-center space-x-3">
                <FaBullseye className="w-4 h-4 text-gray-400" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{region.name}</div>
                  <div className="text-xs text-gray-600">
                    {Math.round(region.width)} × {Math.round(region.height)} at ({Math.round(region.x)}, {Math.round(region.y)})
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getPriorityBadge(region.priority)}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRegionDelete(region.id);
                  }}
                  className="p-1 text-red-600 hover:text-red-700"
                >
                  <FaTimes className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
          {regions.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              <FaLayerGroup className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No focus regions defined</p>
              <p className="text-xs">Click "Create Region" and drag on the viewport</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewportFocusedProcessingUI;

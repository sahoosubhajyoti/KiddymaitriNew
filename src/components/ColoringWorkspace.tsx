"use client";

import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { ArrowLeft, Download, Check, Undo, Redo, RefreshCw } from 'lucide-react';

interface WorkspaceProps {
  initialSvgContent: string;
  title: string;
  onBack: () => void;
}

const COLORS = [
  '#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3',
  '#FFC0CB', '#A52A2A', '#808080', '#000000', '#FFFFFF', '#00FFFF', '#FF00FF'
];

// --- SUB-COMPONENT: MEMOIZED CANVAS ---
const CanvasArea = memo(({ content, onInteract }: { content: string, onInteract: (e: React.MouseEvent) => void }) => {
  return (
    <div 
      className="w-full h-full p-4 flex items-center justify-center cursor-crosshair svg-workspace"
      onClick={onInteract}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
});
CanvasArea.displayName = "CanvasArea";

// Define what a history action looks like
interface HistoryAction {
  target: HTMLElement;
  oldColor: string;
  newColor: string;
}

export default function ColoringWorkspace({ initialSvgContent, title, onBack }: WorkspaceProps) {
  const [selectedColor, setSelectedColor] = useState<string>('#FF0000');
  
  // State for UI buttons (Enable/Disable)
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  // Key to force re-render on Refresh
  const [canvasKey, setCanvasKey] = useState(0);

  // Refs for logic (Stable across renders)
  const colorRef = useRef(selectedColor);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // History Stacks
  const historyRef = useRef<HistoryAction[]>([]);
  const redoStackRef = useRef<HistoryAction[]>([]);

  // Sync color ref
  useEffect(() => {
    colorRef.current = selectedColor;
  }, [selectedColor]);

  // --- 1. HANDLE CLICK (PAINT) ---
  const handleSvgClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const currentColor = colorRef.current; 

    if (['path', 'circle', 'rect', 'polygon', 'ellipse'].includes(target.tagName)) {
      const stroke = target.getAttribute('stroke');
      const strokeWidth = target.getAttribute('stroke-width');

      // Ignore black outlines
      if (stroke === '#000000' || stroke === 'black' || (strokeWidth && parseFloat(strokeWidth) > 1)) {
         return; 
      }

      // 1. Capture Old Color (Handle both style and attribute)
      const oldColor = target.style.fill || target.getAttribute('fill') || '#ffffff'; // Default to white if none

      // Avoid adding to history if color hasn't changed
      if (oldColor === currentColor) return;

      // 2. Apply New Color (DOM Direct Manipulation)
      target.style.fill = currentColor;
      target.setAttribute('fill', currentColor);

      // 3. Save to History
      historyRef.current.push({ target, oldColor, newColor: currentColor });
      
      // 4. Clear Redo Stack (Branching history clears future)
      redoStackRef.current = [];

      // 5. Update UI State
      setCanUndo(true);
      setCanRedo(false);
    }
  }, []); 

  // --- 2. UNDO ---
  const handleUndo = () => {
    const history = historyRef.current;
    if (history.length === 0) return;

    // Pop the last action
    const action = history.pop();
    if (action) {
      // Revert DOM
      action.target.style.fill = action.oldColor;
      action.target.setAttribute('fill', action.oldColor);

      // Move to Redo Stack
      redoStackRef.current.push(action);

      // Update UI
      setCanUndo(history.length > 0);
      setCanRedo(true);
    }
  };

  // --- 3. REDO ---
  const handleRedo = () => {
    const redoStack = redoStackRef.current;
    if (redoStack.length === 0) return;

    // Pop from Redo
    const action = redoStack.pop();
    if (action) {
      // Re-apply DOM
      action.target.style.fill = action.newColor;
      action.target.setAttribute('fill', action.newColor);

      // Move back to History
      historyRef.current.push(action);

      // Update UI
      setCanUndo(true);
      setCanRedo(redoStack.length > 0);
    }
  };

  // --- 4. REFRESH (RESET) ---
  const handleRefresh = () => {
    if (confirm("Are you sure you want to clear your drawing?")) {
      // Clear history
      historyRef.current = [];
      redoStackRef.current = [];
      setCanUndo(false);
      setCanRedo(false);
      
      // Force Re-render of CanvasArea by changing its key
      setCanvasKey(prev => prev + 1);
    }
  };

  // --- 5. SAVE ---
  const handleSave = () => {
    if (!containerRef.current) return;
    const svgElement = containerRef.current.querySelector('svg');
    if (!svgElement) return;

    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgElement);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title || 'coloring'}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 top-0 left-0 bg-white z-50 flex flex-col h-screen w-screen overflow-hidden">
      
      {/* HEADER */}
      <div className="h-16 bg-white border-b flex items-center justify-between px-4 shadow-sm shrink-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft className="text-slate-700" />
          </button>
          <h2 className="text-xl font-bold text-slate-800 capitalize truncate max-w-[150px] md:max-w-xs">
            {title}
          </h2>
        </div>

        {/* TOOLBAR ACTIONS */}
        <div className="flex items-center gap-2">
          {/* Undo */}
          <button 
            onClick={handleUndo} 
            disabled={!canUndo}
            className={`p-2 rounded-full transition-colors ${canUndo ? 'hover:bg-slate-100 text-slate-700' : 'text-slate-300 cursor-not-allowed'}`}
            title="Undo"
          >
            <Undo size={20} />
          </button>

          {/* Redo */}
          <button 
            onClick={handleRedo} 
            disabled={!canRedo}
            className={`p-2 rounded-full transition-colors ${canRedo ? 'hover:bg-slate-100 text-slate-700' : 'text-slate-300 cursor-not-allowed'}`}
            title="Redo"
          >
            <Redo size={20} />
          </button>

          {/* Refresh */}
          <button 
            onClick={handleRefresh}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-700 transition-colors mr-2"
            title="Reset All"
          >
            <RefreshCw size={20} />
          </button>

          {/* Save */}
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>
      </div>

      {/* WORKSPACE BODY */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* PALETTE */}
        <div className="order-2 md:order-1 bg-slate-50 border-t md:border-t-0 md:border-r p-4 flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 h-20 md:h-full md:w-24 items-center hide-scrollbar">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-10 h-10 md:w-12 md:h-12 rounded-full border-2 shadow-sm shrink-0 transition-transform hover:scale-110 ${
                selectedColor === color ? 'border-slate-800 scale-110 ring-2 ring-indigo-200' : 'border-white'
              }`}
              style={{ backgroundColor: color }}
            >
               {selectedColor === color && (
                <Check className={`mx-auto w-5 h-5 ${['#FFFFFF', '#FFFF00'].includes(color) ? 'text-black' : 'text-white'}`} />
              )}
            </button>
          ))}
        </div>

        {/* CANVAS AREA */}
        <div className="order-1 md:order-2 flex-1 bg-slate-100 relative overflow-auto flex items-center justify-center p-4 md:p-10">
          <div 
            ref={containerRef}
            className="bg-white shadow-lg rounded-xl overflow-hidden w-full max-w-3xl aspect-square md:aspect-[4/3] relative"
          >
            {/* key={canvasKey} forces the component to destroy and rebuild on Refresh */}
            <CanvasArea 
              key={canvasKey} 
              content={initialSvgContent} 
              onInteract={handleSvgClick} 
            />
          </div>
        </div>

      </div>

      <style jsx global>{`
        .svg-workspace svg {
          width: 100%;
          height: 100%;
          max-height: 100%;
          pointer-events: all; 
        }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
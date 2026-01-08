"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Undo, Download, ArrowLeft } from 'lucide-react';

// --- Types ---
interface ColoringWorkspaceProps {
  initialSvgContent: string;
  title: string;
  onBack?: () => void; // Optional: Handles navigation back to image list
}

// A dictionary to map ID -> Color string
type FillState = Record<string, string>;

export default function ColoringWorkspace({ initialSvgContent, title, onBack }: ColoringWorkspaceProps) {
  // 1. State
  const [history, setHistory] = useState<FillState[]>([{}]); 
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>('#3b82f6');
  
  // 2. Ref to access the SVG in the DOM
  const containerRef = useRef<HTMLDivElement>(null);

  const fills = history[currentStep];

  const PALETTE: string[] = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', 
    '#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', 
    '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#ffffff', '#000000',
    '#94a3b8', '#475569'
  ];

  // --- Effect: Sync State to DOM ---
  // We run this on every render to ensure colors persist if the DOM resets
  useEffect(() => {
    if (!containerRef.current) return;

    // Apply colors to the specific IDs found in the history
    Object.entries(fills).forEach(([id, color]) => {
      const element = containerRef.current?.querySelector(`#${id}`) as HTMLElement | SVGElement;
      if (element) {
        element.style.fill = color;
      }
    });
  }); 

  // --- Event Handler: The Click ---
  const handleSvgClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Find the closest SVG shape that was clicked
    const target = (e.target as Element).closest('path, circle, rect, polygon, ellipse');
    
    // Safety checks
    if (target && containerRef.current && containerRef.current.contains(target)) {
      const el = target as SVGElement;
      
      // If the SVG part has no ID, we cannot track it for undo/redo
      if (!el.id) return; 

      const newFills: FillState = { ...fills, [el.id]: selectedColor };
      const newHistory = history.slice(0, currentStep + 1);
      
      setHistory([...newHistory, newFills]);
      setCurrentStep(newHistory.length);
    }
  };

  const handleUndo = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      
      // Visual Reset Logic
      const prevFills = history[prevStep];
      const allElements = containerRef.current?.querySelectorAll('path, circle, rect, polygon, ellipse');
      
      allElements?.forEach((node) => {
         const el = node as SVGElement;
         if (el.id) {
            // Restore previous color, or revert to white/transparent if it wasn't colored
            el.style.fill = prevFills[el.id] || ''; 
         }
      });
    }
  };

  const handleDownload = () => {
    if (!containerRef.current) return;
    
    // Get the current SVG XML
    const svgData = containerRef.current.innerHTML;
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '-').toLowerCase()}-colored.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-4">
            {/* Back Button Logic */}
            {onBack ? (
                <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                    <ArrowLeft size={20} />
                </button>
            ) : (
                <a href="/coloring" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600">
                    <ArrowLeft size={20} />
                </a>
            )}
            <h1 className="font-bold text-lg capitalize text-slate-800">{title}</h1>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={handleUndo} 
                disabled={currentStep === 0} 
                className="p-2 bg-slate-100 text-slate-700 rounded hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Undo"
            >
                <Undo size={20}/>
            </button>
            <button 
                onClick={handleDownload} 
                className="flex gap-2 items-center bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors shadow-sm"
            >
                <Download size={18}/> 
                <span className="text-sm font-medium">Save</span>
            </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Palette */}
        <aside className="w-20 bg-white border-r border-slate-200 overflow-y-auto p-4 flex flex-col gap-3 items-center shadow-inner z-10">
            {PALETTE.map(c => (
                <button 
                    key={c} 
                    onClick={() => setSelectedColor(c)}
                    style={{backgroundColor: c}} 
                    className={`
                        w-10 h-10 rounded-full border border-slate-200 shadow-sm transition-transform hover:scale-110 flex-shrink-0
                        ${selectedColor === c ? 'ring-2 ring-indigo-500 ring-offset-2 scale-110' : ''}
                    `}
                    aria-label={`Select color ${c}`}
                />
            ))}
        </aside>

        {/* Main Canvas */}
        <main className="flex-1 bg-slate-100 flex items-center justify-center p-8 overflow-auto">
            <div className="bg-white shadow-2xl p-0 overflow-hidden border border-slate-200 rounded-sm w-full max-w-[600px] aspect-square">
                <div 
                    ref={containerRef}
                    className="w-full h-full svg-container cursor-crosshair"
                    // Important: This injects the raw SVG string into the DOM
                    dangerouslySetInnerHTML={{ __html: initialSvgContent }}
                    onClick={handleSvgClick}
                />
            </div>
        </main>
      </div>
    </div>
  );
}
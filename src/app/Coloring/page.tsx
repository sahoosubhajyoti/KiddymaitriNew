"use client";

import React, { useState, useEffect } from 'react';
import { Layers, ArrowLeft, Loader2 } from 'lucide-react';
// Make sure this path points to your ColoringWorkspace component
import ColoringWorkspace from '@/components/ColoringWorkspace'; 
// Import your custom axios instance
import api from "../../utility/axiosInstance"; 

// --- Types ---
interface Group {
  id: number;
  name: string;
  slug: string;
}

interface ImageItem {
  id: number;
  title: string;
  svg_url: string;
  group: number;
}

export default function ColoringPage() {
  // --- State Management ---
  const [view, setView] = useState<'GROUPS' | 'IMAGES' | 'WORKSPACE'>('GROUPS');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data storage
  const [groups, setGroups] = useState<Group[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  
  // Selection state
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [svgContent, setSvgContent] = useState<string>('');

  // --- 1. Fetch Groups on Load (Using your API instance) ---
  useEffect(() => {
    setLoading(true);
    // Matches your reference code pattern
    api
      .get("/colouring/groups/")
      .then((res) => {
        setGroups(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching groups:", err);
        setError("Could not load categories.");
        setLoading(false);
      });
  }, []);

  // --- 2. Handle Group Selection -> Fetch Images ---
  const handleSelectGroup = (group: Group) => {
    setSelectedGroup(group);
    setLoading(true);
    setError(null);
    
    // Using your API instance
    api
      .get(`/colouring/images/`)
      .then((res) => {
        const data = res.data;
        // Handle pagination if your API returns { results: [...] } or just [...]
        const imageList = Array.isArray(data) ? data : data.results || [];
        
        setImages(imageList);
        
        if (imageList.length === 0) {
            setError("No images found in this category.");
        } else {
            setView('IMAGES');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching images:", err);
        setError("Could not load images.");
        setLoading(false);
      });
  };

  // --- 3. Handle Image Selection -> Fetch SVG Content ---
  const handleSelectImage = (image: ImageItem) => {
    setSelectedImage(image);
    setLoading(true);
    setError(null);

    // Prepare the URL. If the API returns a full URL (http...), use it directly.
    // If it returns a relative path (/media/...), combine it with your backend base URL if needed.
    // NOTE: If 'svg_url' is a full URL, api.get might append it to baseURL. 
    // We check if it starts with http.
    const url = image.svg_url;

    // We must tell axios to expect 'text' response, not JSON, because it's an SVG file.
    api.get(url, { 
        responseType: 'text',
        // If the URL is absolute (http...), we might need to override the baseURL of the instance
        baseURL: url.startsWith('http') ? '' : undefined 
      })
      .then((res) => {
        setSvgContent(res.data); // res.data will be the raw SVG string
        setView('WORKSPACE');
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading SVG:", err);
        setError("Could not load the coloring canvas.");
        setLoading(false);
      });
  };

  // --- Render Helpers ---
  
  // VIEW 1: Group List
  if (view === 'GROUPS') {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 px-6 font-sans">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-slate-800 mb-2">Coloring Library</h1>
          <p className="text-slate-500 mb-10">Select a category to start</p>

          {loading && <div className="flex justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>}
          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => handleSelectGroup(group)}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-slate-100 hover:border-indigo-100 p-8 flex flex-col items-center gap-4 group"
              >
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-full group-hover:scale-110 transition-transform">
                  <Layers size={32} />
                </div>
                <h3 className="font-semibold text-lg text-slate-700 capitalize group-hover:text-indigo-600">
                  {group.name}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // VIEW 2: Image List
  if (view === 'IMAGES') {
    return (
      <div className="min-h-screen bg-slate-50 pt-20 px-6 font-sans">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <button 
              onClick={() => setView('GROUPS')} 
              className="p-2 bg-white rounded-full hover:bg-slate-100 border border-slate-200"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
            <h1 className="text-3xl font-bold text-slate-800 capitalize">{selectedGroup?.name}</h1>
          </div>

          {loading && <div className="flex justify-center"><Loader2 className="animate-spin text-indigo-600" size={40} /></div>}
          {error && <div className="text-red-500 text-center">{error}</div>}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((img) => (
              <button
                key={img.id}
                onClick={() => handleSelectImage(img)}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all border border-slate-100 hover:border-indigo-100 p-4 text-left group"
              >
                <div className="aspect-square flex items-center justify-center mb-4 bg-slate-50 rounded-lg relative overflow-hidden">
                  <img 
                    src={img.svg_url} 
                    alt={img.title} 
                    className="w-3/4 h-3/4 object-contain opacity-70 group-hover:opacity-100 transition-opacity" 
                  />
                </div>
                <h3 className="font-semibold text-slate-700 truncate group-hover:text-indigo-600">
                  {img.title}
                </h3>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // VIEW 3: Workspace
  if (view === 'WORKSPACE' && selectedImage) {
    return (
      <div className="relative pt-10">
         {/* Pass onBack so the component knows how to return to the list */}
        <ColoringWorkspace 
            initialSvgContent={svgContent} 
            title={selectedImage.title} 
            onBack={() => setView('IMAGES')}
        />
      </div>
    );
  }

  return null;
}
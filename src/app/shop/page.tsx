import React from 'react';
// Note: Adjust this import path based on your project structure.
// This path assumes 'components' is at the root, next to 'app'.
import PositionedBox from '@/components/Box';

export default function ShopPage() {
  return (
    // Applying only the gradient classes
    <div className="min-h-screen bg-gradient-to-bl to-[#7623ce] from-[#f76f8e] p-6 text-white">
      
      {/* Your shop content goes here */}
      <PositionedBox />
    </div>
  );
}
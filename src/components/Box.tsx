"use client"; // Required because we use the useRouter hook

import React from 'react';
// 1. IMPORT from 'next/navigation' instead of 'react-router-dom'
import { useRouter } from 'next/navigation'; 

// Note: The unused 'm' import from framer-motion has been removed.

export default function PositionedBox() {
  // 2. USE the useRouter hook from Next.js
  const router = useRouter(); 
  
  // All your inline style objects (boxStyle, sanskritTextStyle, etc.) remain here...
    const boxStyle = {
    // --- Box Shape & Position ---
    top: '80px',
    left: '20px',
    width: '350px',
    height: '400px',
   // clipPath: 'path("M 150,16 L 285,16 A 15,16 0 0 1 300,32 L 300,384 A 15,16 0 0 1 285,400 L 15,400 A 15,16 0 0 1 0,384 L 0,80 L 135,80 A 15,16 0 0 0 150,64 Z")',
    //clipPath: 'path("M180,0 A20 20 0 0 1 200,20 L200,30 A20 20 0 0 1 214,64 L236,86 A20 20 0 0 1 270,100 L330,100 A20 20 0 0 1 364,114 L386,136 A20 20 0 0 1 400,170 L400,430 A20 20 0 0 1 386,464 L364,486 A20 20 0 0 1 330,500 L70,500 A20 20 0 0 1 36,486 L14,464 A20 20 0 0 1 0,430 L0,70 A20 20 0 0 1 14,36 L36,14 A20 20 0 0 1 70,0 L180,0 Z")',
    // --- Glassmorphism & Background ---
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(30px)',
    backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0.1), rgba(118, 35, 206, 0.3))',
    backgroundSize: '30px',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    borderRadius: '20px',

    // --- Content Layout & Styling ---
    padding: '30px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.9)',
  };

  const sanskritTextStyle = {
    fontSize: '1.5rem',
    fontWeight: '600',
    marginBottom: '1rem',
    marginTop: '0.5rem',
    lineHeight: '1.2',
  };

  const englishTextStyle = {
    fontSize: '1.2rem',
    lineHeight: '1.5',
    marginBottom: '1.5rem', // Added space between text and button
  };

  const buttonStyle = {
    backgroundColor: 'white',
    color: 'rgba(0, 0, 0, 0.9)',
    border: 'none',
    borderRadius: '50px', // For fully rounded edges
    padding: '12px 28px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'transform 0.2s ease', // Smooth transition for hover effect
  };


  return (
    <div style={boxStyle}>
      <div >
        <h2 style={sanskritTextStyle}>संस्कृतं जीवनस्य सौन्दर्यम्</h2>
        <p style={englishTextStyle}>
          Interactive worksheets + Early Sanskrit learning = a fun and enriching start for your child!
        </p>
        <button 
          style={buttonStyle}
          onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
          // 3. NAVIGATE using router.push()
          onClick={() => router.push('/product')} 
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
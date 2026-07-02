"use client";

import React from 'react';

const AmbientBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
      {/* Top Left Spotlight Blob - Purple */}
      <div className="absolute top-[-5%] left-[-10%] w-[250px] h-[250px] md:w-[750px] md:h-[750px] rounded-full bg-[#BD20D3]/12 blur-[60px] md:blur-[160px] animate-float-slow" />
      
      {/* Bottom Right Spotlight Blob - Blue */}
      <div className="absolute bottom-[-5%] right-[-10%] w-[250px] h-[250px] md:w-[750px] md:h-[750px] rounded-full bg-[#1A4BFF]/8 blur-[60px] md:blur-[160px] animate-float-delayed" />
      
      {/* Mid Right Spotlight Blob - Purple/Magenta */}
      <div className="absolute top-[30%] right-[-10%] w-[180px] h-[180px] md:w-[550px] md:h-[550px] rounded-full bg-[#BD20D3]/8 blur-[50px] md:blur-[140px] animate-float-delayed [animation-delay:3s]" />
      
      {/* Mid Left Spotlight Blob - Cyber Blue */}
      <div className="absolute bottom-[25%] left-[-10%] w-[180px] h-[180px] md:w-[550px] md:h-[550px] rounded-full bg-[#1A4BFF]/8 blur-[50px] md:blur-[140px] animate-float-slow [animation-delay:6s]" />

      {/* Subtle Central Pulse Spotlight */}
      <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[600px] md:h-[600px] rounded-full bg-[#BD20D3]/4 blur-[80px] md:blur-[180px] animate-pulse [animation-duration:10s]" />
    </div>
  );
};

export default AmbientBackground;
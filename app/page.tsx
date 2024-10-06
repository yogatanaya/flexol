// app/page.tsx
"use client";

import React from 'react';
import Grid from '@/components/Grid';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Fixed background gradient */}
      <div className="bg-gradient-to-br from-indigo-400 via-purple-600  to-blue-600 fixed top-0 left-0 w-full h-full -z-10"></div>
      
      {/* Scrolling content */}
      <div className="relative h-[200vh] w-full">
        <Grid />
      </div>
    </div>
  );
};

export default HomePage;

// app/page.tsx
"use client";

import React from 'react';
import Grid from '@/components/Grid';
import WalletProviderComponent from '@/components/Wallet';

const HomePage: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-400 via-purple-600  to-blue-600 fixed top-0 left-0 w-full h-full -z-10">
      {/* Scrolling content */}
      <div className="relative w-full">
        <WalletProviderComponent >
        <Grid />
        </WalletProviderComponent>
      </div>
    </div>
  );
};

export default HomePage;

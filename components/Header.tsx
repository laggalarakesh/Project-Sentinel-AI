
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-md p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-cyan-400">Project Sentinel-AI</h1>
        <p className="text-sm text-gray-400">Predictive E-Scooter Fleet Health Dashboard</p>
      </div>
    </header>
  );
};

export default Header;

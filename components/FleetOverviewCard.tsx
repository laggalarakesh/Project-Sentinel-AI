import React from 'react';

interface FleetOverviewProps {
  stats: {
    healthy: number;
    atRisk: number;
    critical: number;
  };
  total: number;
}

// FIX: Replaced JSX.Element with React.ReactNode to resolve TypeScript namespace error.
// Updated to accept and display a tooltip.
const StatBox: React.FC<{ title: string; value: number; color: string; icon: React.ReactNode; tooltipText: string; }> = ({ title, value, color, icon, tooltipText }) => (
    <div className="relative group bg-gray-700 p-4 rounded-lg flex items-center space-x-4">
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
            {tooltipText}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-400 text-sm">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const FleetOverviewCard: React.FC<FleetOverviewProps> = ({ stats, total }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <StatBox 
        title="Total Fleet" 
        value={total} 
        color="bg-blue-500/20 text-blue-300" 
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>} 
        tooltipText="The total number of scooters currently being monitored by the Sentinel-AI system."
      />
      <StatBox 
        title="Healthy" 
        value={stats.healthy} 
        color="bg-green-500/20 text-green-300"
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        tooltipText="Scooters operating within all nominal parameters. No immediate action required."
      />
      <StatBox 
        title="At Risk" 
        value={stats.atRisk} 
        color="bg-yellow-500/20 text-yellow-300" 
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
        tooltipText="Scooters showing early signs of potential issues. Proactive maintenance is recommended."
      />
      <StatBox 
        title="Critical" 
        value={stats.critical} 
        color="bg-red-500/20 text-red-300" 
        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>}
        tooltipText="Scooters with a high probability of imminent failure. Immediate service is required."
      />
    </div>
  );
};

export default FleetOverviewCard;
import React from 'react';
import { Scooter, ScooterStatus, RiskFactor } from '../types';
import LiveTelemetryChart from './LiveTelemetryChart';

interface ScooterDetailViewProps {
  scooter: Scooter;
  onClose: () => void;
  onContactOwner: (scooter: Scooter) => void;
  onMarkFalsePositive: (scooter: Scooter) => void;
}

const statusInfoMap: Record<ScooterStatus, { base: string, text: string, dot: string }> = {
  [ScooterStatus.Healthy]: { base: 'border-green-500/30', text: 'text-green-300', dot: 'bg-green-400' },
  [ScooterStatus.AtRisk]: { base: 'border-yellow-500/30', text: 'text-yellow-300', dot: 'bg-yellow-400' },
  [ScooterStatus.Critical]: { base: 'border-red-500/30', text: 'text-red-300', dot: 'bg-red-400' },
};

const DetailItem: React.FC<{ label: string; value: string | number; unit?: string; }> = ({ label, value, unit }) => (
  <div>
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-lg font-semibold text-gray-100">
      {value}
      {unit && <span className="text-sm text-gray-400 ml-1">{unit}</span>}
    </p>
  </div>
);

const getImpactColor = (impact: number): string => {
  if (impact >= 0.7) return 'bg-red-500'; // More saturated red for high impact
  if (impact >= 0.4) return 'bg-yellow-400'; // Standard yellow for medium
  return 'bg-yellow-600'; // A less vibrant, darker yellow for lower impact
};

const RiskFactorItem: React.FC<{ factor: RiskFactor }> = ({ factor }) => (
    <div className="grid grid-cols-2 items-center gap-4">
        <span className="text-sm text-gray-300 truncate" title={factor.name}>{factor.name}</span>
        <div className="flex items-center">
            {/* Enhanced visual bar for better clarity and impact */}
            <div className="w-full bg-gray-900/70 rounded-full h-2.5">
                <div
                    className={`${getImpactColor(factor.impact)} h-2.5 rounded-full transition-all duration-500 ease-out`}
                    style={{ width: `${factor.impact * 100}%` }}
                    role="progressbar"
                    aria-valuenow={Math.round(factor.impact * 100)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${factor.name} impact score`}
                ></div>
            </div>
            <span className="text-sm font-mono text-gray-200 ml-3 w-10 text-right">
                {`${Math.round(factor.impact * 100)}%`}
            </span>
        </div>
    </div>
);


const ScooterDetailView: React.FC<ScooterDetailViewProps> = ({ scooter, onClose, onContactOwner, onMarkFalsePositive }) => {
  const statusInfo = statusInfoMap[scooter.status];
  
  const sortedRiskFactors = scooter.keyRiskFactors
    ?.sort((a, b) => b.impact - a.impact)
    .slice(0, 3) ?? [];

  return (
    <div className={`bg-gray-800 p-4 rounded-lg shadow-lg border ${statusInfo.base}`}>
      <div className="flex justify-between items-start mb-4">
        <div>
            <h2 className="text-xl font-bold text-cyan-400">{scooter.id}</h2>
            <div className="flex items-center space-x-2 mt-1">
                <span className={`h-2.5 w-2.5 rounded-full ${statusInfo.dot}`}></span>
                <span className={`text-sm font-semibold ${statusInfo.text}`}>{scooter.status}</span>
            </div>
        </div>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-white transition-colors text-2xl"
          aria-label="Close detail view"
        >
          &times;
        </button>
      </div>

      {scooter.status !== ScooterStatus.Healthy && (
        <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-700/50 rounded-lg">
          <p className="text-sm font-semibold text-gray-300 flex-grow">Actions:</p>
          <button
            onClick={() => onContactOwner(scooter)}
            className="px-3 py-1.5 text-sm font-medium bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors shadow-md"
            aria-label={`Contact owner of scooter ${scooter.id}`}
          >
            Contact Owner
          </button>
          <div className="relative group">
            <button
              onClick={() => onMarkFalsePositive(scooter)}
              className="px-3 py-1.5 text-sm font-medium bg-transparent border border-gray-500 text-gray-300 rounded-md hover:bg-gray-700 hover:border-gray-400 transition-colors"
              aria-label={`Mark scooter ${scooter.id} as a false positive`}
            >
              Mark as False Positive
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 text-center">
              Reclassifies the scooter to 'Healthy'. Use this to correct an inaccurate AI prediction. This event is logged for model retraining.
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Telemetry Chart */}
        <div className="bg-gray-700/50 p-3 rounded-lg">
          <h3 className="text-md font-semibold text-gray-300 mb-3 border-b border-gray-600 pb-2">30-Day Performance Telemetry</h3>
          <div className="grid grid-cols-3 gap-4 mb-4 text-center">
            <DetailItem label="Current RUL" value={scooter.remainingUsefulLife} unit="days" />
            <DetailItem label="Current Temp" value={scooter.batteryTemp} unit="°C" />
            <DetailItem label="Current Humidity" value={scooter.ambientHumidity} unit="%" />
          </div>
          <LiveTelemetryChart data={scooter.history} />
        </div>
        
        {/* Key Risk Factors */}
        {sortedRiskFactors.length > 0 && (
            <div className="bg-gray-700/50 p-3 rounded-lg">
                <h3 className="text-md font-semibold text-gray-300 mb-3 border-b border-gray-600 pb-2">Key Risk Factors</h3>
                <div className="space-y-3">
                    {sortedRiskFactors.map((factor) => (
                        <RiskFactorItem key={factor.name} factor={factor} />
                    ))}
                </div>
            </div>
        )}

        {/* Owner Information */}
        <div className="bg-gray-700/50 p-3 rounded-lg">
            <h3 className="text-md font-semibold text-gray-300 mb-3 border-b border-gray-600 pb-2">Owner Information</h3>
            <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Name" value={scooter.owner.name} />
                <DetailItem label="Contact Phone" value={scooter.owner.phone} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default ScooterDetailView;

import React from 'react';
import { UEBAMetrics, Anomaly } from '../types';

interface UEBAMonitoringCardProps {
  metrics: UEBAMetrics;
}

const statusIndicator: Record<UEBAMetrics['status'], { text: string, color: string }> = {
    'Monitoring Active': { text: 'Monitoring Active', color: 'bg-green-400' },
    'System Anomaly': { text: 'System Anomaly Detected', color: 'bg-yellow-400' },
    'Offline': { text: 'Agent Offline', color: 'bg-red-400' },
};

const anomalySeverityColors: Record<Anomaly['severity'], string> = {
    High: 'text-red-400',
    Medium: 'text-yellow-400',
    Low: 'text-gray-400',
};

const UEBAMonitoringCard: React.FC<UEBAMonitoringCardProps> = ({ metrics }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-100 mb-2">UEBA Security Monitor</h2>
      <div className="flex items-center space-x-2 mb-4">
        <span className={`h-2.5 w-2.5 rounded-full ${statusIndicator[metrics.status].color}`}></span>
        <span className="text-sm font-medium text-gray-300">{statusIndicator[metrics.status].text}</span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-700/50 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-400">System Integrity Score</p>
          <p className="text-3xl font-bold text-cyan-400">{metrics.securityScore}<span className="text-lg text-gray-400">/100</span></p>
        </div>
        <div className="bg-gray-700/50 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-400">Critical Alerts (24h)</p>
          <p className="text-3xl font-bold text-red-400">{metrics.alertsToday}</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-semibold text-gray-300 mb-2">Recent Anomalies</h3>
        <ul className="space-y-2 text-sm">
            {metrics.anomalies.map(anomaly => (
                <li key={anomaly.id} className="flex items-start p-2 bg-gray-700/30 rounded-md">
                    <span className={`font-mono text-xs w-16 flex-shrink-0 ${anomalySeverityColors[anomaly.severity]}`}>{anomaly.timestamp}</span>
                    <p className="text-gray-300">{anomaly.description}</p>
                </li>
            ))}
        </ul>
      </div>

    </div>
  );
};

export default UEBAMonitoringCard;
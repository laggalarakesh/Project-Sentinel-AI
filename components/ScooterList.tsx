import React, { useState, useMemo } from 'react';
import { Scooter, ScooterStatus } from '../types';

interface ScooterListProps {
  scooters: Scooter[];
  onContact: (scooter: Scooter) => void;
  onSelect: (scooter: Scooter) => void;
}

const statusColorMap: Record<ScooterStatus, string> = {
  [ScooterStatus.Healthy]: 'bg-green-500/20 text-green-300',
  [ScooterStatus.AtRisk]: 'bg-yellow-500/20 text-yellow-300',
  [ScooterStatus.Critical]: 'bg-red-500/20 text-red-300',
};

const ScooterList: React.FC<ScooterListProps> = ({ scooters, onContact, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredScooters = useMemo(() => {
    return scooters.filter(scooter => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch =
        searchTerm === '' ||
        scooter.id.toLowerCase().includes(searchTermLower) ||
        scooter.owner.name.toLowerCase().includes(searchTermLower) ||
        scooter.status.toLowerCase().includes(searchTermLower);

      const matchesStatus =
        statusFilter === 'All' || scooter.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [scooters, searchTerm, statusFilter]);

  return (
    <div>
      <div className="flex items-center space-x-4 mb-4">
        <input
            type="text"
            placeholder="Search by ID, Owner, or Status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Search scooters"
        />
        <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-gray-700 text-gray-200 border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            aria-label="Filter by status"
        >
            <option value="All">All Statuses</option>
            <option value={ScooterStatus.Healthy}>{ScooterStatus.Healthy}</option>
            <option value={ScooterStatus.AtRisk}>{ScooterStatus.AtRisk}</option>
            <option value={ScooterStatus.Critical}>{ScooterStatus.Critical}</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3">Scooter ID</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3 relative group">
                <span className="cursor-help">RUL (days)</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 text-center normal-case font-normal tracking-normal">
                  Remaining Useful Life: The estimated number of days before a component is likely to require maintenance.
                </div>
              </th>
              <th scope="col" className="px-4 py-3 relative group">
                <span className="cursor-help">Battery Temp (°C)</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 text-center normal-case font-normal tracking-normal">
                  The current internal temperature of the scooter's battery pack.
                </div>
              </th>
              <th scope="col" className="px-4 py-3 relative group">
                <span className="cursor-help">Humidity (%)</span>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs px-3 py-1.5 bg-gray-900 text-white text-xs rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 text-center normal-case font-normal tracking-normal">
                  The ambient humidity level recorded by the scooter's sensors, which can impact battery health.
                </div>
              </th>
              <th scope="col" className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredScooters.map((scooter) => (
              <tr 
                key={scooter.id} 
                className="border-b border-gray-700 hover:bg-gray-700/50 cursor-pointer"
                onClick={() => onSelect(scooter)}
              >
                <td className="px-4 py-3 font-medium text-white whitespace-nowrap">
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent row's onClick from firing
                      onSelect(scooter);
                    }}
                    className="text-cyan-400 hover:underline"
                  >
                    {scooter.id}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColorMap[scooter.status]}`}>
                    {scooter.status}
                  </span>
                </td>
                <td className="px-4 py-3">{scooter.remainingUsefulLife}</td>
                <td className="px-4 py-3">{scooter.batteryTemp}</td>
                <td className="px-4 py-3">{scooter.ambientHumidity}</td>
                <td className="px-4 py-3">
                  {scooter.status !== ScooterStatus.Healthy && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onContact(scooter);
                      }}
                      className="font-medium text-cyan-400 hover:text-cyan-500"
                    >
                      Contact Owner
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScooterList;
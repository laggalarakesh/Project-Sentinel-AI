
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import useMockData from '../hooks/useMockData';
import FleetOverviewCard from './FleetOverviewCard';
import ScooterList from './ScooterList';
import ServiceForecastChart from './ServiceForecastChart';
import AgentStatus from './AgentStatus';
import ContactOwnerModal from './ContactOwnerModal';
import RCAInsights from './RCAInsights';
import UEBAMonitoringCard from './UEBAMonitoringCard';
import ScooterDetailView from './ScooterDetailView';
import { Scooter, ScooterStatus } from '../types';
import { exportToCSV } from '../services/exportService';

const Dashboard: React.FC = () => {
  const { scooters, setScooters, agents, forecast, rcaInsights, uebaMetrics } = useMockData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScooter, setSelectedScooter] = useState<Scooter | null>(null);
  const [viewingScooter, setViewingScooter] = useState<Scooter | null>(null);

  const fleetStats = useMemo(() => {
    return scooters.reduce(
      (acc, scooter) => {
        if (scooter.status === ScooterStatus.Healthy) acc.healthy += 1;
        else if (scooter.status === ScooterStatus.AtRisk) acc.atRisk += 1;
        else if (scooter.status === ScooterStatus.Critical) acc.critical += 1;
        return acc;
      },
      { healthy: 0, atRisk: 0, critical: 0 }
    );
  }, [scooters]);

  // Effect to keep the detailed view in sync with real-time updates from the master list
  useEffect(() => {
    if (viewingScooter) {
      const updatedScooterInList = scooters.find(s => s.id === viewingScooter.id);
      if (updatedScooterInList && JSON.stringify(updatedScooterInList) !== JSON.stringify(viewingScooter)) {
        setViewingScooter(updatedScooterInList);
      }
    }
  }, [scooters, viewingScooter]);

  const handleContactOwner = useCallback((scooter: Scooter) => {
    setSelectedScooter(scooter);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedScooter(null);
  }, []);

  const handleSelectScooter = useCallback((scooter: Scooter) => {
    setViewingScooter(scooter);
  }, []);

  const handleCloseDetailView = useCallback(() => {
    setViewingScooter(null);
  }, []);
  
  const handleMarkFalsePositive = useCallback((scooterToUpdate: Scooter) => {
    setScooters(prevScooters => 
        prevScooters.map(s => 
            s.id === scooterToUpdate.id 
            ? { ...s, status: ScooterStatus.Healthy } 
            : s
        )
    );
    // Also update the scooter being viewed to reflect the change instantly
    setViewingScooter(prev => prev ? { ...prev, status: ScooterStatus.Healthy } : null);
  }, [setScooters]);


  const handleExportFleet = useCallback(() => {
    exportToCSV(scooters, 'sentinel_fleet_status.csv');
  }, [scooters]);

  const handleExportForecast = useCallback(() => {
    exportToCSV(forecast, 'sentinel_service_forecast.csv');
  }, [forecast]);


  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <FleetOverviewCard stats={fleetStats} total={scooters.length} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-gray-800 p-4 rounded-lg shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-100">Fleet Status</h2>
            <button
              onClick={handleExportFleet}
              className="px-3 py-1 text-sm font-medium bg-gray-700 text-cyan-300 rounded-md hover:bg-gray-600 transition-colors"
              aria-label="Export fleet status to CSV"
            >
              Export CSV
            </button>
          </div>
          <ScooterList 
            scooters={scooters} 
            onContact={handleContactOwner} 
            onSelect={handleSelectScooter}
          />
        </div>
        <div className="space-y-6">
          {viewingScooter ? (
            <ScooterDetailView 
              scooter={viewingScooter} 
              onClose={handleCloseDetailView}
              onContactOwner={handleContactOwner}
              onMarkFalsePositive={handleMarkFalsePositive}
            />
          ) : (
            <>
              <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-100">Service Demand Forecast</h2>
                  <button
                    onClick={handleExportForecast}
                    className="px-3 py-1 text-sm font-medium bg-gray-700 text-cyan-300 rounded-md hover:bg-gray-600 transition-colors"
                    aria-label="Export service demand forecast to CSV"
                  >
                    Export CSV
                  </button>
                </div>
                <ServiceForecastChart data={forecast} />
              </div>
              <RCAInsights insights={rcaInsights} />
              {uebaMetrics && <UEBAMonitoringCard metrics={uebaMetrics} />}
            </>
          )}
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Agent Status</h2>
            <AgentStatus agents={agents} />
          </div>
        </div>
      </div>

      {selectedScooter && (
        <ContactOwnerModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          scooter={selectedScooter}
        />
      )}
    </div>
  );
};

export default Dashboard;

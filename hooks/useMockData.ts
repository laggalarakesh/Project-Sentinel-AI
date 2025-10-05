import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Scooter, ScooterStatus, Agent, ServiceForecastData, RCAInsight, UEBAMetrics, TelemetryPoint, RiskFactor } from '../types';

const scooterNames = ["Alpha", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliett", "Kilo", "Lima"];
const ownerNames = ["Priya", "Rohan", "Anjali", "Vikram", "Sunita", "Amit", "Meera", "Sanjay", "Deepa", "Rajesh"];

const possibleRiskFactors = [
    'Impedance Drift',
    'Cumulative Humid Exposure',
    'Temp/Humidity Correlation',
    'Cell Voltage Imbalance',
    'Charging Cycle Anomaly'
];

const generateRandomScooter = (index: number): Scooter => {
  const randomStatus = Math.random();
  let status: ScooterStatus;
  let initialRul: number;
  let keyRiskFactors: RiskFactor[] | undefined = undefined;

  if (randomStatus > 0.7) {
    status = ScooterStatus.Healthy;
    initialRul = Math.floor(Math.random() * 100) + 200; // Start high for past data
  } else if (randomStatus > 0.2) {
    status = ScooterStatus.AtRisk;
    initialRul = Math.floor(Math.random() * 60) + 45; // Start in a risky range
    
    keyRiskFactors = [];
    const factorCount = Math.floor(Math.random() * 2) + 1; // 1 to 2 factors
    const shuffledFactors = [...possibleRiskFactors].sort(() => 0.5 - Math.random());
    for (let i = 0; i < factorCount; i++) {
        keyRiskFactors.push({
            name: shuffledFactors[i],
            impact: parseFloat((Math.random() * 0.4 + 0.3).toFixed(2)) // 0.3 to 0.7
        });
    }
  } else {
    status = ScooterStatus.Critical;
    initialRul = Math.floor(Math.random() * 20) + 15; // Start in a critical range

    keyRiskFactors = [];
    const factorCount = Math.floor(Math.random() * 2) + 2; // 2 to 3 factors
    const shuffledFactors = [...possibleRiskFactors].sort(() => 0.5 - Math.random());
    for (let i = 0; i < factorCount; i++) {
        keyRiskFactors.push({
            name: shuffledFactors[i],
            impact: parseFloat((Math.random() * 0.4 + 0.6).toFixed(2)) // 0.6 to 1.0
        });
    }
  }

  const history: TelemetryPoint[] = [];
  let currentRul = initialRul;
  let currentTemp = parseFloat((Math.random() * 15 + 28).toFixed(1));
  let currentHumidity = parseFloat((Math.random() * 30 + 60).toFixed(1));

  // Generate 30 days of historical data leading up to the present
  for (let i = 0; i < 30; i++) {
    history.push({
      day: i - 29, // Day -29 up to Day 0 (today)
      remainingUsefulLife: Math.round(currentRul),
      batteryTemp: parseFloat(currentTemp.toFixed(1)),
      ambientHumidity: parseFloat(currentHumidity.toFixed(1)),
    });

    // Trend the data based on status
    if (status === ScooterStatus.Critical) {
      currentRul -= Math.random() * 1.5 + 0.5; // Faster degradation
      currentTemp += (Math.random() - 0.45) * 0.5;
    } else if (status === ScooterStatus.AtRisk) {
      currentRul -= Math.random() * 0.8 + 0.2; // Moderate degradation
      currentTemp += (Math.random() - 0.5) * 0.3;
    } else {
      currentRul -= Math.random() * 0.1; // Very slow degradation
      currentTemp += (Math.random() - 0.5) * 0.2;
    }
    currentHumidity += (Math.random() - 0.5) * 2;

    // Clamp values to realistic ranges
    currentRul = Math.max(0, currentRul);
    currentTemp = Math.min(45, Math.max(25, currentTemp));
    currentHumidity = Math.min(95, Math.max(55, currentHumidity));
  }

  const latestPoint = history[29];

  return {
    id: `SN-${scooterNames[index % scooterNames.length]}${1000 + index}`,
    status,
    remainingUsefulLife: latestPoint.remainingUsefulLife,
    batteryTemp: latestPoint.batteryTemp,
    ambientHumidity: latestPoint.ambientHumidity,
    impedanceDrift: parseFloat((Math.random() * 5 + (status === ScooterStatus.Healthy ? 1 : 4)).toFixed(2)),
    owner: {
      name: ownerNames[index % ownerNames.length],
      phone: `+91 98765 ${10000 + index}`
    },
    history,
    keyRiskFactors,
  };
};

interface MockData {
    scooters: Scooter[];
    setScooters: Dispatch<SetStateAction<Scooter[]>>;
    agents: Agent[];
    forecast: ServiceForecastData[];
    rcaInsights: RCAInsight[];
    uebaMetrics: UEBAMetrics | null;
}

const useMockData = (): MockData => {
  const [scooters, setScooters] = useState<Scooter[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [forecast, setForecast] = useState<ServiceForecastData[]>([]);
  const [rcaInsights, setRcaInsights] = useState<RCAInsight[]>([]);
  const [uebaMetrics, setUebaMetrics] = useState<UEBAMetrics | null>(null);

  useEffect(() => {
    const mockScooters = Array.from({ length: 20 }, (_, i) => generateRandomScooter(i));
    setScooters(mockScooters);

    const mockAgents: Agent[] = [
        { name: 'Master Agent (Orchestrator)', status: 'Operational' },
        { name: 'Data Ingestion & Validation', status: 'Operational' },
        { name: 'Predictive Analytics (RUL)', status: 'Operational' },
        { name: 'Customer Engagement (Gemini)', status: 'Operational' },
        { name: 'Scheduling & Logistics', status: 'Operational' },
        { name: 'RCA/CAPA Agent', status: 'Operational' },
        { name: 'UEBA Monitoring Agent', status: 'Operational' },
    ];
    setAgents(mockAgents);
    
    const mockForecast: ServiceForecastData[] = [
        { week: 'Week 1', appointments: Math.floor(Math.random() * 10) + 15 },
        { week: 'Week 2', appointments: Math.floor(Math.random() * 10) + 20 },
        { week: 'Week 3', appointments: Math.floor(Math.random() * 15) + 25 },
        { week: 'Week 4', appointments: Math.floor(Math.random() * 15) + 30 },
    ];
    setForecast(mockForecast);

    const mockInsights: RCAInsight[] = [
      {
        id: 'RCA-001',
        title: 'Premature Battery Degradation in Lot B-7',
        finding: 'A statistically significant number of scooters from manufacturing lot B-7 are showing a 15% higher rate of impedance drift when operated in high-humidity environments (>85%).',
        recommendation: 'Review and enhance the battery casing sealant for all units in Lot B-7. Issue a targeted, non-urgent service bulletin.',
        severity: 'High',
      },
      {
        id: 'RCA-002',
        title: 'Throttle Sensor Jitter',
        finding: 'Intermittent throttle response issues reported by users correlate with a specific firmware version (v2.1.4). The issue appears to be a software debouncing error.',
        recommendation: 'Develop and deploy an over-the-air (OTA) firmware patch (v2.1.5) to all affected scooters immediately.',
        severity: 'Medium',
      },
      {
        id: 'RCA-003',
        title: 'Brake Light Casing Cracks',
        finding: 'Minor hairline cracks are developing on the rear brake light casing after approximately 500-600 hours of operation, potentially allowing moisture ingress.',
        recommendation: 'Source a more UV-resistant polymer for the casing in future production runs. Monitor existing fleet for moisture-related failures.',
        severity: 'Low',
      },
    ];
    setRcaInsights(mockInsights);

    const mockUEBAMetrics: UEBAMetrics = {
      status: 'Monitoring Active',
      securityScore: 98,
      alertsToday: 0,
      anomalies: [
        { id: 'ANM-001', timestamp: '08:15 AM', description: 'Unusual API access pattern from RCA agent.', severity: 'Low' },
        { id: 'ANM-002', timestamp: '02:30 AM', description: 'Repeated failed login attempt on dev portal.', severity: 'Medium' },
      ]
    };
    setUebaMetrics(mockUEBAMetrics);
    
    // Set up interval for real-time data simulation
    const intervalId = setInterval(() => {
      setScooters(prevScooters =>
        prevScooters.map(scooter => {
          let nextStatus = scooter.status;
          let nextRemainingUsefulLife = scooter.remainingUsefulLife;
          let nextKeyRiskFactors = scooter.keyRiskFactors;

          // 1. Simulate status transitions for at-risk and critical scooters
          if (scooter.status === ScooterStatus.AtRisk) {
            // ~2.5% chance per update to degrade to Critical
            if (Math.random() < 0.025) {
              nextStatus = ScooterStatus.Critical;
              // When degrading, sharply drop RUL and add/update risk factors
              nextRemainingUsefulLife = Math.floor(Math.random() * 20) + 10; // 10-29 days
              const newRiskFactor: RiskFactor = { name: 'Sudden Cell Failure', impact: parseFloat((Math.random() * 0.2 + 0.8).toFixed(2)) };
              nextKeyRiskFactors = [...(scooter.keyRiskFactors || []), newRiskFactor]
                                      .sort((a,b) => b.impact - a.impact) // a simple way to de-dupe and keep highest
                                      .filter((v, i, a) => a.findIndex(t => (t.name === v.name)) === i)
                                      .slice(0,3);
            }
          } else if (scooter.status === ScooterStatus.Critical) {
            // ~1% chance per update to be "serviced" and become Healthy
            if (Math.random() < 0.01) {
              nextStatus = ScooterStatus.Healthy;
              nextRemainingUsefulLife = 300 + Math.floor(Math.random() * 65); // Reset RUL
              nextKeyRiskFactors = undefined; // Clear risk factors after service
            }
          }
          
          // 2. Simulate normal telemetry drift for the current tick
          const lastHistoryPoint = scooter.history[scooter.history.length - 1];
          
          // Apply normal degradation unless a status change has overridden the RUL
          let updatedRul = (scooter.status !== ScooterStatus.Healthy && Math.random() < 0.2)
            ? Math.max(0, lastHistoryPoint.remainingUsefulLife - 1)
            : lastHistoryPoint.remainingUsefulLife;

          if (scooter.status !== nextStatus) {
            updatedRul = nextRemainingUsefulLife;
          }

          const newTemp = parseFloat(Math.min(45, Math.max(25, lastHistoryPoint.batteryTemp + (Math.random() - 0.5) * 0.4)).toFixed(1));
          const newHumidity = parseFloat(Math.min(95, Math.max(55, lastHistoryPoint.ambientHumidity + (Math.random() - 0.5) * 1)).toFixed(1));

          const newHistoryPoint: TelemetryPoint = {
              day: 0,
              remainingUsefulLife: updatedRul,
              batteryTemp: newTemp,
              ambientHumidity: newHumidity,
          };
          
          const newHistory = [...scooter.history.slice(1), newHistoryPoint]
            .map((p, i) => ({ ...p, day: i - 29 }));

          return {
            ...scooter,
            status: nextStatus,
            keyRiskFactors: nextKeyRiskFactors,
            batteryTemp: newHistoryPoint.batteryTemp,
            ambientHumidity: newHistoryPoint.ambientHumidity,
            remainingUsefulLife: newHistoryPoint.remainingUsefulLife,
            history: newHistory,
          };
        })
      );
    }, 2000); // Update every 2 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  return { scooters, setScooters, agents, forecast, rcaInsights, uebaMetrics };
};

export default useMockData;
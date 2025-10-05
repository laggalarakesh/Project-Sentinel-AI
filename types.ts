
export enum ScooterStatus {
  Healthy = 'Healthy',
  AtRisk = 'At Risk',
  Critical = 'Critical',
}

export interface TelemetryPoint {
  day: number;
  remainingUsefulLife: number;
  batteryTemp: number;
  ambientHumidity: number;
}

export interface RiskFactor {
  name: string;
  impact: number; // A score from 0.0 to 1.0
}

export interface Scooter {
  id: string;
  status: ScooterStatus;
  remainingUsefulLife: number; // in days
  batteryTemp: number; // in Celsius
  ambientHumidity: number; // in %
  impedanceDrift: number; // in %
  owner: {
    name: string;
    phone: string;
  };
  history: TelemetryPoint[];
  keyRiskFactors?: RiskFactor[];
}

export interface Agent {
  name: string;
  status: 'Operational' | 'Degraded' | 'Offline';
}

export interface ServiceForecastData {
  week: string;
  appointments: number;
}

export interface RCAInsight {
  id:string;
  title: string;
  finding: string;
  recommendation: string;
  severity: 'High' | 'Medium' | 'Low';
}

export interface Anomaly {
  id: string;
  timestamp: string;
  description: string;
  severity: 'High' | 'Medium' | 'Low';
}

export interface UEBAMetrics {
  status: 'Monitoring Active' | 'System Anomaly' | 'Offline';
  securityScore: number;
  alertsToday: number;
  anomalies: Anomaly[];
}

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ServiceForecastData } from '../types';

interface ServiceForecastChartProps {
    data: ServiceForecastData[];
}

const ServiceForecastChart: React.FC<ServiceForecastChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <BarChart
          data={data}
          margin={{
            top: 5, right: 20, left: -10, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
          <XAxis dataKey="week" tick={{ fill: '#9ca3af' }} fontSize={12} />
          <YAxis tick={{ fill: '#9ca3af' }} fontSize={12}/>
          <Tooltip 
            contentStyle={{ backgroundColor: '#2d2d2d', border: '1px solid #444444' }}
            labelStyle={{ color: '#e5e7eb' }}
          />
          <Legend wrapperStyle={{fontSize: "12px"}}/>
          <Bar dataKey="appointments" fill="#22d3ee" name="Predicted Appointments"/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ServiceForecastChart;

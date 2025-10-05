
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TelemetryPoint } from '../types';

interface LiveTelemetryChartProps {
    data: TelemetryPoint[];
}

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-2 bg-gray-700 border border-gray-600 rounded-md shadow-lg">
                <p className="label text-gray-200">{`Day: ${label}`}</p>
                {payload.map((pld: any) => (
                    <p key={pld.dataKey} style={{ color: pld.color }} className="text-sm">
                        {`${pld.name}: ${pld.value.toFixed(1)} ${pld.dataKey === 'remainingUsefulLife' ? 'days' : pld.dataKey === 'batteryTemp' ? '°C' : '%'}`}
                    </p>
                ))}
            </div>
        );
    }

    return null;
};

const LiveTelemetryChart: React.FC<LiveTelemetryChartProps> = ({ data }) => {
  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 5, right: 20, left: -10, bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444444" />
          <XAxis 
            dataKey="day" 
            tick={{ fill: '#9ca3af' }} 
            fontSize={12} 
            label={{ value: 'Days (0 = Today)', position: 'insideBottom', offset: -10, fill: '#9ca3af', fontSize: 12 }}
            tickFormatter={(tick) => tick % 5 === 0 ? tick : ''}
            tickLine={false}
          />
          <YAxis 
            yAxisId="left" 
            tick={{ fill: '#22d3ee' }} 
            fontSize={12} 
            label={{ value: 'RUL (days)', angle: -90, position: 'insideLeft', fill: '#22d3ee', fontSize: 12, dy: 40 }}
            domain={['dataMin - 5', 'dataMax + 5']}
          />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            tick={{ fill: '#facc15' }} 
            fontSize={12}
            label={{ value: 'Temp (°C) / Humidity (%)', angle: 90, position: 'insideRight', fill: '#facc15', fontSize: 12, dy: -60 }}
            domain={[20, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{fontSize: "12px", paddingTop: "20px"}}/>
          <Line yAxisId="left" type="monotone" dataKey="remainingUsefulLife" name="RUL" stroke="#22d3ee" strokeWidth={2} dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="batteryTemp" name="Temp" stroke="#facc15" strokeWidth={2} dot={false} />
          <Line yAxisId="right" type="monotone" dataKey="ambientHumidity" name="Humidity" stroke="#60a5fa" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveTelemetryChart;

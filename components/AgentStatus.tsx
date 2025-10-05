
import React from 'react';
import { Agent } from '../types';

interface AgentStatusProps {
  agents: Agent[];
}

const AgentStatus: React.FC<AgentStatusProps> = ({ agents }) => {
  return (
    <div className="space-y-3">
      {agents.map((agent) => (
        <div key={agent.name} className="flex items-center justify-between text-sm">
          <p className="text-gray-300">{agent.name}</p>
          <div className="flex items-center space-x-2">
            <span className={`h-2 w-2 rounded-full ${agent.status === 'Operational' ? 'bg-green-400' : 'bg-red-400'}`}></span>
            <span className={agent.status === 'Operational' ? 'text-green-400' : 'text-red-400'}>{agent.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AgentStatus;

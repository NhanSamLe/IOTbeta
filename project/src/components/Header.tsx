import React from 'react';
import { Shield, AlertTriangle, Settings } from 'lucide-react';

interface HeaderProps {
  systemStatus: 'active' | 'warning' | 'danger';
  alertCount: number;
}

export const Header: React.FC<HeaderProps> = ({ systemStatus, alertCount }) => {
  const getStatusColor = () => {
    switch (systemStatus) {
      case 'active': return 'text-emerald-400';
      case 'warning': return 'text-amber-400';
      case 'danger': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusBg = () => {
    switch (systemStatus) {
      case 'active': return 'bg-emerald-500/20 border-emerald-500/30';
      case 'warning': return 'bg-amber-500/20 border-amber-500/30';
      case 'danger': return 'bg-red-500/20 border-red-500/30';
      default: return 'bg-gray-500/20 border-gray-500/30';
    }
  };

  return (
    <header className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Obstacle Avoidance System</h1>
              <p className="text-sm text-gray-400">Real-time collision prevention</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusBg()}`}>
            <div className={`w-2 h-2 rounded-full ${getStatusColor().replace('text-', 'bg-')} animate-pulse`} />
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {systemStatus.toUpperCase()}
            </span>
          </div>
          
          {alertCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-500/20 border border-red-500/30 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-sm font-medium text-red-400">{alertCount} Alerts</span>
            </div>
          )}
          
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
import React from 'react';
import { AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface Alert {
  id: string;
  type: 'danger' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  distance?: number;
}

interface AlertPanelProps {
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, onDismiss }) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'danger': return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-amber-400" />;
      case 'info': return <Info className="h-5 w-5 text-blue-400" />;
      default: return <Info className="h-5 w-5 text-gray-400" />;
    }
  };

  const getAlertBg = (type: string) => {
    switch (type) {
      case 'danger': return 'bg-red-500/10 border-red-500/30';
      case 'warning': return 'bg-amber-500/10 border-amber-500/30';
      case 'info': return 'bg-blue-500/10 border-blue-500/30';
      default: return 'bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Active Alerts</h3>
        <div className="text-sm text-gray-400">{alerts.length} active</div>
      </div>
      
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No active alerts</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`flex items-start gap-3 p-4 rounded-lg border ${getAlertBg(alert.type)} animate-in slide-in-from-top-2 duration-300`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium">{alert.message}</p>
                <div className="flex items-center gap-4 mt-1">
                  <p className="text-xs text-gray-400">
                    {alert.timestamp.toLocaleTimeString()}
                  </p>
                  {alert.distance && (
                    <p className="text-xs text-gray-400">
                      Distance: {alert.distance}m
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => onDismiss(alert.id)}
                className="flex-shrink-0 text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
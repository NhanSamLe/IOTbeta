import React from 'react';
import { TrendingUp, Target, Clock, AlertTriangle } from 'lucide-react';

interface StatisticsPanelProps {
  stats: {
    obstaclesDetected: number;
    averageDistance: number;
    responseTime: number;
    uptime: string;
  };
}

export const StatisticsPanel: React.FC<StatisticsPanelProps> = ({ stats }) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">System Statistics</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-blue-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">Detected</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.obstaclesDetected}</p>
          <p className="text-xs text-gray-500">obstacles today</p>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">Distance</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.averageDistance}m</p>
          <p className="text-xs text-gray-500">average</p>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-green-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">Response</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.responseTime}ms</p>
          <p className="text-xs text-gray-500">average</p>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-purple-400" />
            <span className="text-xs text-gray-400 uppercase tracking-wide">Uptime</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.uptime}</p>
          <p className="text-xs text-gray-500">system active</p>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">System Health</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 font-medium">Optimal</span>
          </div>
        </div>
      </div>
    </div>
  );
};
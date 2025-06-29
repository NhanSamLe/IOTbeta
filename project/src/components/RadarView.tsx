import React, { useEffect, useState } from 'react';
import { Navigation } from 'lucide-react';

interface Obstacle {
  id: string;
  x: number;
  y: number;
  distance: number;
  severity: 'low' | 'medium' | 'high';
  type: string;
}

interface RadarViewProps {
  obstacles: Obstacle[];
}

export const RadarView: React.FC<RadarViewProps> = ({ obstacles }) => {
  const [sweepAngle, setSweepAngle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSweepAngle(prev => (prev + 2) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-amber-500';
      case 'low': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Radar View</h3>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Navigation className="h-4 w-4" />
          <span>360° Scan</span>
        </div>
      </div>
      
      <div className="relative w-full aspect-square max-w-md mx-auto">
        {/* Radar background circles */}
        <div className="absolute inset-0 rounded-full border-2 border-gray-700/50"></div>
        <div className="absolute inset-4 rounded-full border border-gray-700/30"></div>
        <div className="absolute inset-8 rounded-full border border-gray-700/30"></div>
        <div className="absolute inset-12 rounded-full border border-gray-700/30"></div>
        
        {/* Center crosshairs */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-gray-700/50"></div>
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-700/50"></div>
        
        {/* Radar sweep */}
        <div 
          className="absolute top-1/2 left-1/2 w-1/2 h-px bg-gradient-to-r from-blue-400 to-transparent origin-left transform -translate-y-px transition-transform duration-75 ease-linear"
          style={{ transform: `translate(-1px, -0.5px) rotate(${sweepAngle}deg)` }}
        ></div>
        
        {/* Vehicle center */}
        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-blue-400 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-75"></div>
        </div>
        
        {/* Obstacles */}
        {obstacles.map((obstacle) => (
          <div
            key={obstacle.id}
            className={`absolute w-2 h-2 rounded-full ${getSeverityColor(obstacle.severity)} transform -translate-x-1/2 -translate-y-1/2 animate-pulse`}
            style={{
              left: `${50 + obstacle.x}%`,
              top: `${50 + obstacle.y}%`,
            }}
          >
            <div className={`absolute inset-0 ${getSeverityColor(obstacle.severity)} rounded-full animate-ping opacity-75`}></div>
          </div>
        ))}
        
        {/* Distance markers */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">50m</div>
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">25m</div>
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-xs text-gray-500">10m</div>
      </div>
      
      <div className="mt-4 flex justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span className="text-gray-400">High Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
          <span className="text-gray-400">Medium Risk</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span className="text-gray-400">Low Risk</span>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
import { Settings, Volume2, VolumeX, Zap } from 'lucide-react';

interface ControlPanelProps {
  sensitivity: number;
  setSensitivity: (value: number) => void;
  audioEnabled: boolean;
  setAudioEnabled: (enabled: boolean) => void;
  emergencyMode: boolean;
  setEmergencyMode: (enabled: boolean) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  sensitivity,
  setSensitivity,
  audioEnabled,
  setAudioEnabled,
  emergencyMode,
  setEmergencyMode,
}) => {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="h-5 w-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Control Panel</h3>
      </div>
      
      <div className="space-y-6">
        {/* Sensitivity Control */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-300">Sensitivity</label>
            <span className="text-sm text-blue-400 font-mono">{sensitivity}%</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="10"
              max="100"
              value={sensitivity}
              onChange={(e) => setSensitivity(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div 
              className="absolute top-0 left-0 h-2 bg-gradient-to-r from-blue-500 to-blue-400 rounded-lg pointer-events-none"
              style={{ width: `${sensitivity}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Low</span>
            <span>High</span>
          </div>
        </div>
        
        {/* Audio Control */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {audioEnabled ? (
              <Volume2 className="h-5 w-5 text-blue-400" />
            ) : (
              <VolumeX className="h-5 w-5 text-gray-400" />
            )}
            <span className="text-sm font-medium text-gray-300">Audio Alerts</span>
          </div>
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
              audioEnabled ? 'bg-blue-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                audioEnabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        {/* Emergency Mode */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className={`h-5 w-5 ${emergencyMode ? 'text-red-400' : 'text-gray-400'}`} />
            <span className="text-sm font-medium text-gray-300">Emergency Override</span>
          </div>
          <button
            onClick={() => setEmergencyMode(!emergencyMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
              emergencyMode ? 'bg-red-600' : 'bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                emergencyMode ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
        
        {emergencyMode && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 animate-in slide-in-from-top-2">
            <p className="text-red-400 text-sm font-medium">Emergency Override Active</p>
            <p className="text-red-400/80 text-xs mt-1">Manual control enabled - automated responses disabled</p>
          </div>
        )}
      </div>
    </div>
  );
};
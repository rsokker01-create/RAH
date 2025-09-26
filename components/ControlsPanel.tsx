
import React from 'react';
import type { Environment } from '../types';
import { ThermometerIcon } from './icons/ThermometerIcon';
import { WindIcon } from './icons/WindIcon';
import { WaterDropIcon } from './icons/WaterDropIcon';

interface ControlsPanelProps {
  environment: Environment;
  onEnvironmentChange: (key: keyof Environment, value: number) => void;
  onReset: () => void;
}

const COLOR_MAP: Record<string, string> = {
  'bg-blue-500': '#3b82f6',
  'bg-red-500': '#ef4444',
  'bg-orange-400': '#fb923c',
  'bg-yellow-600': '#ca8a04',
  'bg-sky-500': '#0ea5e9',
  'bg-slate-500': '#64748b',
  'bg-gray-400': '#9ca3af',
};

const Slider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  unit: string;
  icon: React.ReactNode;
  trackColor: string;
}> = ({ label, value, min, max, step, onChange, unit, icon, trackColor }) => (
  <div className="space-y-2">
    <label className="flex items-center justify-between text-lg font-semibold text-gray-700 dark:text-gray-300">
      <span className="flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span className="font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-800/50 px-3 py-1 rounded-full text-sm">
        {value} {unit}
      </span>
    </label>
    <div className="relative">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${trackColor} bg-opacity-30`}
        style={{
          '--thumb-color': COLOR_MAP[trackColor] || '#9ca3af',
        } as React.CSSProperties}
      />
      <div className="w-full flex justify-between px-px mt-1">
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className={`h-2 w-px ${i % 5 === 0 ? 'bg-gray-500 dark:bg-gray-400' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
        ))}
      </div>
    </div>
  </div>
);


const ControlsPanel: React.FC<ControlsPanelProps> = ({ environment, onEnvironmentChange, onReset }) => {
  const getTempColor = (temp: number) => {
    if (temp <= 0) return 'bg-blue-500';
    if (temp > 40) return 'bg-red-500';
    return 'bg-orange-400';
  };

  const getWaterColor = (water: number) => {
    if (water < 20) return 'bg-yellow-600';
    return 'bg-sky-500';
  };
  
  const getWindColor = (wind: number) => {
    if (wind > 60) return 'bg-slate-500';
    return 'bg-gray-400';
  };

  return (
    <div className="flex flex-col h-full space-y-8">
      <h2 className="text-2xl font-bold text-center text-green-800 dark:text-green-300">لوحة التحكم</h2>
      <div className="flex-grow space-y-8">
        <Slider
          label="درجة الحرارة"
          icon={<ThermometerIcon className="w-6 h-6" />}
          value={environment.temperature}
          min={-10}
          max={50}
          step={1}
          onChange={(e) => onEnvironmentChange('temperature', Number(e.target.value))}
          unit="°م"
          trackColor={getTempColor(environment.temperature)}
        />
        <Slider
          label="مستوى الماء"
          icon={<WaterDropIcon className="w-6 h-6" />}
          value={environment.water}
          min={0}
          max={100}
          step={5}
          onChange={(e) => onEnvironmentChange('water', Number(e.target.value))}
          unit="%"
          trackColor={getWaterColor(environment.water)}
        />
        <Slider
          label="قوة الرياح"
          icon={<WindIcon className="w-6 h-6" />}
          value={environment.wind}
          min={0}
          max={100}
          step={5}
          onChange={(e) => onEnvironmentChange('wind', Number(e.target.value))}
          unit="كم/س"
          trackColor={getWindColor(environment.wind)}
        />
      </div>
      <button 
        onClick={onReset}
        className="w-full mt-4 py-3 px-4 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        إعادة تعيين
      </button>
    </div>
  );
};

export default ControlsPanel;
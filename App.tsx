
import React, { useState, useEffect, useCallback } from 'react';
import ControlsPanel from './components/ControlsPanel';
import PlantDisplay from './components/PlantDisplay';
import type { Environment, PlantState } from './types';
import { PlantStatus } from './types';

const INITIAL_ENVIRONMENT: Environment = {
  temperature: 22,
  wind: 10,
  water: 80,
};

const App: React.FC = () => {
  const [environment, setEnvironment] = useState<Environment>(INITIAL_ENVIRONMENT);
  const [plantState, setPlantState] = useState<PlantState>({ status: PlantStatus.Healthy, growth: 1 });

  const calculatePlantState = useCallback((env: Environment): PlantState => {
    const { temperature, water, wind } = env;

    if (temperature <= 0) return { status: PlantStatus.Frozen, growth: 0.9 };
    if (water < 10) return { status: PlantStatus.Wilted, growth: 0.8 };
    if (temperature > 45) return { status: PlantStatus.Dried, growth: 0.85 };
    if (wind > 80) return { status: PlantStatus.Broken, growth: 1 };
    
    const isIdealTemp = temperature > 18 && temperature < 28;
    const isIdealWater = water > 70;
    const isIdealWind = wind < 30;

    if (isIdealTemp && isIdealWater && isIdealWind) {
      return { status: PlantStatus.Fruiting, growth: 1.2 };
    }
    
    if (wind > 60) return { status: PlantStatus.Windy, growth: 1 };

    return { status: PlantStatus.Healthy, growth: 1 };
  }, []);


  useEffect(() => {
    const newState = calculatePlantState(environment);
    setPlantState(newState);
  }, [environment, calculatePlantState]);

  const handleEnvironmentChange = (key: keyof Environment, value: number) => {
    setEnvironment(prev => ({ ...prev, [key]: value }));
  };
  
  const resetSimulation = () => {
    setEnvironment(INITIAL_ENVIRONMENT);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-200 to-green-200 dark:from-sky-900 dark:to-green-900 text-gray-800 dark:text-gray-100 p-4 sm:p-8 transition-colors duration-500">
      <div className="container mx-auto max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-green-800 dark:text-green-300">محاكي تأثير البيئة على النبات</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2">تحكم في العوامل البيئية وشاهد كيف يتفاعل النبات</p>
        </header>
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 bg-white/50 dark:bg-black/30 backdrop-blur-md rounded-2xl shadow-lg p-6">
             <ControlsPanel 
              environment={environment} 
              onEnvironmentChange={handleEnvironmentChange}
              onReset={resetSimulation}
            />
          </div>
          <div className="lg:col-span-2 bg-white/50 dark:bg-black/30 backdrop-blur-md rounded-2xl shadow-lg p-6 flex items-center justify-center min-h-[400px] lg:min-h-0">
            <PlantDisplay state={plantState} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;

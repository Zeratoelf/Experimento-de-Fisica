import React, { useState, useMemo } from 'react';
import ExperimentControls from './components/ExperimentControls';
import Visualizer from './components/Visualizer';
import Explanation from './components/Explanation';
import { MATERIALS } from './constants';

export interface ExperimentData {
  materialKey: string;
  initialLength: number;
  initialTemp: number;
  finalTemp: number;
  deltaL: number;
}

const App: React.FC = () => {
  const [materialKey, setMaterialKey] = useState<string>('steel');
  const [initialLength, setInitialLength] = useState<number>(50); // L₀ in meters
  const [initialTemp, setInitialTemp] = useState<number>(20); // T₀ in Celsius
  const [finalTemp, setFinalTemp] = useState<number>(120); // T_f in Celsius
  const [tempUnit, setTempUnit] = useState<'C' | 'K'>('C');

  const { deltaL, finalLength, experimentData } = useMemo(() => {
    const material = MATERIALS[materialKey];
    const deltaT = finalTemp - initialTemp;
    const calculatedDeltaL = material.coefficient * initialLength * deltaT;
    const calculatedFinalLength = initialLength + calculatedDeltaL;
    
    const data: ExperimentData = {
      materialKey,
      initialLength,
      initialTemp,
      finalTemp,
      deltaL: calculatedDeltaL,
    };

    return { 
      deltaL: calculatedDeltaL, 
      finalLength: calculatedFinalLength,
      experimentData: data
    };
  }, [materialKey, initialLength, initialTemp, finalTemp]);

  return (
    <div className="min-h-screen bg-gray-900 bg-gradient-to-br from-gray-900 to-brand-primary p-4 sm:p-6 lg:p-8">
      <main className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-light to-brand-accent">
            Experimento de Dilatación Lineal
          </h1>
          <p className="mt-2 text-lg text-cyan-300">
            Laboratorio virtual para explorar cómo los materiales cambian de tamaño con la temperatura. 
          </p>
          <p>
          <em>Para la clase del profesor Quijada</em> <strong>BFI01K</strong>
          </p>
        </header>

        <ExperimentControls
          materialKey={materialKey}
          setMaterialKey={setMaterialKey}
          initialLength={initialLength}
          setInitialLength={setInitialLength}
          initialTemp={initialTemp}
          setInitialTemp={setInitialTemp}
          finalTemp={finalTemp}
          setFinalTemp={setFinalTemp}
          deltaL={deltaL}
          finalLength={finalLength}
          tempUnit={tempUnit}
          setTempUnit={setTempUnit}
        />

        <Visualizer
          initialLength={initialLength}
          deltaL={deltaL}
          initialTemp={initialTemp}
          finalTemp={finalTemp}
        />
        
        <Explanation experimentData={experimentData} />

        <footer className="text-center mt-12 text-sm text-gray-500">
          <p>Desarrollado con amor para el curso de Fisica I del profesor Quijada y la API de Gemini.</p>
          <p>Una simulación con fines muy educativos.</p>
          <p>No me jale profe :(</p>
        </footer>
      </main>
    </div>
  );
};

export default App;

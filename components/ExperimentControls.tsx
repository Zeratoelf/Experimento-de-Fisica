import React, { useState, useEffect } from 'react';
import { MATERIALS } from '../constants';
import type { Material } from '../types';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  precision?: number;
  onChange: (value: number) => void;
}

const SliderControl: React.FC<SliderProps> = ({ label, value, min, max, step, unit, precision = 1, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value.toString());

  useEffect(() => {
    if (!isEditing) {
      setInputValue(value.toFixed(precision));
    }
  }, [value, isEditing, precision]);

  const handleBlur = () => {
    let numericValue = parseFloat(inputValue);
    if (isNaN(numericValue)) {
      numericValue = value; // Revertir si la entrada no es válida
    } else {
      // Forzar el valor a estar dentro de los límites min/max
      numericValue = Math.max(min, Math.min(max, numericValue));
    }
    onChange(numericValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur(); // Usar blur para guardar y cerrar
    } else if (e.key === 'Escape') {
      setInputValue(value.toFixed(precision)); // Revertir y cerrar
      setIsEditing(false);
    }
  };
  
  const displayValue = value.toFixed(precision);

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={label} className="text-sm font-medium text-cyan-200">
          {label}
        </label>
        <div className="w-28 text-right">
          {isEditing ? (
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              min={min}
              max={max}
              step={step}
              autoFocus
              className="font-mono text-white bg-cyan-800/70 w-full text-right px-2 py-0.5 rounded border border-cyan-600 focus:outline-none focus:ring-2 focus:ring-brand-accent"
              aria-label={`Editar ${label}`}
            />
          ) : (
            <span
              onClick={() => setIsEditing(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsEditing(true); }}
              className="font-mono text-white bg-cyan-900/50 px-2 py-0.5 rounded cursor-pointer transition-colors hover:bg-cyan-900 w-full inline-block"
              aria-label={`Valor actual de ${label}: ${displayValue} ${unit}. Click o presiona Enter para editar.`}
            >
              {displayValue} {unit}
            </span>
          )}
        </div>
      </div>
      <input
        id={label}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
      />
    </div>
  );
};

interface ExperimentControlsProps {
  materialKey: string;
  setMaterialKey: (key: string) => void;
  initialLength: number;
  setInitialLength: (length: number) => void;
  initialTemp: number;
  setInitialTemp: (temp: number) => void;
  finalTemp: number;
  setFinalTemp: (temp: number) => void;
  deltaL: number;
  finalLength: number;
  tempUnit: 'C' | 'K';
  setTempUnit: (unit: 'C' | 'K') => void;
}

const ExperimentControls: React.FC<ExperimentControlsProps> = ({
  materialKey,
  setMaterialKey,
  initialLength,
  setInitialLength,
  initialTemp,
  setInitialTemp,
  finalTemp,
  setFinalTemp,
  deltaL,
  finalLength,
  tempUnit,
  setTempUnit,
}) => {
  const currentMaterial: Material = MATERIALS[materialKey];
  
  const KELVIN_OFFSET = 273.15;
  const celsiusToKelvin = (c: number) => c + KELVIN_OFFSET;
  const kelvinToCelsius = (k: number) => k - KELVIN_OFFSET;

  // Temperature values for display
  const initialTempDisplay = tempUnit === 'K' ? celsiusToKelvin(initialTemp) : initialTemp;
  const finalTempDisplay = tempUnit === 'K' ? celsiusToKelvin(finalTemp) : finalTemp;

  // Temperature ranges for sliders in Celsius
  const initialTempMinC = -50;
  const initialTempMaxC = 50;
  const finalTempMinC = -50;
  const finalTempMaxC = 250;

  // Display ranges based on selected unit
  const initialTempMinDisplay = tempUnit === 'K' ? celsiusToKelvin(initialTempMinC) : initialTempMinC;
  const initialTempMaxDisplay = tempUnit === 'K' ? celsiusToKelvin(initialTempMaxC) : initialTempMaxC;
  const finalTempMinDisplay = tempUnit === 'K' ? celsiusToKelvin(finalTempMinC) : finalTempMinC;
  const finalTempMaxDisplay = tempUnit === 'K' ? celsiusToKelvin(finalTempMaxC) : finalTempMaxC;
  
  // Handlers to convert back to Celsius before updating state
  const handleInitialTempChange = (newDisplayValue: number) => {
    setInitialTemp(tempUnit === 'K' ? kelvinToCelsius(newDisplayValue) : newDisplayValue);
  };
  
  const handleFinalTempChange = (newDisplayValue: number) => {
    setFinalTemp(tempUnit === 'K' ? kelvinToCelsius(newDisplayValue) : newDisplayValue);
  };

  return (
    <div className="bg-brand-primary/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-cyan-800/50">
      <h2 className="text-2xl font-bold text-cyan-200 mb-6 border-b-2 border-cyan-800 pb-2">Parámetros del Experimento</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="material-select" className="block text-sm font-medium text-cyan-200 mb-2">Material</label>
            <select
              id="material-select"
              value={materialKey}
              onChange={(e) => setMaterialKey(e.target.value)}
              className="w-full bg-cyan-900/50 border border-cyan-700 text-white rounded-lg focus:ring-cyan-500 focus:border-cyan-500 p-2.5"
            >
              {Object.entries(MATERIALS).map(([key, material]) => (
                <option key={key} value={key}>{material.name}</option>
              ))}
            </select>
            <p className="text-xs text-cyan-400 mt-2">
                Coeficiente (α): {currentMaterial.coefficient.toExponential(2)} /°C
            </p>
          </div>
          <SliderControl
            label="Longitud Inicial (L₀)"
            value={initialLength}
            min={1}
            max={100}
            step={0.1}
            unit="m"
            precision={2}
            onChange={setInitialLength}
          />
          <div className="space-y-4 rounded-lg p-4 bg-cyan-900/20 border border-cyan-800/30">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-md font-semibold text-cyan-200">Controles de Temperatura</h3>
               <div className="inline-flex bg-cyan-900/50 rounded-md p-1">
                <button 
                  onClick={() => setTempUnit('C')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${tempUnit === 'C' ? 'bg-cyan-600 text-white' : 'text-cyan-300 hover:bg-cyan-800'}`}
                  aria-pressed={tempUnit === 'C'}
                >
                  °C
                </button>
                <button 
                  onClick={() => setTempUnit('K')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${tempUnit === 'K' ? 'bg-cyan-600 text-white' : 'text-cyan-300 hover:bg-cyan-800'}`}
                  aria-pressed={tempUnit === 'K'}
                >
                  K
                </button>
              </div>
            </div>
             <SliderControl
                label="Temperatura Inicial (T₀)"
                value={initialTempDisplay}
                min={initialTempMinDisplay}
                max={initialTempMaxDisplay}
                step={0.1}
                unit={tempUnit === 'K' ? 'K' : '°C'}
                precision={1}
                onChange={handleInitialTempChange}
              />
              <SliderControl
                label="Temperatura Final (T_f)"
                value={finalTempDisplay}
                min={finalTempMinDisplay}
                max={finalTempMaxDisplay}
                step={0.1}
                unit={tempUnit === 'K' ? 'K' : '°C'}
                precision={1}
                onChange={handleFinalTempChange}
              />
          </div>
        </div>
        <div className="bg-cyan-900/50 p-6 rounded-lg border border-cyan-800 flex flex-col justify-center space-y-4">
          <h3 className="text-lg font-semibold text-cyan-200 text-center">Resultados Calculados</h3>
          <div className="text-center">
             <p className="text-sm text-cyan-400">Cambio de Temperatura (ΔT)</p>
             <p className="text-2xl font-mono text-white">{(finalTemp - initialTemp).toFixed(2)} °C</p>
          </div>
          <div className="text-center">
             <p className="text-sm text-cyan-400">Cambio de Longitud (ΔL)</p>
             <p className="text-2xl font-mono text-brand-accent">{deltaL.toFixed(5)} m</p>
          </div>
           <div className="text-center pt-2 border-t border-cyan-800">
             <p className="text-sm text-cyan-400">Longitud Final (L)</p>
             <p className="text-2xl font-mono text-white">{finalLength.toFixed(5)} m</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperimentControls;

import React from 'react';

interface VisualizerProps {
  initialLength: number;
  deltaL: number;
  finalTemp: number;
  initialTemp: number;
}

const ThermometerIcon: React.FC<{ percentage: number }> = ({ percentage }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 inline-block mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" />
    <g mask="url(#mask0_82_2)">
        <rect x="9" y="4" width="6" height="12" style={{fill: percentage > 0 ? '#f87171' : '#60a5fa', transform: `scaleY(${Math.abs(percentage)})`, transformOrigin: 'bottom'}} />
    </g>
    <defs>
      <mask id="mask0_82_2">
        <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" fill="white" />
      </mask>
    </defs>
  </svg>
);


const Visualizer: React.FC<VisualizerProps> = ({ initialLength, deltaL, finalTemp, initialTemp }) => {
  // Exaggerate the visual change to make it perceptible.
  const VISUAL_SCALING_FACTOR = 5000;
  const relativeChange = (deltaL / initialLength) * VISUAL_SCALING_FACTOR;
  
  const tempPercentage = (finalTemp - initialTemp) / (250 - (-50)); // Normalize over the full possible temp range

  const tempChangeText = finalTemp > initialTemp ? 'Aumentando' : (finalTemp < initialTemp ? 'Disminuyendo' : 'Sin Cambio');
  const tempChangeColor = finalTemp > initialTemp ? 'text-red-400' : (finalTemp < initialTemp ? 'text-blue-400' : 'text-gray-400');

  return (
    <div className="bg-brand-primary/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-cyan-800/50 mt-8">
      <h2 className="text-2xl font-bold text-cyan-200 mb-4 border-b-2 border-cyan-800 pb-2">Visualización</h2>
      
      <div className="mb-6 text-center">
          <p className="text-cyan-400">Fórmula: <span className="font-mono text-brand-accent">ΔL = α ⋅ L₀ ⋅ ΔT</span></p>
      </div>

      <div className="w-full bg-gray-700 rounded-lg p-2">
        <div className="relative flex items-center h-16 bg-gray-800 rounded">
          <div className="h-full bg-gradient-to-r from-cyan-600 to-cyan-500 rounded-l transition-all duration-300 ease-out" style={{ width: `calc(50% - ${Math.max(0, relativeChange/2)}%)` }}>
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white font-bold text-sm">L₀</span>
          </div>
          
          <div 
             className={`h-full transition-all duration-300 ease-out ${deltaL >= 0 ? 'bg-gradient-to-r from-red-500 to-orange-400' : 'bg-gradient-to-l from-blue-500 to-sky-400'}`}
             style={{ width: `${Math.abs(relativeChange)}%`}}
          >
          </div>
          <div className="h-full bg-gray-600 flex-grow rounded-r"></div>
          
          <div 
            className="absolute top-1/2 h-16 w-0.5" 
            style={{ 
              left: '50%',
              backgroundColor: deltaL >= 0 ? 'rgba(255, 165, 0, 0.7)' : 'rgba(59, 130, 246, 0.7)',
              transition: 'transform 300ms ease-out',
              transform: `translateX(${relativeChange * 0.01 * 250}px)` // assuming bar is 500px wide
            }}
          >
             <span className="absolute -top-6 -translate-x-1/2 text-xs font-mono whitespace-nowrap" style={{color: deltaL >= 0 ? '#fb923c' : '#93c5fd'}}>
              ΔL
            </span>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 -bottom-6 text-sm text-gray-400">
            Punto Original
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-center items-center text-lg">
        <ThermometerIcon percentage={tempPercentage} />
        <span>Temperatura: </span>
        <span className={`font-bold ml-2 ${tempChangeColor}`}>
          {tempChangeText}
        </span>
      </div>
    </div>
  );
};

export default Visualizer;
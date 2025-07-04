
import React, { useState, useCallback } from 'react';
import { getExplanation } from '../services/geminiService';
import { MATERIALS } from '../constants';
import type { ExperimentData } from '../App';


const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 rounded-full bg-cyan-300 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
);

const GeminianoIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-accent" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a4.95 4.95 0 0 0-4.95 4.95A4.95 4.95 0 0 0 12 11.9a4.95 4.95 0 0 0 4.95-4.95A4.95 4.95 0 0 0 12 2zm0 14.1a4.95 4.95 0 0 0-4.95 4.95A4.95 4.95 0 0 0 12 26a4.95 4.95 0 0 0 4.95-4.95A4.95 4.95 0 0 0 12 16.1z" transform="scale(0.8) translate(2, -2)"/>
    </svg>
);


interface ExplanationProps {
    experimentData: ExperimentData;
}

const Explanation: React.FC<ExplanationProps> = ({ experimentData }) => {
    const [question, setQuestion] = useState<string>('¿Por qué este material se expande con el calor?');
    const [explanation, setExplanation] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleGetExplanation = useCallback(async () => {
        setIsLoading(true);
        setError('');
        setExplanation('');
        
        const { materialKey, initialLength, initialTemp, finalTemp, deltaL } = experimentData;
        const material = MATERIALS[materialKey];

        const prompt = `
Contexto del experimento de simulación de dilatación lineal:
- Material: ${material.name}
- Coeficiente de dilatación (α): ${material.coefficient.toExponential(2)} /°C
- Longitud Inicial (L₀): ${initialLength.toFixed(2)} metros
- Temperatura Inicial (T₀): ${initialTemp.toFixed(2)} °C
- Temperatura Final (T_f): ${finalTemp.toFixed(2)} °C
- Cambio de Temperatura (ΔT): ${(finalTemp - initialTemp).toFixed(2)} °C
- Cambio de Longitud calculado (ΔL): ${deltaL.toExponential(4)} metros
- Longitud Final (L): ${(initialLength + deltaL).toFixed(5)} metros

Mi pregunta es: "${question}"

Basado en el contexto anterior, por favor responde a mi pregunta.
        `;

        try {
            const result = await getExplanation(prompt);
            setExplanation(result);
        } catch (err) {
            setError('Ocurrió un error al obtener la explicación. Por favor, inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    }, [question, experimentData]);


    return (
        <div className="bg-brand-primary/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-cyan-800/50 mt-8">
             <div className="flex items-center gap-4">
                <GeminianoIcon />
                <h2 className="text-2xl font-bold text-cyan-200">Pregúntale al profe</h2>
            </div>
            <p className="text-cyan-400 mt-2 mb-4">Haz una pregunta sobre el experimento actual para obtener una explicación de nuestro profe de física. Quizás te suba un punto ;).</p>
            
            <div className="flex flex-col md:flex-row gap-4">
                <input 
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ej: ¿Qué pasaría si usara plomo?"
                    className="flex-grow bg-cyan-900/50 border border-cyan-700 text-white rounded-lg focus:ring-cyan-500 focus:border-cyan-500 p-2.5"
                    disabled={isLoading}
                />
                <button
                    onClick={handleGetExplanation}
                    disabled={isLoading || !question}
                    className="px-6 py-2.5 bg-brand-secondary hover:bg-cyan-600 text-white font-bold rounded-lg transition-colors duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex justify-center items-center"
                >
                    {isLoading ? <LoadingSpinner /> : 'Obtener Explicación'}
                </button>
            </div>

            {error && <p className="text-red-400 mt-4">{error}</p>}
            
            {explanation && (
                <div className="mt-6 p-4 bg-gray-900/70 border border-cyan-900 rounded-lg">
                    <h3 className="text-lg font-semibold text-brand-accent mb-2">Explicación del profe Quijada:</h3>
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{explanation}</p>
                </div>
            )}
        </div>
    );
};

export default Explanation;

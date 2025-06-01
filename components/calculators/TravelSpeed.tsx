
import React, { useState, useCallback } from 'react';
import CalculatorInput from '../CalculatorInput';
import CalculatorShell from '../CalculatorShell';
import { InputConfig } from '../../types';

const TravelSpeed: React.FC = () => {
  const [inputs, setInputs] = useState({
    tempoMedio50m: '30', // Tempo médio para percorrer 50 metros (segundos)
  });
  const [results, setResults] = useState<{ label: string; value: number; unit: string }[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = useCallback(() => {
    const tempo_s = parseFloat(inputs.tempoMedio50m);

    if (isNaN(tempo_s) || tempo_s <= 0) {
      setResults([{ label: "Erro", value: NaN, unit: "Tempo inválido" }]);
      return;
    }

    const velocidade_km_h = 180 / tempo_s;

    setResults([
      { label: "Velocidade de Deslocamento", value: velocidade_km_h, unit: "Km/h" },
    ]);
  }, [inputs]);

  const inputConfigs: InputConfig[] = [
    { name: 'tempoMedio50m', label: 'Tempo Médio para Percorrer 50m', type: 'number', unit: 'segundos', placeholder: 'Ex: 30' },
  ];
  
  const formulaNode = (
    <>
      <p><strong>Velocidade (Km/h) = 180 / Tempo (s)</strong></p>
      <ul className="list-disc list-inside mt-2 text-xs">
        <li>Tempo (s): Tempo médio, em segundos, para percorrer 50 metros.</li>
        <li>180: Fator de conversão constante (50m * 3,6 km/h por m/s).</li>
      </ul>
    </>
  );
   const notesNode = (
    <p>Marque uma distância de 50 metros no terreno. Com a máquina na marcha e rotação de trabalho, cronometre o tempo para percorrer essa distância. Repita algumas vezes e use o tempo médio.</p>
  );

  return (
    <CalculatorShell 
        title="Cálculo da Velocidade de Deslocamento" 
        description="Calcula a velocidade de deslocamento de máquinas agrícolas com base no tempo gasto para percorrer uma distância de 50 metros." 
        results={results} 
        formula={formulaNode}
        notes={notesNode}
    >
      {inputConfigs.map(config => (
        <CalculatorInput
          key={config.name}
          config={config}
          value={inputs[config.name as keyof typeof inputs]}
          onChange={handleInputChange}
        />
      ))}
      <button
        onClick={calculate}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out"
      >
        Calcular
      </button>
    </CalculatorShell>
  );
};

export default TravelSpeed;

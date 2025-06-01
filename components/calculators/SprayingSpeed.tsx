
import React, { useState, useCallback } from 'react';
import CalculatorInput from '../CalculatorInput';
import CalculatorShell from '../CalculatorShell';
import { InputConfig } from '../../types';

const SprayingSpeed: React.FC = () => {
  const [inputs, setInputs] = useState({
    volumeCaldaLHa: '150',   // Volume de Calda Desejado (L/ha)
    vazaoBicoLMin: '1.2',    // Vazão Média dos Bicos (L/min)
    espacamentoBicosM: '0.5',// Espaçamento entre Bicos (m)
  });
  const [results, setResults] = useState<{ label: string; value: number | string; unit: string }[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = useCallback(() => {
    const volumeCaldaLHa_val = parseFloat(inputs.volumeCaldaLHa);
    const vazaoBicoLMin_val = parseFloat(inputs.vazaoBicoLMin);
    const espacamentoBicosM_val = parseFloat(inputs.espacamentoBicosM);

    if (isNaN(volumeCaldaLHa_val) || isNaN(vazaoBicoLMin_val) || isNaN(espacamentoBicosM_val) ||
        volumeCaldaLHa_val <= 0 || vazaoBicoLMin_val <= 0 || espacamentoBicosM_val <= 0) {
      setResults([{ label: "Erro", value: "Entrada inválida.", unit: "Todos os valores devem ser positivos." }]);
      return;
    }

    const velocidadeKmH = (vazaoBicoLMin_val * 600) / (volumeCaldaLHa_val * espacamentoBicosM_val);
    const velocidadeMs = velocidadeKmH / 3.6;


    setResults([
      { label: "Velocidade de Deslocamento Requerida", value: velocidadeKmH, unit: "Km/h" },
      { label: "Velocidade de Deslocamento Requerida", value: velocidadeMs, unit: "m/s" },
    ]);
  }, [inputs]);

  const inputConfigs: InputConfig[] = [
    { name: 'volumeCaldaLHa', label: 'Volume de Calda Desejado', type: 'number', unit: 'L/ha', placeholder: 'Ex: 150' },
    { name: 'vazaoBicoLMin', label: 'Vazão Média por Bico (Real)', type: 'number', unit: 'L/min', placeholder: 'Ex: 1.2 (medida ou do catálogo)' },
    { name: 'espacamentoBicosM', label: 'Espaçamento entre Bicos na Barra', type: 'number', unit: 'm', placeholder: 'Ex: 0.5' },
  ];

  const formulaNode = (
    <>
      <p><strong>Velocidade (Km/h) = (Vazão do Bico (L/min) * 600) / (Volume de Calda (L/ha) * Espaçamento Bicos (m))</strong></p>
      <ul className="list-disc list-inside mt-2 text-xs">
        <li>Esta fórmula é a inversa da utilizada para calcular a vazão do bico.</li>
        <li>O fator 600 é uma constante de conversão de unidades.</li>
        <li>Velocidade (m/s) = Velocidade (Km/h) / 3.6</li>
      </ul>
    </>
  );
  
  const notesNode = (
    <>
      <p>Este cálculo determina a velocidade de deslocamento necessária para atingir o volume de calda desejado, dada a vazão real dos bicos e o espaçamento entre eles.</p>
      <p>A "Vazão Média por Bico (Real)" deve ser obtida medindo a vazão de alguns bicos na barra ou consultando o catálogo do fabricante para a pressão de trabalho utilizada.</p>
      <p>Ajuste a marcha e aceleração do trator/pulverizador para atingir essa velocidade.</p>
    </>
  );

  return (
    <CalculatorShell
      title="Cálculo da Velocidade de Aplicação (Pulverização)"
      description="Determina a velocidade de deslocamento ideal para pulverização com base no volume de calda desejado, vazão dos bicos e espaçamento."
      results={results}
      formula={formulaNode}
      notes={notesNode}
      inputConfigsForReport={inputConfigs}
      inputValuesForReport={inputs}
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

export default SprayingSpeed;

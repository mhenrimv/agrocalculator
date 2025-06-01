
import React, { useState, useCallback } from 'react';
import CalculatorInput from '../CalculatorInput';
import CalculatorShell from '../CalculatorShell';
import { InputConfig } from '../../types';

const SprayerRegulationNozzle: React.FC = () => {
  const [inputs, setInputs] = useState({
    volumeCaldaLHa: '150', // Volume de Calda (L/ha)
    velocidadeKmH: '5',    // Velocidade de Deslocamento (Km/h)
    espacamentoBicosM: '0.5', // Espaçamento entre Bicos (m)
  });
  const [results, setResults] = useState<{ label: string; value: number | string; unit: string }[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = useCallback(() => {
    const volumeCalda_val = parseFloat(inputs.volumeCaldaLHa);
    const velocidade_val = parseFloat(inputs.velocidadeKmH);
    const espacamentoBicos_val = parseFloat(inputs.espacamentoBicosM);

    if (isNaN(volumeCalda_val) || isNaN(velocidade_val) || isNaN(espacamentoBicos_val) || volumeCalda_val <= 0 || velocidade_val <= 0 || espacamentoBicos_val <= 0) {
      setResults([{ label: "Erro", value: "Entrada inválida.", unit: "Todos os valores devem ser positivos." }]);
      return;
    }

    const vazaoBicoLMin = (volumeCalda_val * velocidade_val * espacamentoBicos_val) / 600;
    const vazaoBicoMLMin = vazaoBicoLMin * 1000;

    setResults([
      { label: "Vazão por Bico", value: vazaoBicoLMin, unit: "L/min" },
      { label: "Vazão por Bico", value: vazaoBicoMLMin, unit: "mL/min" },
    ]);
  }, [inputs]);

  const inputConfigs: InputConfig[] = [
    { name: 'volumeCaldaLHa', label: 'Volume de Calda Desejado', type: 'number', unit: 'L/ha', placeholder: 'Ex: 150' },
    { name: 'velocidadeKmH', label: 'Velocidade de Deslocamento', type: 'number', unit: 'Km/h', placeholder: 'Ex: 5' },
    { name: 'espacamentoBicosM', label: 'Espaçamento entre Bicos na Barra', type: 'number', unit: 'm', placeholder: 'Ex: 0.5' },
  ];

  const formulaNode = (
    <>
      <p><strong>Vazão do Bico (L/min) = (Volume de Calda (L/ha) * Velocidade (Km/h) * Espaçamento entre Bicos (m)) / 600</strong></p>
      <p className="text-xs mt-1">O fator 600 é uma constante de conversão de unidades (10.000 m²/ha * 1h/60min = 166,66...; 10000 / (60 * X) ... a fórmula mais comum é V= (Q*v*L)/600, onde Q é L/ha, v é km/h, L é espaçamento em m).</p>
      <p className="text-xs mt-1">A vazão em mL/min é simplesmente L/min * 1000.</p>
    </>
  );
  
  const notesNode = (
    <>
      <p>Este cálculo ajuda a selecionar o bico de pulverização correto ou a verificar se os bicos atuais são adequados para a taxa de aplicação, velocidade e espaçamento desejados.</p>
      <p>Compare o resultado com as tabelas de vazão fornecidas pelos fabricantes de bicos.</p>
    </>
  );

  return (
    <CalculatorShell
      title="Regulagem de Pulverizador (Vazão de Bico)"
      description="Calcula a vazão necessária por bico de pulverização (em L/min e mL/min) com base no volume de calda desejado, velocidade de deslocamento e espaçamento entre bicos."
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

export default SprayerRegulationNozzle;

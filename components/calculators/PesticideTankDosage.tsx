
import React, { useState, useCallback } from 'react';
import CalculatorInput from '../CalculatorInput';
import CalculatorShell from '../CalculatorShell';
import { InputConfig } from '../../types';

const PesticideTankDosage: React.FC = () => {
  const [inputs, setInputs] = useState({
    dosagemRecomendada: '2.0', // Dosagem recomendada (L/ha ou mL/ha)
    capacidadePulverizador: '400', // Capacidade do pulverizador (Litros)
    volumeCalda: '150', // Volume de calda (Litros/hectare)
    dosageUnit: 'L/ha', // Unidade para dosagem recomendada
  });
  const [results, setResults] = useState<{ label: string; value: number; unit: string }[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = useCallback(() => {
    const dosagemRecomendada_val = parseFloat(inputs.dosagemRecomendada);
    const capacidadePulverizador_val = parseFloat(inputs.capacidadePulverizador);
    const volumeCalda_val = parseFloat(inputs.volumeCalda);

    if (isNaN(dosagemRecomendada_val) || isNaN(capacidadePulverizador_val) || isNaN(volumeCalda_val) || volumeCalda_val <= 0 || capacidadePulverizador_val <=0 || dosagemRecomendada_val < 0) {
      setResults([{ label: "Erro", value: NaN, unit: "Entrada inválida" }]);
      return;
    }

    const qa_tanque = (dosagemRecomendada_val * capacidadePulverizador_val) / volumeCalda_val;
    const resultUnit = inputs.dosageUnit === 'L/ha' ? 'Litros' : 'mL';

    setResults([
      { label: "Produto por Tanque", value: qa_tanque, unit: resultUnit },
    ]);
  }, [inputs]);

  const inputConfigs: InputConfig[] = [
    { name: 'dosagemRecomendada', label: 'Dosagem Recomendada do Produto', type: 'number', placeholder: 'Ex: 2.0 (conforme bula)' },
    { name: 'dosageUnit', label: 'Unidade da Dosagem Recomendada', type: 'select', options: [{value: 'L/ha', label: 'L/ha'}, {value: 'mL/ha', label: 'mL/ha'}] },
    { name: 'capacidadePulverizador', label: 'Capacidade do Tanque do Pulverizador', type: 'number', unit: 'Litros', placeholder: 'Ex: 400' },
    { name: 'volumeCalda', label: 'Volume de Calda por Hectare', type: 'number', unit: 'L/ha', placeholder: 'Ex: 150 (definido na calibração)' },
  ];
  
  const formulaNode = (
    <>
      <p><strong>Produto por Tanque (QA) = (Dosagem Recomendada * Capacidade do Pulverizador) / Volume de Calda por Hectare</strong></p>
      <p className="text-xs mt-1">Certifique-se de que a unidade da dosagem recomendada (L/ha ou mL/ha) seja consistente com o resultado esperado (Litros por tanque ou mL por tanque).</p>
    </>
  );
  const notesNode = (
    <p>O Volume de Calda por Hectare é obtido através da calibração do pulverizador. A Dosagem Recomendada é encontrada na bula do produto.</p>
  );

  return (
    <CalculatorShell 
        title="Dosagem de Defensivo por Tanque Pulverizador" 
        description="Calcula a quantidade de defensivo agrícola (produto comercial) a ser adicionada ao tanque do pulverizador, com base na dosagem recomendada, capacidade do tanque e volume de calda por hectare." 
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

export default PesticideTankDosage;

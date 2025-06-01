
import React, { useState, useCallback } from 'react';
import CalculatorInput from '../CalculatorInput';
import CalculatorShell from '../CalculatorShell';
import { InputConfig } from '../../types';

const LimingRequirement: React.FC = () => {
  const [inputs, setInputs] = useState({
    VE: '70', // Saturação por bases desejada (%)
    V: '50',  // Saturação por bases atual (%)
    T: '7',   // CTC a pH 7,0 (cmolc/dm³)
    PRNT: '80', // Poder Relativo de Neutralização Total (%)
    Profundidade: '20', // Profundidade (cm)
    AreaPercent: '100', // Área (%)
  });
  const [results, setResults] = useState<{ label: string; value: number | string; unit: string }[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = useCallback(() => {
    const VE_val = parseFloat(inputs.VE);
    const V_val = parseFloat(inputs.V);
    const T_val = parseFloat(inputs.T);
    const PRNT_val = parseFloat(inputs.PRNT);
    const Profundidade_val = parseFloat(inputs.Profundidade);
    const AreaPercent_val = parseFloat(inputs.AreaPercent);

    if (isNaN(VE_val) || isNaN(V_val) || isNaN(T_val) || isNaN(PRNT_val) || isNaN(Profundidade_val) || isNaN(AreaPercent_val) || PRNT_val === 0 || T_val === 0) {
      setResults([{ label: "Erro", value: NaN, unit: "Verifique as entradas. PRNT e T não podem ser zero." }]);
      return;
    }
    
    if (V_val >= VE_val) {
      setResults([
        { label: "Necessidade de Calcário (NC)", value: 0, unit: "t/ha" },
        { label: "Calagem Corrigida (Qta)", value: 0, unit: "t/ha" },
        { label: "Info", value: "A saturação por bases atual (V%) já é igual ou superior à desejada (VE%). Não é necessário aplicar calcário.", unit: ""}
      ]);
      return;
    }


    const NC = (VE_val - V_val) * T_val / 100; // t/ha
    const Qta = NC * (100 / PRNT_val) * (Profundidade_val / 20) * (AreaPercent_val / 100); // t/ha

    setResults([
      { label: "Necessidade de Calcário (NC)", value: NC, unit: "t/ha" },
      { label: "Calagem Corrigida (Qta)", value: Qta, unit: "t/ha" },
    ]);
  }, [inputs]);

  const inputConfigs: InputConfig[] = [
    { name: 'VE', label: 'Saturação por Bases Desejada (VE)', type: 'number', unit: '%', placeholder: 'Ex: 70' },
    { name: 'V', label: 'Saturação por Bases Atual do Solo (V)', type: 'number', unit: '%', placeholder: 'Ex: 50' },
    { name: 'T', label: 'CTC a pH 7,0 (T)', type: 'number', unit: 'cmolc/dm³', placeholder: 'Ex: 7' },
    { name: 'PRNT', label: 'Poder Relativo de Neutralização Total (PRNT)', type: 'number', unit: '%', placeholder: 'Ex: 80' },
    { name: 'Profundidade', label: 'Profundidade de Incorporação', type: 'number', unit: 'cm', placeholder: 'Ex: 20 (0-20cm)' },
    { name: 'AreaPercent', label: 'Porcentagem da Área de Aplicação', type: 'number', unit: '%', placeholder: 'Ex: 100 (para área total)' },
  ];

  const formulaNode = (
    <>
      <p><strong>NC (t/ha) = (VE - V) * T / 100</strong></p>
      <p><strong>Qta (t/ha) = NC * (100 / PRNT) * (Profundidade / 20) * (Área % / 100)</strong></p>
      <ul className="list-disc list-inside mt-2 text-xs">
        <li>VE: Saturação por bases exigida pela cultura (%)</li>
        <li>V: Saturação por bases do solo atual (%)</li>
        <li>T: CTC Potencial a pH 7,0 (cmolc/dm³)</li>
        <li>PRNT: Poder Relativo de Neutralização Total (%)</li>
        <li>Profundidade: Profundidade de incorporação (cm), padrão 20cm para camada 0-20cm.</li>
        <li>Área %: Porcentagem da área que receberá calcário (%).</li>
      </ul>
    </>
  );
   const notesNode = (
    <p>Se a Saturação por Bases Atual (V%) for maior ou igual à Desejada (VE%), a necessidade de calcário será zero.</p>
  );

  return (
    <CalculatorShell 
      title="Necessidade de Calagem (Método Saturação por Bases)" 
      description="Calcula a quantidade de calcário (em toneladas por hectare) necessária para corrigir a acidez do solo, utilizando o método da saturação por bases." 
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

export default LimingRequirement;

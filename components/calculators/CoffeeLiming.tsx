
import React, { useState, useCallback } from 'react';
import CalculatorInput from '../CalculatorInput';
import CalculatorShell from '../CalculatorShell';
import { InputConfig } from '../../types';

const CoffeeLiming: React.FC = () => {
  const [inputs, setInputs] = useState({
    V_atual: '40',      // Saturação por bases atual do solo (%)
    CTC_pH7: '8',       // CTC a pH 7,0 (cmolc/dm³)
    PRNT: '85',         // Poder Relativo de Neutralização Total (%)
    V_desejada_cafe: '60', // Saturação por bases desejada para café (%)
    profundidade: '20',   // Profundidade de incorporação (cm)
    areaAplicacaoPercent: '100', // Percentual da área de aplicação (%)
  });
  const [results, setResults] = useState<{ label: string; value: number | string; unit: string }[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = useCallback(() => {
    const V_atual_val = parseFloat(inputs.V_atual);
    const CTC_pH7_val = parseFloat(inputs.CTC_pH7);
    const PRNT_val = parseFloat(inputs.PRNT);
    const V_desejada_cafe_val = parseFloat(inputs.V_desejada_cafe);
    const profundidade_val = parseFloat(inputs.profundidade);
    const areaAplicacaoPercent_val = parseFloat(inputs.areaAplicacaoPercent);

    if (isNaN(V_atual_val) || isNaN(CTC_pH7_val) || isNaN(PRNT_val) || isNaN(V_desejada_cafe_val) || isNaN(profundidade_val) || isNaN(areaAplicacaoPercent_val) || PRNT_val === 0 || CTC_pH7_val === 0 || profundidade_val === 0) {
      setResults([{ label: "Erro", value: "Entradas inválidas.", unit: "Verifique os valores. PRNT, CTC e Profundidade não podem ser zero." }]);
      return;
    }
    
    if (V_atual_val >= V_desejada_cafe_val) {
      setResults([
        { label: "Necessidade de Calcário para Café (NC Café)", value: 0, unit: "t/ha" },
        { label: "Info", value: `A saturação por bases atual (${V_atual_val}%) já é igual ou superior à desejada para café (${V_desejada_cafe_val}%).`, unit: "" }
      ]);
      return;
    }

    // Fórmula: NC (t/ha) = [(Vdesejada - Vatual) * CTC] / PRNT  <- esta é uma simplificação.
    // Usando a fórmula mais comum e completa, similar à calagem geral:
    // 1. Calcula a Necessidade de Calcário base (NC_base) como se PRNT fosse 100% e profundidade 20cm.
    const NC_base = ((V_desejada_cafe_val - V_atual_val) * CTC_pH7_val) / 100; // t/ha
    // 2. Corrige pela PRNT, profundidade e área de aplicação.
    const Qtd_aplicar = NC_base * (100 / PRNT_val) * (profundidade_val / 20) * (areaAplicacaoPercent_val / 100); // t/ha

    setResults([
      { label: "Necessidade de Calcário para Café (NC Café)", value: Qtd_aplicar, unit: "t/ha" },
    ]);
  }, [inputs]);

  const inputConfigs: InputConfig[] = [
    { name: 'V_atual', label: 'Saturação por Bases Atual do Solo (Vatual)', type: 'number', unit: '%', placeholder: 'Ex: 40' },
    { name: 'CTC_pH7', label: 'Capacidade de Troca Catiônica a pH 7,0 (CTC)', type: 'number', unit: 'cmolc/dm³', placeholder: 'Ex: 8' },
    { name: 'V_desejada_cafe', label: 'Saturação por Bases Desejada para Café (Vdesejada)', type: 'number', unit: '%', placeholder: 'Ex: 60 (comum para café)' },
    { name: 'PRNT', label: 'Poder Relativo de Neutralização Total do Calcário (PRNT)', type: 'number', unit: '%', placeholder: 'Ex: 85' },
    { name: 'profundidade', label: 'Profundidade de Incorporação', type: 'number', unit: 'cm', placeholder: 'Ex: 20 (para 0-20cm)' },
    { name: 'areaAplicacaoPercent', label: 'Percentual da Área de Aplicação', type: 'number', unit: '%', placeholder: 'Ex: 100 (área total)' },
  ];

  const formulaNode = (
    <>
      <p>1. <strong>NC<sub>base</sub> (t/ha) = (V<sub>desejada Café</sub> - V<sub>atual</sub>) * CTC<sub>pH7</sub> / 100</strong></p>
      <p>2. <strong>NC Café (t/ha) = NC<sub>base</sub> * (100 / PRNT) * (Profundidade<sub>cm</sub> / 20) * (Área Aplic. % / 100)</strong></p>
      <ul className="list-disc list-inside mt-2 text-xs">
        <li>V<sub>desejada Café</sub>: Saturação por bases desejada para a cultura do café (%).</li>
        <li>V<sub>atual</sub>: Saturação por bases atual do solo (%).</li>
        <li>CTC<sub>pH7</sub>: Capacidade de Troca Catiônica a pH 7,0 (cmolc/dm³).</li>
        <li>PRNT: Poder Relativo de Neutralização Total do calcário (%).</li>
        <li>Profundidade<sub>cm</sub>: Profundidade de incorporação do calcário (cm). O fator (Profundidade/20) ajusta para profundidades diferentes de 20cm.</li>
        <li>Área Aplic. %: Percentual da área que receberá o calcário.</li>
      </ul>
    </>
  );

  const notesNode = (
    <>
        <p>Este cálculo visa elevar a saturação por bases do solo ao nível recomendado para o café (geralmente entre 60-70%).</p>
        <p>A profundidade de incorporação e o percentual de área de aplicação são importantes para ajustar a dose à realidade do manejo.</p>
        <p>Consulte sempre um engenheiro agrônomo para recomendações específicas baseadas na análise completa do solo e nas condições da sua lavoura.</p>
    </>
  );

  return (
    <CalculatorShell
      title="Calagem para Café (Método Saturação por Bases)"
      description="Calcula a quantidade de calcário necessária para atingir a saturação por bases ideal para lavouras de café."
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

export default CoffeeLiming;

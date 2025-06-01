
import React, { useState, useCallback } from 'react';
import CalculatorInput from '../CalculatorInput';
import CalculatorShell from '../CalculatorShell';
import { InputConfig } from '../../types';

const SoybeanFlowerAbortionLoss: React.FC = () => {
  const [inputs, setInputs] = useState({
    floresAbortadasMetro: '50', // Número de Flores/Vagens Jovens Abortadas por Metro Linear
    espacamentoLinhasM: '0.5',  // Espaçamento entre Linhas (m)
    graosVagemViavel: '2.5',    // Número Médio de Grãos por Vagem Viável
    pmgG: '180',                // Peso de Mil Grãos (PMG) (g)
  });
  const [results, setResults] = useState<{ label: string; value: number | string; unit: string }[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = useCallback(() => {
    const floresAbortadasMetro_val = parseFloat(inputs.floresAbortadasMetro);
    const espacamentoLinhasM_val = parseFloat(inputs.espacamentoLinhasM);
    const graosVagemViavel_val = parseFloat(inputs.graosVagemViavel);
    const pmgG_val = parseFloat(inputs.pmgG);

    if (isNaN(floresAbortadasMetro_val) || isNaN(espacamentoLinhasM_val) || isNaN(graosVagemViavel_val) || isNaN(pmgG_val) ||
        floresAbortadasMetro_val < 0 || espacamentoLinhasM_val <= 0 || graosVagemViavel_val <= 0 || pmgG_val <= 0) {
      setResults([{ label: "Erro", value: "Entrada inválida.", unit: "Verifique os valores. Espaçamento, Grãos/Vagem e PMG devem ser positivos." }]);
      return;
    }

    // 1. Flores/Vagens Abortadas por hectare
    const floresAbortadasHa = (floresAbortadasMetro_val / espacamentoLinhasM_val) * 10000;
    // (Considera-se que cada flor/vagem jovem abortada representa uma vagem perdida potencial)
    const vagensPerdidasHa = floresAbortadasHa;
    // 2. Grãos Perdidos por hectare
    const graosPerdidosHa = vagensPerdidasHa * graosVagemViavel_val;
    // 3. Perda de Produtividade (kg/ha)
    const perdaKgHa = (graosPerdidosHa * pmgG_val) / 1000000;
    // 4. Perda de Produtividade (sc/ha)
    const perdaScHa = perdaKgHa / 60;

    setResults([
      { label: "Flores/Vagens Jovens Abortadas por Hectare", value: vagensPerdidasHa, unit: "unid./ha" },
      { label: "Grãos Potenciais Perdidos por Hectare", value: graosPerdidosHa, unit: "grãos/ha" },
      { label: "Perda Estimada de Produtividade", value: perdaKgHa, unit: "kg/ha" },
      { label: "Perda Estimada de Produtividade", value: perdaScHa, unit: "sc/ha (60kg)" },
    ]);
  }, [inputs]);

  const inputConfigs: InputConfig[] = [
    { name: 'floresAbortadasMetro', label: 'Nº de Flores/Vagens Jovens Abortadas por Metro Linear', type: 'number', placeholder: 'Ex: 50' },
    { name: 'espacamentoLinhasM', label: 'Espaçamento entre Linhas', type: 'number', unit: 'm', placeholder: 'Ex: 0.5' },
    { name: 'graosVagemViavel', label: 'Nº Médio de Grãos por Vagem Viável', type: 'number', placeholder: 'Ex: 2.5' },
    { name: 'pmgG', label: 'Peso de Mil Grãos (PMG)', type: 'number', unit: 'g', placeholder: 'Ex: 180' },
  ];

  const formulaNode = (
    <>
      <p>1. <strong>Vagens Potenciais Perdidas/ha = (Flores Abortadas/metro / Espaçamento Linhas) * 10.000</strong></p>
      <p>2. <strong>Grãos Perdidos/ha = Vagens Perdidas/ha * Grãos/Vagem Viável</strong></p>
      <p>3. <strong>Perda de Produtividade (kg/ha) = (Grãos Perdidos/ha * PMG<sub>g</sub>) / 1.000.000</strong></p>
      <p>4. <strong>Perda de Produtividade (sc/ha) = Perda (kg/ha) / 60</strong></p>
    </>
  );

  const notesNode = (
    <>
    <p>O abortamento de flores e vagens jovens é um processo natural na soja, mas níveis excessivos podem indicar estresse (hídrico, nutricional, ataque de pragas/doenças).</p>
    <p>A contagem de flores/vagens abortadas pode ser feita no solo, abaixo das plantas, em uma seção linear conhecida.</p>
    <p>Este cálculo fornece uma estimativa da perda potencial. A planta pode compensar parcialmente esse abortamento dependendo da fase e intensidade.</p>
    </>
  );

  return (
    <CalculatorShell
      title="Estimativa de Perda por Abortamento Floral/Vagens Jovens na Soja"
      description="Calcula a perda estimada de produtividade na soja devido ao abortamento de flores ou vagens jovens."
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

export default SoybeanFlowerAbortionLoss;

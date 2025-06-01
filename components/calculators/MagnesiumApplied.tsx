
import React, { useState, useCallback } from 'react';
import CalculatorInput from '../CalculatorInput';
import CalculatorShell from '../CalculatorShell';
import { InputConfig } from '../../types';

const MagnesiumApplied: React.FC = () => {
  const [inputs, setInputs] = useState({
    calcarioAplicadoTha: '2', // Quantidade de Calcário Aplicada (t/ha)
    teorMgOPercent: '12',     // Teor de Óxido de Magnésio (MgO) no Calcário (%)
  });
  const [results, setResults] = useState<{ label: string; value: number | string; unit: string }[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = useCallback(() => {
    const calcarioAplicadoTha_val = parseFloat(inputs.calcarioAplicadoTha);
    const teorMgOPercent_val = parseFloat(inputs.teorMgOPercent);

    if (isNaN(calcarioAplicadoTha_val) || isNaN(teorMgOPercent_val) ||
        calcarioAplicadoTha_val < 0 || teorMgOPercent_val < 0 || teorMgOPercent_val > 100) {
      setResults([{ label: "Erro", value: "Entrada inválida.", unit: "Verifique os valores. Calcário >=0, Teor MgO entre 0-100%." }]);
      return;
    }

    // 1. MgO (kg/ha)
    const mgoKgHa = calcarioAplicadoTha_val * 1000 * (teorMgOPercent_val / 100);
    // 2. Mg Elementar (kg/ha)
    // Fator de conversão de MgO para Mg: Peso molecular Mg = 24.305, O = 15.999. MgO = 40.304.
    // Mg/MgO = 24.305 / 40.304 ≈ 0.60304
    const mgElementarKgHa = mgoKgHa * 0.60304;

    setResults([
      { label: "Óxido de Magnésio (MgO) Aplicado", value: mgoKgHa, unit: "kg/ha" },
      { label: "Magnésio Elementar (Mg) Aplicado", value: mgElementarKgHa, unit: "kg/ha" },
    ]);
  }, [inputs]);

  const inputConfigs: InputConfig[] = [
    { name: 'calcarioAplicadoTha', label: 'Quantidade de Calcário Aplicada', type: 'number', unit: 't/ha', placeholder: 'Ex: 2' },
    { name: 'teorMgOPercent', label: 'Teor de Óxido de Magnésio (MgO) no Calcário', type: 'number', unit: '%', placeholder: 'Ex: 12 (para calcário dolomítico)' },
  ];

  const formulaNode = (
    <>
      <p>1. <strong>MgO Aplicado (kg/ha) = Qtd. Calcário (t/ha) * 1000 * (Teor MgO % / 100)</strong></p>
      <p>2. <strong>Mg Elementar (kg/ha) = MgO Aplicado (kg/ha) * 0,60304</strong></p>
      <ul className="list-disc list-inside mt-2 text-xs">
        <li>1000: Converte toneladas de calcário para kg.</li>
        <li>0,60304: Fator de conversão de MgO para Mg elementar (relação entre as massas molares).</li>
      </ul>
    </>
  );

  const notesNode = (
    <>
    <p>Este cálculo ajuda a quantificar o aporte de magnésio ao solo através da calagem, especialmente com calcários dolomíticos ou magnesianos.</p>
    <p>O teor de MgO é uma informação importante presente na análise do corretivo.</p>
    </>
  );

  return (
    <CalculatorShell
      title="Magnésio (Mg) Aplicado ao Solo via Calcário"
      description="Calcula a quantidade de Óxido de Magnésio (MgO) e Magnésio elementar (Mg) aplicada por hectare com base na dose de calcário e seu teor de MgO."
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

export default MagnesiumApplied;

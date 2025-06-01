
import React, { useState, useCallback } from 'react';
import CalculatorInput from '../CalculatorInput';
import CalculatorShell from '../CalculatorShell';
import { InputConfig } from '../../types';

const SoybeanYieldEst: React.FC = () => {
  const [inputs, setInputs] = useState({
    plantasMetro: '10',       // Número de Plantas por Metro Linear
    vagensPlanta: '25',       // Número de Vagens por Planta
    graosVagem: '2.5',        // Número de Grãos por Vagem (média)
    espacamentoLinhasM: '0.5',// Espaçamento entre Linhas (m)
    pmgG: '180',              // Peso de Mil Grãos (PMG) (g)
  });
  const [results, setResults] = useState<{ label: string; value: number | string; unit: string }[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = useCallback(() => {
    const plantasMetro_val = parseFloat(inputs.plantasMetro);
    const vagensPlanta_val = parseFloat(inputs.vagensPlanta);
    const graosVagem_val = parseFloat(inputs.graosVagem);
    const espacamentoLinhasM_val = parseFloat(inputs.espacamentoLinhasM);
    const pmgG_val = parseFloat(inputs.pmgG);

    if (isNaN(plantasMetro_val) || isNaN(vagensPlanta_val) || isNaN(graosVagem_val) || isNaN(espacamentoLinhasM_val) || isNaN(pmgG_val) ||
        plantasMetro_val <= 0 || vagensPlanta_val < 0 || graosVagem_val < 0 || espacamentoLinhasM_val <= 0 || pmgG_val <= 0) {
      setResults([{ label: "Erro", value: "Entrada inválida.", unit: "Verifique os valores. Devem ser positivos (vagens e grãos podem ser zero)." }]);
      return;
    }

    const plantasHa = (plantasMetro_val / espacamentoLinhasM_val) * 10000;
    const graosHa = plantasHa * vagensPlanta_val * graosVagem_val;
    const produtividadeKgHa = (graosHa * pmgG_val) / 1000000;
    const produtividadeScHa = produtividadeKgHa / 60;

    setResults([
      { label: "Plantas por Hectare", value: plantasHa, unit: "plantas/ha" },
      { label: "Grãos por Hectare", value: graosHa, unit: "grãos/ha" },
      { label: "Produtividade Estimada", value: produtividadeKgHa, unit: "kg/ha" },
      { label: "Produtividade Estimada", value: produtividadeScHa, unit: "sc/ha (60kg)" },
    ]);
  }, [inputs]);

  const inputConfigs: InputConfig[] = [
    { name: 'plantasMetro', label: 'Nº de Plantas por Metro Linear', type: 'number', placeholder: 'Ex: 10' },
    { name: 'vagensPlanta', label: 'Nº Médio de Vagens por Planta', type: 'number', placeholder: 'Ex: 25' },
    { name: 'graosVagem', label: 'Nº Médio de Grãos por Vagem', type: 'number', placeholder: 'Ex: 2.5' },
    { name: 'espacamentoLinhasM', label: 'Espaçamento entre Linhas', type: 'number', unit: 'm', placeholder: 'Ex: 0.5' },
    { name: 'pmgG', label: 'Peso de Mil Grãos (PMG)', type: 'number', unit: 'g', placeholder: 'Ex: 180' },
  ];

  const formulaNode = (
    <>
      <p>1. <strong>Plantas/ha = (Plantas/metro / Espaçamento Linhas) * 10.000</strong></p>
      <p>2. <strong>Grãos/ha = Plantas/ha * Vagens/planta * Grãos/vagem</strong></p>
      <p>3. <strong>Produtividade (kg/ha) = (Grãos/ha * PMG<sub>g</sub>) / 1.000.000</strong></p>
      <p>4. <strong>Produtividade (sc/ha) = Produtividade (kg/ha) / 60</strong></p>
      <ul className="list-disc list-inside mt-2 text-xs">
        <li>10.000 m² = 1 hectare.</li>
        <li>PMG<sub>g</sub>: Peso de mil grãos em gramas.</li>
        <li>1.000.000: Fator de conversão (PMG para g/grão, depois g para kg).</li>
        <li>Saca de soja = 60 kg.</li>
      </ul>
    </>
  );

  const notesNode = (
    <p>Esta é uma estimativa e a produtividade real pode variar devido a diversos fatores (clima, pragas, doenças, manejo). Colete dados de vários pontos representativos da área para maior precisão.</p>
  );

  return (
    <CalculatorShell
      title="Estimativa de Produtividade da Soja"
      description="Estima a produtividade da soja (em kg/ha e sacas/ha) com base em componentes de rendimento amostrados em campo."
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

export default SoybeanYieldEst;

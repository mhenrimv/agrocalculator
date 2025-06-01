
import React, { useState, useCallback } from 'react';
import CalculatorInput from '../CalculatorInput';
import CalculatorShell from '../CalculatorShell';
import { InputConfig } from '../../types';

const CoffeeYieldEst: React.FC = () => {
  const [inputs, setInputs] = useState({
    plantasHa: '4000',          // Número de Plantas por Hectare
    litrosPlanta: '5',          // Produção Média por Planta (Litros de café cereja/coco)
    rendimentoLitrosSaca: '480', // Rendimento (Litros de café cereja/coco para 1 saca de 60kg de café beneficiado)
  });
  const [results, setResults] = useState<{ label: string; value: number | string; unit: string }[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = useCallback(() => {
    const plantasHa_val = parseFloat(inputs.plantasHa);
    const litrosPlanta_val = parseFloat(inputs.litrosPlanta);
    const rendimentoLitrosSaca_val = parseFloat(inputs.rendimentoLitrosSaca);

    if (isNaN(plantasHa_val) || isNaN(litrosPlanta_val) || isNaN(rendimentoLitrosSaca_val) ||
        plantasHa_val <= 0 || litrosPlanta_val < 0 || rendimentoLitrosSaca_val <= 0) {
      setResults([{ label: "Erro", value: "Entrada inválida.", unit: "Verifique os valores. Plantas/ha e Rendimento devem ser positivos, Litros/planta >= 0." }]);
      return;
    }

    const totalLitrosHa = plantasHa_val * litrosPlanta_val;
    const produtividadeScHa = totalLitrosHa / rendimentoLitrosSaca_val;

    setResults([
      { label: "Produção Total Estimada (Café Cereja/Coco)", value: totalLitrosHa, unit: "Litros/ha" },
      { label: "Produtividade Estimada (Café Beneficiado)", value: produtividadeScHa, unit: "sc de 60kg/ha" },
    ]);
  }, [inputs]);

  const inputConfigs: InputConfig[] = [
    { name: 'plantasHa', label: 'Nº de Plantas de Café por Hectare', type: 'number', placeholder: 'Ex: 4000' },
    { name: 'litrosPlanta', label: 'Produção Média por Planta', type: 'number', unit: 'Litros de café cereja/coco', placeholder: 'Ex: 5' },
    { name: 'rendimentoLitrosSaca', label: 'Rendimento Médio', type: 'number', unit: 'Litros de café cereja/coco por saca de 60kg beneficiado', placeholder: 'Ex: 480' },
  ];

  const formulaNode = (
    <>
      <p>1. <strong>Total Litros/ha = Nº Plantas/ha * Litros/planta</strong></p>
      <p>2. <strong>Produtividade (sc/ha) = Total Litros/ha / Rendimento (Litros/saca)</strong></p>
      <ul className="list-disc list-inside mt-2 text-xs">
        <li>Litros/planta: Refere-se ao volume de café colhido (cereja descascado, natural/coco) por planta.</li>
        <li>Rendimento: Quantos litros de café colhido (cereja/coco) são necessários para produzir uma saca de 60kg de café beneficiado (grãos verdes prontos para torra). Este valor varia muito (ex: 360-600L/saca).</li>
      </ul>
    </>
  );

  const notesNode = (
    <>
    <p>Esta é uma estimativa. A produção real depende de muitos fatores como variedade, idade das plantas, tratos culturais, clima, e colheita.</p>
    <p>Para "Produção Média por Planta", faça uma amostragem representativa na lavoura, colhendo e medindo o volume de algumas plantas.</p>
    <p>O "Rendimento" é um fator crucial e pode variar significativamente. Use um valor realista para sua região e tipo de processamento.</p>
    </>
  );

  return (
    <CalculatorShell
      title="Estimativa de Produtividade do Café"
      description="Estima a produtividade do café (em Litros/ha de café colhido e sacas de 60kg/ha de café beneficiado) com base no número de plantas, produção por planta e rendimento."
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

export default CoffeeYieldEst;

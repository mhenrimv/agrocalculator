
import React, { useState, useCallback } from 'react';
import CalculatorInput from '../CalculatorInput';
import CalculatorShell from '../CalculatorShell';
import { InputConfig } from '../../types';

const SeedQuantityKgHa: React.FC = () => {
  const [inputs, setInputs] = useState({
    populacaoRecomendada: '320000', // População recomendada (plantas/hectare)
    germinacaoPercent: '85',    // Percentual de germinação (%)
    pmsG: '200',                // Peso de Mil Sementes (gramas)
    totalHectares: '1',         // Opcional: total de hectares para plantio
  });
  const [results, setResults] = useState<{ label: string; value: number | string; unit: string }[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = useCallback(() => {
    const populacaoRecomendada_val = parseFloat(inputs.populacaoRecomendada);
    const germinacaoPercent_val = parseFloat(inputs.germinacaoPercent);
    const pmsG_val = parseFloat(inputs.pmsG);
    const totalHectares_val = parseFloat(inputs.totalHectares);

    if (isNaN(populacaoRecomendada_val) || isNaN(germinacaoPercent_val) || isNaN(pmsG_val) || populacaoRecomendada_val <=0 || germinacaoPercent_val <= 0 || germinacaoPercent_val > 100 || pmsG_val <= 0) {
      setResults([{ label: "Erro", value: "Entrada inválida", unit: "Verifique os valores" }]);
      return;
    }

    const plantasHaAjustado = populacaoRecomendada_val / (germinacaoPercent_val / 100);
    const pmsKgPer1000Seeds = pmsG_val / 1000;
    const kgSementesHa = (plantasHaAjustado / 1000) * pmsKgPer1000Seeds;

    const currentResults = [
      { label: "População de Plantas Ajustada", value: plantasHaAjustado, unit: "plantas/ha" },
      { label: "Quantidade de Sementes", value: kgSementesHa, unit: "kg/ha" },
    ];

    if (!isNaN(totalHectares_val) && totalHectares_val > 0) {
      const totalKgSementes = kgSementesHa * totalHectares_val;
      currentResults.push({ label: `Total de Sementes para ${totalHectares_val.toLocaleString('pt-BR')} ha`, value: totalKgSementes, unit: "kg" });
    }
    
    setResults(currentResults);

  }, [inputs]);

  const inputConfigs: InputConfig[] = [
    { name: 'populacaoRecomendada', label: 'População Recomendada de Plantas', type: 'number', unit: 'plantas/ha', placeholder: 'Ex: 320.000' },
    { name: 'germinacaoPercent', label: 'Taxa de Germinação das Sementes', type: 'number', unit: '%', placeholder: 'Ex: 85 (informado na embalagem)' },
    { name: 'pmsG', label: 'Peso de Mil Sementes (PMS)', type: 'number', unit: 'gramas', placeholder: 'Ex: 200 (informado na embalagem)' },
    { name: 'totalHectares', label: 'Total de Hectares para Plantio (Opcional)', type: 'number', unit: 'ha', placeholder: 'Ex: 100' },
  ];
  
  const formulaNode = (
    <>
      <p>1. <strong>População Ajustada (plantas/ha) = População Recomendada / (Germinação % / 100)</strong></p>
      <p>2. <strong>Quantidade de Sementes (kg/ha) = (População Ajustada / 1000) * (PMS_gramas / 1000)</strong></p>
      <ul className="list-disc list-inside mt-2 text-xs">
        <li>PMS_gramas: Peso de 1000 sementes em gramas.</li>
        <li>(PMS_gramas / 1000): Converte PMS para kg por 1000 sementes.</li>
      </ul>
    </>
  );
   const notesNode = (
    <p>A "População de Plantas Ajustada" considera a taxa de germinação para estimar quantas sementes viáveis são necessárias. O campo "Total de Hectares" é opcional e, se preenchido, calculará a quantidade total de sementes para a área informada.</p>
  );


  return (
    <CalculatorShell 
        title="Quantidade de Sementes (kg/ha)" 
        description="Calcula a quantidade de sementes (em kg/ha) necessária com base na população de plantas desejada, taxa de germinação e peso de mil sementes (PMS)." 
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

export default SeedQuantityKgHa;

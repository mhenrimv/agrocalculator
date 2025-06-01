
import React, { useState, useCallback } from 'react';
import CalculatorInput from '../CalculatorInput';
import CalculatorShell from '../CalculatorShell';
import { InputConfig } from '../../types';

const SeederRegulationPlants: React.FC = () => {
  const [inputs, setInputs] = useState({
    populacaoDesejadaHa: '300000', // População de plantas desejada (plantas/hectare)
    espacamentoLinhasM: '0.5',    // Espaçamento entre linhas (metros)
    poderGerminativo: '90',      // Poder germinativo das sementes (%)
  });
  const [results, setResults] = useState<{ label: string; value: number | string; unit: string }[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = useCallback(() => {
    const populacaoDesejadaHa_val = parseFloat(inputs.populacaoDesejadaHa);
    const espacamentoLinhasM_val = parseFloat(inputs.espacamentoLinhasM);
    const poderGerminativo_val = parseFloat(inputs.poderGerminativo);

    if (isNaN(populacaoDesejadaHa_val) || isNaN(espacamentoLinhasM_val) || isNaN(poderGerminativo_val) || populacaoDesejadaHa_val <= 0 || espacamentoLinhasM_val <= 0 || poderGerminativo_val <= 0 || poderGerminativo_val > 100) {
      setResults([{ label: "Erro", value: "Entradas inválidas.", unit: "Verifique os valores. Todos devem ser positivos e Germinação <= 100%." }]);
      return;
    }

    const metrosLinearesPorHa = 10000 / espacamentoLinhasM_val;
    const plantasPorMetroLinearDesejadas = populacaoDesejadaHa_val / metrosLinearesPorHa;
    const sementesPorMetroLinear = plantasPorMetroLinearDesejadas / (poderGerminativo_val / 100);

    setResults([
      { label: "Metros Lineares de Sulco por Hectare", value: metrosLinearesPorHa, unit: "m/ha" },
      { label: "Plantas Alvo por Metro Linear", value: plantasPorMetroLinearDesejadas, unit: "plantas/m" },
      { label: "Sementes a Distribuir por Metro Linear", value: sementesPorMetroLinear, unit: "sementes/m" },
    ]);
  }, [inputs]);

  const inputConfigs: InputConfig[] = [
    { name: 'populacaoDesejadaHa', label: 'População de Plantas Desejada', type: 'number', unit: 'plantas/ha', placeholder: 'Ex: 300.000 (Soja)' },
    { name: 'espacamentoLinhasM', label: 'Espaçamento entre Linhas', type: 'number', unit: 'metros', placeholder: 'Ex: 0.5 (Soja)' },
    { name: 'poderGerminativo', label: 'Poder Germinativo das Sementes (Viabilidade)', type: 'number', unit: '%', placeholder: 'Ex: 90 (informado na embalagem)' },
  ];

  const formulaNode = (
    <>
      <p>1. <strong>Metros Lineares/ha = 10.000 / Espaçamento entre Linhas (m)</strong></p>
      <p>2. <strong>Plantas Alvo/m = População Desejada (plantas/ha) / Metros Lineares/ha</strong></p>
      <p>3. <strong>Sementes/m = Plantas Alvo/m / (Poder Germinativo % / 100)</strong></p>
      <ul className="list-disc list-inside mt-2 text-xs">
        <li>10.000 m² = 1 hectare.</li>
        <li>Poder Germinativo: Percentual de sementes que se espera germinar.</li>
      </ul>
    </>
  );

  const notesNode = (
    <>
      <p>Esta calculadora ajuda a determinar quantas sementes sua semeadora deve distribuir por metro linear para atingir a população de plantas desejada.</p>
      <p>Use o valor de "Sementes a Distribuir por Metro Linear" para calibrar sua semeadora, verificando a quantidade de sementes coletadas em uma distância conhecida.</p>
      <p>Fatores como perdas de emergência em campo não são considerados aqui, podendo exigir um pequeno ajuste adicional na prática (aumento da quantidade de sementes).</p>
    </>
  );

  return (
    <CalculatorShell
      title="Regulagem de Semeadora (Sementes por Metro Linear)"
      description="Calcula o número de sementes a serem distribuídas por metro linear para atingir a população de plantas desejada, considerando o espaçamento e a germinação."
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

export default SeederRegulationPlants;

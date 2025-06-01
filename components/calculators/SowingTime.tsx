
import React, { useState, useCallback } from 'react';
import CalculatorInput from '../CalculatorInput';
import CalculatorShell from '../CalculatorShell';
import { InputConfig } from '../../types';

const SowingTime: React.FC = () => {
  const [inputs, setInputs] = useState({
    areaTotalHa: '100',               // Área Total a Semear (ha)
    larguraSemeadoraM: '9',           // Largura Útil da Semeadora (m)
    velocidadeSemeaduraKmH: '6',      // Velocidade Média de Semeadura (Km/h)
    eficienciaOperacionalPercent: '75', // Eficiência Operacional (%)
  });
  const [results, setResults] = useState<{ label: string; value: number | string; unit: string }[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = useCallback(() => {
    const areaTotalHa_val = parseFloat(inputs.areaTotalHa);
    const larguraSemeadoraM_val = parseFloat(inputs.larguraSemeadoraM);
    const velocidadeSemeaduraKmH_val = parseFloat(inputs.velocidadeSemeaduraKmH);
    const eficienciaOperacionalPercent_val = parseFloat(inputs.eficienciaOperacionalPercent);

    if (isNaN(areaTotalHa_val) || isNaN(larguraSemeadoraM_val) || isNaN(velocidadeSemeaduraKmH_val) || isNaN(eficienciaOperacionalPercent_val) ||
        areaTotalHa_val <= 0 || larguraSemeadoraM_val <= 0 || velocidadeSemeaduraKmH_val <= 0 ||
        eficienciaOperacionalPercent_val <= 0 || eficienciaOperacionalPercent_val > 100) {
      setResults([{ label: "Erro", value: "Entrada inválida.", unit: "Verifique os valores. Todos devem ser positivos, Eficiência entre 0-100%." }]);
      return;
    }

    const capCampoTeoricaHaH = (larguraSemeadoraM_val * velocidadeSemeaduraKmH_val) / 10;
    const capCampoEfetivaHaH = capCampoTeoricaHaH * (eficienciaOperacionalPercent_val / 100);
    const tempoTotalSemeaduraH = areaTotalHa_val / capCampoEfetivaHaH;
    const tempoTotalSemeaduraDias = tempoTotalSemeaduraH / 8; 
    const tempoTotalSemeaduraDias10h = tempoTotalSemeaduraH / 10;


    setResults([
      { label: "Capacidade de Campo Teórica", value: capCampoTeoricaHaH, unit: "ha/h" },
      { label: "Capacidade de Campo Efetiva", value: capCampoEfetivaHaH, unit: "ha/h" },
      { label: "Tempo Total de Semeadura", value: tempoTotalSemeaduraH, unit: "horas" },
      { label: "Tempo Total de Semeadura (jornada 8h/dia)", value: tempoTotalSemeaduraDias, unit: "dias" },
      { label: "Tempo Total de Semeadura (jornada 10h/dia)", value: tempoTotalSemeaduraDias10h, unit: "dias" },
    ]);
  }, [inputs]);

  const inputConfigs: InputConfig[] = [
    { name: 'areaTotalHa', label: 'Área Total a Semear', type: 'number', unit: 'ha', placeholder: 'Ex: 100' },
    { name: 'larguraSemeadoraM', label: 'Largura Útil da Semeadora', type: 'number', unit: 'm', placeholder: 'Ex: 9' },
    { name: 'velocidadeSemeaduraKmH', label: 'Velocidade Média de Semeadura', type: 'number', unit: 'Km/h', placeholder: 'Ex: 6' },
    { name: 'eficienciaOperacionalPercent', label: 'Eficiência Operacional', type: 'number', unit: '%', placeholder: 'Ex: 75 (considera paradas, manobras, etc.)' },
  ];

  const formulaNode = (
    <>
      <p>1. <strong>Cap. Campo Teórica (ha/h) = (Largura Semeadora (m) * Velocidade (Km/h)) / 10</strong></p>
      <p>2. <strong>Cap. Campo Efetiva (ha/h) = Cap. Teórica * (Eficiência % / 100)</strong></p>
      <p>3. <strong>Tempo Total (horas) = Área Total (ha) / Cap. Efetiva (ha/h)</strong></p>
      <ul className="list-disc list-inside mt-2 text-xs">
        <li>O fator 10 na fórmula 1 converte m*Km/h para ha/h.</li>
        <li>Eficiência Operacional: considera o tempo perdido com reabastecimentos, manobras, regulagens, etc. Varia tipicamente de 65% a 85%.</li>
      </ul>
    </>
  );

  const notesNode = (
    <p>Este cálculo ajuda no planejamento da semeadura, estimando o tempo necessário para completar a operação. Os resultados em "dias" consideram jornadas de 8 ou 10 horas de trabalho efetivo por dia.</p>
  );

  return (
    <CalculatorShell
      title="Cálculo do Tempo de Semeadura"
      description="Estima o tempo total necessário para semear uma determinada área, considerando as características da semeadora, velocidade e eficiência operacional."
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

export default SowingTime;

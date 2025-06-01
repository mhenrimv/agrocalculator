
import React, { useState, useCallback } from 'react';
import CalculatorInput from '../CalculatorInput';
import CalculatorShell from '../CalculatorShell';
import { InputConfig } from '../../types';

const BackpackSprayerRegulation: React.FC = () => {
  const [inputs, setInputs] = useState({
    volumeColetadoMl: '500', // Volume Coletado do Bico (mL)
    tempoColetaS: '30',      // Tempo de Coleta (segundos)
    larguraFaixaPulvM: '0.5',// Largura da Faixa Pulverizada (m)
    distPercorridaCalibM: '10',// Distância percorrida para calibrar velocidade (m)
    tempoPercorrerDistS: '15', // Tempo para percorrer a distância (s)
  });
  const [results, setResults] = useState<{ label: string; value: number | string; unit: string }[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = useCallback(() => {
    const volumeColetadoMl_val = parseFloat(inputs.volumeColetadoMl);
    const tempoColetaS_val = parseFloat(inputs.tempoColetaS);
    const larguraFaixaPulvM_val = parseFloat(inputs.larguraFaixaPulvM);
    const distPercorridaCalibM_val = parseFloat(inputs.distPercorridaCalibM);
    const tempoPercorrerDistS_val = parseFloat(inputs.tempoPercorrerDistS);

    if (isNaN(volumeColetadoMl_val) || isNaN(tempoColetaS_val) || isNaN(larguraFaixaPulvM_val) ||
        isNaN(distPercorridaCalibM_val) || isNaN(tempoPercorrerDistS_val) ||
        volumeColetadoMl_val < 0 || tempoColetaS_val <= 0 || larguraFaixaPulvM_val <= 0 ||
        distPercorridaCalibM_val <= 0 || tempoPercorrerDistS_val <= 0) {
      setResults([{ label: "Erro", value: "Entrada inválida.", unit: "Todos os valores devem ser positivos, volume coletado >= 0." }]);
      return;
    }

    // 1. Vazão do Bico (L/min)
    const vazaoBicoLMin = (volumeColetadoMl_val / tempoColetaS_val) * (60 / 1000);
    // 2. Velocidade de Deslocamento (m/s)
    const velocidadeMs = distPercorridaCalibM_val / tempoPercorrerDistS_val;
    // 3. Volume de Aplicação (L/ha)
    // L/ha = (Vazão Bico L/min * 600) / (Velocidade Km/h * Largura Faixa m)
    // Velocidade Km/h = velocidadeMs * 3.6
    // L/ha = (vazaoBicoLMin * 600) / ( (velocidadeMs * 3.6) * larguraFaixaPulvM_val )
    // Simplificando: L/ha = (vazaoBicoLMin * 10000) / (velocidadeMs * 60 * larguraFaixaPulvM_val)
    // Ou a fórmula direta: L/ha = (Volume Coletado_mL / (Tempo Coleta_s * Largura Faixa_m * Velocidade_m/s)) * 10
    const volumeAplicacaoLHa = (volumeColetadoMl_val / (tempoColetaS_val * larguraFaixaPulvM_val * velocidadeMs)) * 10;


    setResults([
      { label: "Velocidade de Deslocamento", value: velocidadeMs * 3.6, unit: "Km/h" },
      { label: "Velocidade de Deslocamento", value: velocidadeMs, unit: "m/s" },
      { label: "Vazão do Bico", value: vazaoBicoLMin, unit: "L/min" },
      { label: "Volume de Aplicação Estimado", value: volumeAplicacaoLHa, unit: "L/ha" },
    ]);
  }, [inputs]);

  const inputConfigs: InputConfig[] = [
    { name: 'volumeColetadoMl', label: 'Volume Coletado do Bico', type: 'number', unit: 'mL', placeholder: 'Ex: 500' },
    { name: 'tempoColetaS', label: 'Tempo de Coleta da Vazão do Bico', type: 'number', unit: 's', placeholder: 'Ex: 30' },
    { name: 'larguraFaixaPulvM', label: 'Largura da Faixa Pulverizada (por bico)', type: 'number', unit: 'm', placeholder: 'Ex: 0.5' },
    { name: 'distPercorridaCalibM', label: 'Distância Percorrida (Calibração Velocidade)', type: 'number', unit: 'm', placeholder: 'Ex: 10' },
    { name: 'tempoPercorrerDistS', label: 'Tempo para Percorrer Distância (Calibração Velocidade)', type: 'number', unit: 's', placeholder: 'Ex: 15' },
  ];

  const formulaNode = (
    <>
      <p>1. <strong>Vazão do Bico (L/min) = (Volume Coletado (mL) / Tempo de Coleta (s)) * (60 / 1000)</strong></p>
      <p>2. <strong>Velocidade (m/s) = Distância Percorrida (m) / Tempo para Percorrer (s)</strong></p>
      <p>3. <strong>Volume de Aplicação (L/ha) = (Volume Coletado<sub>mL</sub> / (Tempo Coleta<sub>s</sub> * Largura Faixa<sub>m</sub> * Velocidade<sub>m/s</sub>)) * 10</strong></p>
      <p className="text-xs mt-1">Alternativamente, L/ha = (Vazão Bico<sub>L/min</sub> * 600) / (Velocidade<sub>Km/h</sub> * Largura Faixa<sub>m</sub>)</p>
       <ul className="list-disc list-inside mt-2 text-xs">
        <li>Velocidade (Km/h) = Velocidade (m/s) * 3.6.</li>
        <li>O fator 10 na fórmula 3 é de conversões de unidade (mL para L, m² para ha).</li>
      </ul>
    </>
  );

  const notesNode = (
    <>
    <p>Este cálculo é essencial para garantir a aplicação correta de defensivos com pulverizadores costais.</p>
    <p>Para calibrar a velocidade: caminhe em ritmo normal de trabalho e cronometre o tempo para cobrir uma distância conhecida (ex: 10 ou 20 metros).</p>
    <p>Para a vazão do bico: com o pulverizador pressurizado, acione o gatilho e colete a água de um bico em um recipiente graduado por um tempo determinado (ex: 30 segundos).</p>
    <p>Mantenha pressão constante durante a coleta da vazão e a aplicação.</p>
    </>
  );

  return (
    <CalculatorShell
      title="Regulagem de Pulverizador Costal"
      description="Calcula a vazão do bico e o volume de aplicação por hectare para pulverizadores costais, ajudando na calibração."
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

export default BackpackSprayerRegulation;

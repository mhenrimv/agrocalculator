
import React, { useState, useCallback } from 'react';
import CalculatorInput from '../CalculatorInput';
import CalculatorShell from '../CalculatorShell';
import { InputConfig } from '../../types';

const FertilizerSpreaderCalibration: React.FC = () => {
  const [inputs, setInputs] = useState({
    qtdColetadaKg: '10',         // Quantidade Coletada (kg)
    distanciaPercorridaM: '50', // Distância Percorrida (m)
    larguraFaixaM: '12',        // Largura da Faixa de Aplicação (m)
  });
  const [results, setResults] = useState<{ label: string; value: number | string; unit: string }[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = useCallback(() => {
    const qtdColetadaKg_val = parseFloat(inputs.qtdColetadaKg);
    const distanciaPercorridaM_val = parseFloat(inputs.distanciaPercorridaM);
    const larguraFaixaM_val = parseFloat(inputs.larguraFaixaM);

    if (isNaN(qtdColetadaKg_val) || isNaN(distanciaPercorridaM_val) || isNaN(larguraFaixaM_val) ||
        qtdColetadaKg_val < 0 || distanciaPercorridaM_val <= 0 || larguraFaixaM_val <= 0) {
      setResults([{ label: "Erro", value: "Entrada inválida.", unit: "Verifique os valores. Distância e Largura devem ser positivos, Qtd Coletada >= 0." }]);
      return;
    }

    const areaCobertaM2 = distanciaPercorridaM_val * larguraFaixaM_val;
    const aplicacaoKgHa = (qtdColetadaKg_val / areaCobertaM2) * 10000;

    setResults([
      { label: "Área Coberta na Amostra", value: areaCobertaM2, unit: "m²" },
      { label: "Taxa de Aplicação Estimada", value: aplicacaoKgHa, unit: "kg/ha" },
    ]);
  }, [inputs]);

  const inputConfigs: InputConfig[] = [
    { name: 'qtdColetadaKg', label: 'Quantidade de Fertilizante Coletada', type: 'number', unit: 'kg', placeholder: 'Ex: 10' },
    { name: 'distanciaPercorridaM', label: 'Distância Percorrida Durante a Coleta', type: 'number', unit: 'm', placeholder: 'Ex: 50' },
    { name: 'larguraFaixaM', label: 'Largura Efetiva da Faixa de Aplicação', type: 'number', unit: 'm', placeholder: 'Ex: 12' },
  ];

  const formulaNode = (
    <>
      <p>1. <strong>Área Coberta (m²) = Distância Percorrida (m) * Largura da Faixa (m)</strong></p>
      <p>2. <strong>Taxa de Aplicação (kg/ha) = (Quantidade Coletada (kg) / Área Coberta (m²)) * 10.000</strong></p>
      <ul className="list-disc list-inside mt-2 text-xs">
        <li>10.000 m² = 1 hectare.</li>
      </ul>
    </>
  );

  const notesNode = (
    <>
    <p>Este método é comum para calibrar distribuidores de fertilizantes a lanço ou em linha.</p>
    <p>Para a coleta: pode-se colocar lonas sob a faixa de aplicação ou coletar o produto de um dosador por um tempo/distância definidos.</p>
    <p>A "Largura Efetiva da Faixa de Aplicação" é crucial e deve ser determinada corretamente para distribuidores a lanço (pode ser diferente da largura total de alcance).</p>
    <p>Ajuste as configurações do distribuidor e repita o teste até atingir a taxa de aplicação desejada.</p>
    </>
  );

  return (
    <CalculatorShell
      title="Calibração de Distribuidor de Fertilizantes"
      description="Calcula a taxa de aplicação de fertilizantes (em kg/ha) com base na quantidade coletada em uma determinada distância e largura de faixa."
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

export default FertilizerSpreaderCalibration;

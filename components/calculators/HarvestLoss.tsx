
import React, { useState, useCallback } from 'react';
import CalculatorInput from '../CalculatorInput';
import CalculatorShell from '../CalculatorShell';
import { InputConfig } from '../../types';

const HarvestLoss: React.FC = () => {
  const [inputs, setInputs] = useState({
    graosPerdidosAmostra: '20', // Grãos perdidos na área de amostragem
    areaAmostragemM2: '2',     // Área de Amostragem (m²)
    pmgG: '180',               // Peso de Mil Grãos (PMG) (g)
  });
  const [results, setResults] = useState<{ label: string; value: number | string; unit: string }[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = useCallback(() => {
    const graosPerdidosAmostra_val = parseFloat(inputs.graosPerdidosAmostra);
    const areaAmostragemM2_val = parseFloat(inputs.areaAmostragemM2);
    const pmgG_val = parseFloat(inputs.pmgG);

    if (isNaN(graosPerdidosAmostra_val) || isNaN(areaAmostragemM2_val) || isNaN(pmgG_val) ||
        graosPerdidosAmostra_val < 0 || areaAmostragemM2_val <= 0 || pmgG_val <= 0) {
      setResults([{ label: "Erro", value: "Entrada inválida.", unit: "Verifique os valores. Área e PMG devem ser positivos, grãos >= 0." }]);
      return;
    }

    // 1. Grãos perdidos por m²
    const graosPerdidosM2 = graosPerdidosAmostra_val / areaAmostragemM2_val;
    // 2. Perda em kg/ha
    // Perda (kg/ha) = (Grãos Perdidos/m² * PMG_g / 1000_g_por_kg_PMG) * 10000_m2_por_ha / 1000_g_por_kg_total
    // Simplificado: (graosPerdidosM2 * pmgG_val * 10000) / 1000000
    const perdaKgHa = (graosPerdidosM2 * pmgG_val) / 100;
    // 3. Perda em sacas/ha (considerando saca de 60kg)
    const perdaScHa = perdaKgHa / 60;

    setResults([
      { label: "Grãos Perdidos por m²", value: graosPerdidosM2, unit: "grãos/m²" },
      { label: "Perda na Colheita", value: perdaKgHa, unit: "kg/ha" },
      { label: "Perda na Colheita", value: perdaScHa, unit: "sc/ha (60kg)" },
    ]);
  }, [inputs]);

  const inputConfigs: InputConfig[] = [
    { name: 'graosPerdidosAmostra', label: 'Nº de Grãos Perdidos na Amostra', type: 'number', placeholder: 'Ex: 20' },
    { name: 'areaAmostragemM2', label: 'Área da Amostra', type: 'number', unit: 'm²', placeholder: 'Ex: 2 (armação de 1m x 2m)' },
    { name: 'pmgG', label: 'Peso de Mil Grãos (PMG)', type: 'number', unit: 'g', placeholder: 'Ex: 180 (para soja)' },
  ];

  const formulaNode = (
    <>
      <p>1. <strong>Grãos Perdidos/m² = Nº Grãos Perdidos na Amostra / Área da Amostra (m²)</strong></p>
      <p>2. <strong>Perda (kg/ha) = (Grãos Perdidos/m² * PMG<sub>g</sub>) / 100</strong></p>
      <p>3. <strong>Perda (sc/ha) = Perda (kg/ha) / 60</strong></p>
      <ul className="list-disc list-inside mt-2 text-xs">
        <li>PMG<sub>g</sub>: Peso de mil grãos em gramas.</li>
        <li>O fator 100 na fórmula 2 resulta da conversão de (grãos/m² * g/1000grãos * 10000m²/ha) / 1000g/kg.</li>
        <li>Saca padrão (ex: soja) = 60 kg. Ajuste se necessário para outras culturas.</li>
      </ul>
    </>
  );

  const notesNode = (
    <>
    <p>Utilize uma armação de área conhecida (ex: 1m x 1m, 2m x 0.5m) para coletar os grãos perdidos no solo após a passagem da colhedora.</p>
    <p>Realize múltiplas amostragens em diferentes pontos da lavoura para obter uma média representativa.</p>
    <p>Níveis de perdas aceitáveis variam, mas geralmente busca-se menos de 1 saca/ha para soja.</p>
    </>
  );

  return (
    <CalculatorShell
      title="Cálculo de Perdas na Colheita"
      description="Estima as perdas de grãos durante a colheita (em kg/ha e sacas/ha) com base na contagem de grãos em uma área de amostragem."
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

export default HarvestLoss;

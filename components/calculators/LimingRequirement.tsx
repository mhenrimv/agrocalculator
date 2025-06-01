
import React, { useState, useCallback } from 'react';
import CalculatorInput from '../CalculatorInput';
import CalculatorShell from '../CalculatorShell';
import { InputConfig, CalculationResult } from '../../types';

type LimingCalculationMethod = 'baseSaturation' | 'cecPercentage';

const LimingRequirement: React.FC = () => {
  const [calculationMethod, setCalculationMethod] = useState<LimingCalculationMethod>('baseSaturation');
  const [inputs, setInputs] = useState({
    // Base Saturation Method
    VE: '70', // Saturação por bases desejada (%)
    V: '50',  // Saturação por bases atual (%)
    T: '7',   // CTC a pH 7,0 (cmolc/dm³)
    PRNT: '80', // Poder Relativo de Neutralização Total (%) - Common
    Profundidade: '20', // Profundidade (cm)
    AreaPercent: '100', // Área (%)
    // CEC Percentage Method
    currentCa: '2.0', // cmolc/dm³
    currentMg: '0.5', // cmolc/dm³
    soilCEC: '8.0',   // cmolc/dm³
    targetCaCEC: '60', // %
    targetMgCEC: '15', // %
    limeCaO: '30',    // %
    limeMgO: '10',    // %
  });
  const [results, setResults] = useState<CalculationResult[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCalculationMethod(e.target.value as LimingCalculationMethod);
    setResults([]); // Clear results when method changes
  };

  const inputConfigsBaseSaturation: InputConfig[] = [
    { name: 'VE', label: 'Saturação por Bases Desejada (VE)', type: 'number', unit: '%', placeholder: 'Ex: 70', defaultValue: '70' },
    { name: 'V', label: 'Saturação por Bases Atual do Solo (V)', type: 'number', unit: '%', placeholder: 'Ex: 50', defaultValue: '50' },
    { name: 'T', label: 'CTC a pH 7,0 (T)', type: 'number', unit: 'cmolc/dm³', placeholder: 'Ex: 7', defaultValue: '7' },
    { name: 'PRNT', label: 'Poder Relativo de Neutralização Total (PRNT)', type: 'number', unit: '%', placeholder: 'Ex: 80', defaultValue: '80' },
    { name: 'Profundidade', label: 'Profundidade de Incorporação', type: 'number', unit: 'cm', placeholder: 'Ex: 20 (0-20cm)', defaultValue: '20' },
    { name: 'AreaPercent', label: 'Porcentagem da Área de Aplicação', type: 'number', unit: '%', placeholder: 'Ex: 100 (para área total)', defaultValue: '100' },
  ];

  const inputConfigsCecPercentage: InputConfig[] = [
    { name: 'currentCa', label: 'Cálcio Atual no Solo (Ca²⁺)', type: 'number', unit: 'cmolc/dm³', placeholder: 'Ex: 2.0', defaultValue: '2.0' },
    { name: 'currentMg', label: 'Magnésio Atual no Solo (Mg²⁺)', type: 'number', unit: 'cmolc/dm³', placeholder: 'Ex: 0.5', defaultValue: '0.5' },
    { name: 'soilCEC', label: 'CTC do Solo a pH 7,0', type: 'number', unit: 'cmolc/dm³', placeholder: 'Ex: 8.0', defaultValue: '8.0' },
    { name: 'targetCaCEC', label: 'Meta de Participação do Ca²⁺ na CTC', type: 'number', unit: '%', placeholder: 'Ex: 60', defaultValue: '60' },
    { name: 'targetMgCEC', label: 'Meta de Participação do Mg²⁺ na CTC', type: 'number', unit: '%', placeholder: 'Ex: 15', defaultValue: '15' },
    { name: 'limeCaO', label: 'Teor de Óxido de Cálcio (CaO) no Calcário', type: 'number', unit: '%', placeholder: 'Ex: 30', defaultValue: '30' },
    { name: 'limeMgO', label: 'Teor de Óxido de Magnésio (MgO) no Calcário', type: 'number', unit: '%', placeholder: 'Ex: 10', defaultValue: '10' },
    { name: 'PRNT', label: 'Poder Relativo de Neutralização Total (PRNT) do Calcário', type: 'number', unit: '%', placeholder: 'Ex: 80', defaultValue: '80' },
  ];

  const selectedInputConfigs = calculationMethod === 'baseSaturation' ? inputConfigsBaseSaturation : inputConfigsCecPercentage;

  const calculateByBaseSaturation = useCallback(() => {
    const VE_val = parseFloat(inputs.VE);
    const V_val = parseFloat(inputs.V);
    const T_val = parseFloat(inputs.T);
    const PRNT_val = parseFloat(inputs.PRNT);
    const Profundidade_val = parseFloat(inputs.Profundidade);
    const AreaPercent_val = parseFloat(inputs.AreaPercent);

    if (isNaN(VE_val) || isNaN(V_val) || isNaN(T_val) || isNaN(PRNT_val) || isNaN(Profundidade_val) || isNaN(AreaPercent_val)) {
      setResults([{ label: "Erro", value: "Todas as entradas devem ser números válidos.", unit: "" }]);
      return;
    }
    if (PRNT_val === 0 || T_val === 0) {
      setResults([{ label: "Erro", value: "PRNT e T não podem ser zero.", unit: "" }]);
      return;
    }
     if (V_val < 0 || VE_val < 0 || VE_val > 100 || T_val < 0 || PRNT_val < 0 || PRNT_val > 200 /* Allow higher PRNT */ || Profundidade_val < 0 || AreaPercent_val < 0 || AreaPercent_val > 100) {
      setResults([{ label: "Erro", value: "Valores de entrada fora do intervalo permitido.", unit: "" }]);
      return;
    }

    if (V_val >= VE_val) {
      setResults([
        { label: "Necessidade de Calcário (NC)", value: 0, unit: "t/ha" },
        { label: "Calagem Corrigida (Qta)", value: 0, unit: "t/ha" },
        { label: "Info", value: "A saturação por bases atual (V%) já é igual ou superior à desejada (VE%). Não é necessário aplicar calcário.", unit: ""}
      ]);
      return;
    }

    const NC = (VE_val - V_val) * T_val / 100; // t/ha
    const Qta = NC * (100 / PRNT_val) * (Profundidade_val / 20) * (AreaPercent_val / 100); // t/ha

    setResults([
      { label: "Necessidade de Calcário (NC)", value: NC, unit: "t/ha" },
      { label: "Calagem Corrigida (Qta)", value: Qta, unit: "t/ha" },
    ]);
  }, [inputs]);

  const calculateByCecPercentage = useCallback(() => {
    const { currentCa, currentMg, soilCEC, targetCaCEC, targetMgCEC, limeCaO, limeMgO, PRNT: PRNT_input } = inputs;
    const currentCa_val = parseFloat(currentCa);
    const currentMg_val = parseFloat(currentMg);
    const soilCEC_val = parseFloat(soilCEC);
    const targetCaCEC_val = parseFloat(targetCaCEC);
    const targetMgCEC_val = parseFloat(targetMgCEC);
    const limeCaO_val = parseFloat(limeCaO);
    const limeMgO_val = parseFloat(limeMgO);
    const PRNT_val = parseFloat(PRNT_input);

    if (isNaN(currentCa_val) || isNaN(currentMg_val) || isNaN(soilCEC_val) || isNaN(targetCaCEC_val) ||
        isNaN(targetMgCEC_val) || isNaN(limeCaO_val) || isNaN(limeMgO_val) || isNaN(PRNT_val)) {
      setResults([{ label: "Erro", value: "Todas as entradas devem ser números válidos.", unit: "" }]);
      return;
    }

    if (currentCa_val < 0 || currentMg_val < 0 || soilCEC_val <= 0 ||
        targetCaCEC_val < 0 || targetCaCEC_val > 100 || targetMgCEC_val < 0 || targetMgCEC_val > 100 ||
        limeCaO_val < 0 || limeCaO_val > 100 || limeMgO_val < 0 || limeMgO_val > 100 ||
        PRNT_val <= 0 || PRNT_val > 200 /* Allow higher PRNT */ ) {
      setResults([{ label: "Erro", value: "Valores de entrada fora do intervalo permitido.", unit: "Verifique os percentuais e valores." }]);
      return;
    }
    
    // Step 1: Calculate the required Ca²⁺ and Mg²⁺ in cmolc/dm³ to reach the CEC targets.
    const Ca_required_ctc = (targetCaCEC_val / 100) * soilCEC_val;
    const Mg_required_ctc = (targetMgCEC_val / 100) * soilCEC_val;

    // Step 2: Calculate the Ca²⁺ and Mg²⁺ deficits in cmolc/dm³.
    const Ca_deficit_cmolc = Math.max(0, Ca_required_ctc - currentCa_val);
    const Mg_deficit_cmolc = Math.max(0, Mg_required_ctc - currentMg_val);

    if (Ca_deficit_cmolc === 0 && Mg_deficit_cmolc === 0) {
        setResults([
            { label: "Necessidade de Calcário Final", value: 0, unit: "t/ha" },
            { label: "Info", value: "Os níveis de Ca²⁺ e Mg²⁺ no solo já atingem ou excedem as metas de participação na CTC.", unit: ""}
        ]);
        return;
    }

    // Step 3: Convert Ca²⁺ and Mg²⁺ deficits to kg/ha.
    const Ca_deficit_kg_ha = Ca_deficit_cmolc * 400; // Factor 400 = 200 (cmolc to mg Ca) * 2 (mg/dm³ to kg/ha for 0-20cm)
    const Mg_deficit_kg_ha = Mg_deficit_cmolc * 240; // Factor 240 = 120 (cmolc to mg Mg) * 2 (mg/dm³ to kg/ha for 0-20cm)

    // Step 4: Calculate the elemental Ca and Mg content in the lime (kg per ton of lime).
    const Elemental_Ca_in_lime_kg_t = (limeCaO_val / 100) * 1000 * 0.7143; // Factor 0.7143 for CaO to Ca
    const Elemental_Mg_in_lime_kg_t = (limeMgO_val / 100) * 1000 * 0.603;  // Factor 0.603 for MgO to Mg

    // Step 5: Calculate the lime requirement (t/ha) to supply Ca and Mg separately.
    let Lime_for_Ca_t_ha = 0;
    if (Ca_deficit_kg_ha > 0) {
        if (Elemental_Ca_in_lime_kg_t <= 0) {
            setResults([{ label: "Erro", value: `Déficit de ${Ca_deficit_kg_ha.toFixed(2)} kg/ha de Ca²⁺, mas o calcário não fornece Ca (Teor CaO = 0%).`, unit: "" }]);
            return;
        }
        Lime_for_Ca_t_ha = Ca_deficit_kg_ha / Elemental_Ca_in_lime_kg_t;
    }

    let Lime_for_Mg_t_ha = 0;
    if (Mg_deficit_kg_ha > 0) {
        if (Elemental_Mg_in_lime_kg_t <= 0) {
            setResults([{ label: "Erro", value: `Déficit de ${Mg_deficit_kg_ha.toFixed(2)} kg/ha de Mg²⁺, mas o calcário não fornece Mg (Teor MgO = 0%).`, unit: "" }]);
            return;
        }
        Lime_for_Mg_t_ha = Mg_deficit_kg_ha / Elemental_Mg_in_lime_kg_t;
    }
    
    // Step 6: Define the base lime dose (t/ha).
    const Base_lime_dose_t_ha = Math.max(Lime_for_Ca_t_ha, Lime_for_Mg_t_ha);

    // Step 7: Adjust the dose based on lime PRNT.
    const Final_lime_requirement_t_ha = Base_lime_dose_t_ha * (100 / PRNT_val);

    setResults([
        { label: "Déficit de Ca²⁺ a Corrigir", value: Ca_deficit_kg_ha, unit: "kg/ha" },
        { label: "Déficit de Mg²⁺ a Corrigir", value: Mg_deficit_kg_ha, unit: "kg/ha" },
        // { label: "Calcário para suprir Ca (Base)", value: Lime_for_Ca_t_ha, unit: "t/ha" }, // Optional intermediate
        // { label: "Calcário para suprir Mg (Base)", value: Lime_for_Mg_t_ha, unit: "t/ha" }, // Optional intermediate
        { label: "Dose Base de Calcário (antes PRNT)", value: Base_lime_dose_t_ha, unit: "t/ha" },
        { label: "Necessidade de Calcário Final", value: Final_lime_requirement_t_ha, unit: "t/ha" },
    ]);

  }, [inputs]);

  const calculate = useCallback(() => {
    if (calculationMethod === 'baseSaturation') {
      calculateByBaseSaturation();
    } else {
      calculateByCecPercentage();
    }
  }, [calculationMethod, calculateByBaseSaturation, calculateByCecPercentage, inputs /* ensure re-calc on input change */]);

  const formulaNodeBaseSaturation = (
    <>
      <p><strong>NC (t/ha) = (VE - V) * T / 100</strong></p>
      <p><strong>Qta (t/ha) = NC * (100 / PRNT) * (Profundidade / 20) * (Área % / 100)</strong></p>
      <ul className="list-disc list-inside mt-2 text-xs">
        <li>VE: Saturação por bases exigida pela cultura (%)</li>
        <li>V: Saturação por bases do solo atual (%)</li>
        <li>T: CTC Potencial a pH 7,0 (cmolc/dm³)</li>
        <li>PRNT: Poder Relativo de Neutralização Total (%)</li>
        <li>Profundidade: Profundidade de incorporação (cm), padrão 20cm para camada 0-20cm.</li>
        <li>Área %: Porcentagem da área que receberá calcário (%).</li>
      </ul>
    </>
  );
   const notesNodeBaseSaturation = (
    <p>Se a Saturação por Bases Atual (V%) for maior ou igual à Desejada (VE%), a necessidade de calcário será zero.</p>
  );

  const formulaNodeCecPercentage = (
    <>
      <p>1. <strong>Ca²⁺<sub>req</sub> (cmolc/dm³) = (Meta % Ca na CTC / 100) * CTC<sub>solo</sub></strong></p>
      <p>2. <strong>Mg²⁺<sub>req</sub> (cmolc/dm³) = (Meta % Mg na CTC / 100) * CTC<sub>solo</sub></strong></p>
      <p>3. <strong>Déficit Ca²⁺ (cmolc/dm³) = MAX(0, Ca²⁺<sub>req</sub> - Ca²⁺<sub>atual</sub>)</strong></p>
      <p>4. <strong>Déficit Mg²⁺ (cmolc/dm³) = MAX(0, Mg²⁺<sub>req</sub> - Mg²⁺<sub>atual</sub>)</strong></p>
      <p>5. <strong>Déficit Ca²⁺ (kg/ha) = Déficit Ca²⁺<sub>cmolc</sub> * 400</strong></p>
      <p>6. <strong>Déficit Mg²⁺ (kg/ha) = Déficit Mg²⁺<sub>cmolc</sub> * 240</strong></p>
      <p>7. <strong>Ca elem. no calc. (kg/t) = (CaO% / 100) * 1000 * 0.7143</strong></p>
      <p>8. <strong>Mg elem. no calc. (kg/t) = (MgO% / 100) * 1000 * 0.603</strong></p>
      <p>9. <strong>Calc. p/ Ca (t/ha) = Déficit Ca²⁺<sub>kg/ha</sub> / Ca elem.<sub>kg/t</sub></strong></p>
      <p>10. <strong>Calc. p/ Mg (t/ha) = Déficit Mg²⁺<sub>kg/ha</sub> / Mg elem.<sub>kg/t</sub></strong></p>
      <p>11. <strong>Dose Base (t/ha) = MAX(Calc. p/ Ca, Calc. p/ Mg)</strong></p>
      <p>12. <strong>Final (t/ha) = Dose Base * (100 / PRNT%)</strong></p>
       <ul className="list-disc list-inside mt-2 text-xs">
        <li>Fatores 400 (Ca) e 240 (Mg) convertem cmolc/dm³ para kg/ha (0-20cm).</li>
        <li>Fatores 0.7143 (CaO) e 0.603 (MgO) convertem óxidos para elementos.</li>
      </ul>
    </>
  );
   const notesNodeCecPercentage = (
    <>
      <p>Este método visa ajustar os teores de Cálcio e Magnésio para participações percentuais desejadas na CTC do solo.</p>
      <p>A dose de calcário é determinada pela maior necessidade (Ca ou Mg) e corrigida pelo PRNT.</p>
      <p>Certifique-se que os dados da análise de solo e do calcário são precisos.</p>
    </>
  );

  const currentFormula = calculationMethod === 'baseSaturation' ? formulaNodeBaseSaturation : formulaNodeCecPercentage;
  const currentNotes = calculationMethod === 'baseSaturation' ? notesNodeBaseSaturation : notesNodeCecPercentage;
  const currentTitle = "Necessidade de Calagem"; // Title can be generic
  const currentDescription = "Calcula a quantidade de calcário (em toneladas por hectare) necessária para corrigir o solo, utilizando o método selecionado.";

  return (
    <CalculatorShell 
      title={currentTitle}
      description={currentDescription}
      results={results} 
      formula={currentFormula}
      notes={currentNotes}
      inputConfigsForReport={selectedInputConfigs}
      inputValuesForReport={inputs}
    >
      <div className="mb-6 border-b pb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Selecione o Método de Cálculo:</label>
        <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <label className="flex items-center p-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
            <input 
              type="radio" 
              name="calculationMethod" 
              value="baseSaturation" 
              checked={calculationMethod === 'baseSaturation'} 
              onChange={handleMethodChange} 
              className="form-radio h-4 w-4 text-green-600 focus:ring-green-500"
              aria-labelledby="method-basesat-label"
            />
            <span id="method-basesat-label" className="ml-2 text-sm text-gray-800">Saturação por Bases</span>
          </label>
          <label className="flex items-center p-2 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
            <input 
              type="radio" 
              name="calculationMethod" 
              value="cecPercentage" 
              checked={calculationMethod === 'cecPercentage'} 
              onChange={handleMethodChange} 
              className="form-radio h-4 w-4 text-green-600 focus:ring-green-500"
              aria-labelledby="method-cec-label"
            />
            <span id="method-cec-label" className="ml-2 text-sm text-gray-800">Aumento % de Ca e Mg na CTC</span>
          </label>
        </div>
      </div>

      {selectedInputConfigs.map(config => (
        <CalculatorInput
          key={config.name}
          config={config}
          value={inputs[config.name as keyof typeof inputs]}
          onChange={handleInputChange}
        />
      ))}
      <button
        onClick={calculate}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-150 ease-in-out mt-4"
        aria-label="Calcular necessidade de calagem"
      >
        Calcular
      </button>
    </CalculatorShell>
  );
};

export default LimingRequirement;

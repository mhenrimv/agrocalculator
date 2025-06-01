
import React, { useState, useCallback } from 'react';
import CalculatorInput from '../CalculatorInput';
import CalculatorShell from '../CalculatorShell';
import { InputConfig } from '../../types';

const MoistureDiscount: React.FC = () => {
  const [inputs, setInputs] = useState({
    pesoColhido: '66.6', // Peso colhido (kg ou sacas)
    umidadeInicial: '16', // Umidade inicial (%)
    umidadeFinal: '14', // Umidade final (%)
    unitType: 'sacas' // 'kg' ou 'sacas'
  });
  const [results, setResults] = useState<{ label: string; value: number | string; unit: string }[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const calculate = useCallback(() => {
    const pesoColhido_val = parseFloat(inputs.pesoColhido);
    const umidadeInicial_val = parseFloat(inputs.umidadeInicial);
    const umidadeFinal_val = parseFloat(inputs.umidadeFinal);

    if (isNaN(pesoColhido_val) || isNaN(umidadeInicial_val) || isNaN(umidadeFinal_val) || umidadeInicial_val < 0 || umidadeInicial_val > 100 || umidadeFinal_val < 0 || umidadeFinal_val > 100 ) {
      setResults([{ label: "Erro", value: "Entrada inválida", unit: "" }]);
      return;
    }
    if ((100 - umidadeFinal_val) === 0) {
      setResults([{ label: "Erro", value: "Umidade final não pode ser 100%", unit: "" }]);
      return;
    }

    if (umidadeInicial_val <= umidadeFinal_val) {
       setResults([{ label: "Info", value: pesoColhido_val, unit: `A umidade inicial (${umidadeInicial_val}%) já é menor ou igual à final (${umidadeFinal_val}%). Nenhum desconto aplicado.` }]);
       return;
    }

    const pesoFinal = pesoColhido_val * ((100 - umidadeInicial_val) / (100 - umidadeFinal_val));

    setResults([
      { label: "Peso/Quantidade Corrigida", value: pesoFinal, unit: inputs.unitType === 'kg' ? 'kg' : 'sacas' },
    ]);
  }, [inputs]);

  const inputConfigs: InputConfig[] = [
    { name: 'pesoColhido', label: 'Peso/Quantidade Colhida', type: 'number', placeholder: 'Ex: 1000 ou 66.6' },
    { name: 'unitType', label: 'Unidade do Peso Colhido', type: 'select', options: [{value: 'kg', label: 'kg'}, {value: 'sacas', label: 'Sacas'}] },
    { name: 'umidadeInicial', label: 'Umidade Inicial', type: 'number', unit: '%', placeholder: 'Ex: 16' },
    { name: 'umidadeFinal', label: 'Umidade Final (Alvo)', type: 'number', unit: '%', placeholder: 'Ex: 14 (padrão de comercialização)' },
  ];
  
  const formulaNode = (
    <>
      <p><strong>Peso Corrigido = Peso Colhido * ((100 - Umidade Inicial %) / (100 - Umidade Final %))</strong></p>
      <p className="text-xs mt-1">Esta fórmula calcula o peso do produto após o ajuste do teor de umidade, geralmente para um nível padrão de armazenamento ou venda.</p>
    </>
  );
   const notesNode = (
    <p>Se a umidade inicial for menor ou igual à umidade final, nenhum desconto de umidade é aplicado e o peso original é mantido.</p>
  );


  return (
    <CalculatorShell 
        title="Cálculo de Desconto de Umidade" 
        description="Calcula o peso ajustado da produção colhida após contabilizar a perda de umidade para uma porcentagem alvo (padrão de comercialização)." 
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

export default MoistureDiscount;

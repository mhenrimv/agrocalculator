
import React from 'react';

interface CalculatorShellProps {
  title: string;
  description: string;
  children: React.ReactNode;
  results?: { label: string; value: string | number; unit?: string }[];
  formula?: React.ReactNode;
  notes?: React.ReactNode;
}

const CalculatorShell: React.FC<CalculatorShellProps> = ({ title, description, children, results, formula, notes }) => {
  return (
    <div className="bg-white shadow-xl rounded-lg p-6 md:p-8 w-full">
      <h2 className="text-2xl font-bold text-green-700 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{description}</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Entradas</h3>
          {children}
        </div>
        <div>
          {formula && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Fórmula / Método</h3>
              <div className="p-4 bg-green-50 border border-green-200 rounded-md text-sm text-gray-700">
                {formula}
              </div>
            </div>
          )}
          {results && results.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Resultados</h3>
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div key={index} className="p-3 bg-gray-100 rounded-md flex justify-between items-center">
                    <span className="font-medium text-gray-700">{result.label}:</span>
                    <span className="text-green-600 font-bold text-lg">
                      {typeof result.value === 'number' ? result.value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 4 }) : result.value}
                      {result.unit && <span className="text-sm text-gray-500 ml-1">{result.unit}</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      {notes && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <h3 className="text-md font-semibold text-gray-700 mb-2">Observações</h3>
          <div className="text-sm text-gray-600 space-y-1">
            {notes}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculatorShell;


import React, { useState, useMemo, useEffect } from 'react';
import { CalculatorType, CalculatorInfo } from './types';
import LimingRequirement from './components/calculators/LimingRequirement.tsx';
import TravelSpeed from './components/calculators/TravelSpeed.tsx';
import MoistureDiscount from './components/calculators/MoistureDiscount.tsx';
import SeedQuantityKgHa from './components/calculators/SeedQuantityKgHa.tsx';
import PesticideTankDosage from './components/calculators/PesticideTankDosage.tsx';
import CoffeeLiming from './components/calculators/CoffeeLiming.tsx';
import SeederRegulationPlants from './components/calculators/SeederRegulationPlants.tsx';
import SprayerRegulationNozzle from './components/calculators/SprayerRegulationNozzle.tsx';
import SoybeanYieldEst from './components/calculators/SoybeanYieldEst.tsx';
import HarvestLoss from './components/calculators/HarvestLoss.tsx';
import CoffeeYieldEst from './components/calculators/CoffeeYieldEst.tsx';
import FertilizerSpreaderCalibration from './components/calculators/FertilizerSpreaderCalibration.tsx';
import BackpackSprayerRegulation from './components/calculators/BackpackSprayerRegulation.tsx';
import SoybeanFlowerAbortionLoss from './components/calculators/SoybeanFlowerAbortionLoss.tsx';
import MagnesiumApplied from './components/calculators/MagnesiumApplied.tsx';
import SowingTime from './components/calculators/SowingTime.tsx';
import SprayingSpeed from './components/calculators/SprayingSpeed.tsx';

const App: React.FC = () => {
  const [selectedCalculator, setSelectedCalculator] = useState<CalculatorType | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const calculators: CalculatorInfo[] = useMemo(() => [
    { id: CalculatorType.LIMING_REQUIREMENT, name: "Necessidade de Calagem", description: "Calcula as necessidades de calcário.", component: LimingRequirement },
    { id: CalculatorType.COFFEE_LIMING, name: "Calagem para Café", description: "Necessidade de calagem para lavouras de café.", component: CoffeeLiming },
    { id: CalculatorType.MAGNESIUM_APPLIED, name: "Magnésio Aplicado ao Solo", description: "Calcula Mg aplicado via calcário.", component: MagnesiumApplied },
    { id: CalculatorType.SEED_QUANTITY_KG_HA, name: "Quantidade de Sementes (kg/ha)", description: "Calcula sementes necessárias por hectare.", component: SeedQuantityKgHa },
    { id: CalculatorType.SEEDER_REGULATION_PLANTS, name: "Regulagem de Semeadora (Sementes/m)", description: "Sementes por metro linear para calibração.", component: SeederRegulationPlants },
    { id: CalculatorType.SOWING_TIME, name: "Tempo de Semeadura", description: "Calcula o tempo necessário para semear.", component: SowingTime },
    { id: CalculatorType.TRAVEL_SPEED, name: "Velocidade de Deslocamento (Geral)", description: "Calcula a velocidade de máquinas.", component: TravelSpeed },
    { id: CalculatorType.SPRAYING_SPEED, name: "Velocidade de Aplicação (Pulverização)", description: "Determina a velocidade ótima de pulverização.", component: SprayingSpeed },
    { id: CalculatorType.SPRAYER_REGULATION_NOZZLE, name: "Regulagem de Pulverizador (Bico)", description: "Vazão de bico para pulverizadores.", component: SprayerRegulationNozzle },
    { id: CalculatorType.PESTICIDE_TANK_DOSAGE, name: "Dosagem de Defensivo (Tanque)", description: "Calcula defensivo por tanque.", component: PesticideTankDosage },
    { id: CalculatorType.FERTILIZER_SPREADER_CALIBRATION, name: "Calibração de Distribuidor de Fertilizantes", description: "Calibra a vazão do distribuidor de fertilizantes.", component: FertilizerSpreaderCalibration },
    { id: CalculatorType.BACKPACK_SPRAYER_REGULATION, name: "Regulagem de Pulverizador Costal", description: "Regula pulverizador costal.", component: BackpackSprayerRegulation },
    { id: CalculatorType.SOYBEAN_YIELD_EST, name: "Estimativa de Produtividade Soja", description: "Estima a produtividade da soja.", component: SoybeanYieldEst },
    { id: CalculatorType.SOYBEAN_FLOWER_ABORTION_LOSS, name: "Perda por Abortamento Floral Soja", description: "Calcula perdas por abortamento floral.", component: SoybeanFlowerAbortionLoss },
    { id: CalculatorType.COFFEE_YIELD_EST, name: "Estimativa de Produtividade Café", description: "Estima a produtividade do café.", component: CoffeeYieldEst },
    { id: CalculatorType.HARVEST_LOSS, name: "Perdas na Colheita", description: "Calcula perdas durante a colheita.", component: HarvestLoss },
    { id: CalculatorType.MOISTURE_DISCOUNT, name: "Desconto de Umidade", description: "Ajusta o peso da colheita pela umidade.", component: MoistureDiscount },
  ], []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && Object.values(CalculatorType).includes(hash as CalculatorType)) {
        setSelectedCalculator(hash as CalculatorType);
      } else {
        setSelectedCalculator(null);
      }
      setIsMobileMenuOpen(false); // Close mobile menu on hash change
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial load

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleSelectCalculator = (id: CalculatorType) => {
    setSelectedCalculator(id);
    window.location.hash = id;
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };
  
  const navigateHome = () => {
    setSelectedCalculator(null);
    window.location.hash = '';
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }

  const CurrentCalculator = selectedCalculator ? calculators.find(calc => calc.id === selectedCalculator)?.component : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-600 via-green-700 to-green-800">
      <header className="bg-green-800 text-white p-4 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <button 
            className="md:hidden p-2 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white mr-2" // Added mr-2 for spacing
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
          <button onClick={navigateHome} className="text-2xl md:text-3xl font-bold tracking-tight focus:outline-none focus:ring-2 focus:ring-white rounded">
            Calculadora Agronômica
          </button>
          {/* Spacer to push title to center if hamburger is visible, or to allow title to be on far left if hamburger not there.
              On mobile, justify-between handles it. On desktop, we need to ensure title doesn't jump to center if hamburger is hidden.
              The current setup with justify-between should make the title effectively take the "right" slot on mobile.
              On desktop, without the hamburger, the title is the first item and aligns left.
              If we want title centered on mobile when hamburger is present:
              Add a div here: <div className="md:hidden w-8"></div> or similar width as hamburger
              And adjust the title's flex properties or text-align.
              For now, simply reordering is the primary goal. The title will be to the right of the hamburger on mobile.
          */}
           <div className="w-6 md:hidden"></div> {/* Placeholder to balance the hamburger menu button for centering the title, if needed. Or remove if title should be left-aligned next to hamburger */}
        </div>
      </header>

      <div className="flex-grow container mx-auto p-4 flex flex-col md:flex-row gap-6">
        <aside
          id="mobile-menu"
          className={`
            fixed inset-y-0 left-0 z-30 w-64 bg-white/95 backdrop-blur-lg shadow-2xl p-4 transform transition-transform duration-300 ease-in-out flex flex-col
            md:relative md:inset-y-auto md:left-auto md:w-1/4 lg:w-1/5 md:translate-x-0 md:sticky md:top-20 md:self-start md:max-h-[calc(100vh-10rem)] md:flex md:flex-col rounded-r-xl md:rounded-xl
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="flex justify-between items-center md:block">
            <h2 className="text-xl font-semibold text-green-800 mb-0 md:mb-4 border-b-2 border-green-500 pb-2 flex-shrink-0">Cálculos</h2>
            <button 
              className="md:hidden p-1 text-gray-600 hover:text-gray-800"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Fechar menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav
            className="space-y-1 overflow-y-auto flex-grow pr-1 mt-4 md:mt-0"
            aria-label="Menu de calculadoras"
          >
            {calculators.map((calc) => (
              <button
                key={calc.id}
                onClick={() => handleSelectCalculator(calc.id)}
                className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-150 ease-in-out
                  ${selectedCalculator === calc.id
                    ? 'bg-green-600 text-white shadow-md scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-green-100 hover:text-green-700 focus:bg-green-200 focus:text-green-800'
                  } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50`}
                aria-label={`Selecionar calculadora: ${calc.name}`}
                aria-current={selectedCalculator === calc.id ? "page" : undefined}
                title={calc.description}
              >
                {calc.name}
              </button>
            ))}
          </nav>
        </aside>
        
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-20 bg-black/30 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          ></div>
        )}

        <main className="w-full md:w-3/4 lg:w-4/5" role="main" aria-live="polite">
          {CurrentCalculator ? (
            <CurrentCalculator />
          ) : (
            <div className="bg-white shadow-xl rounded-lg p-8 text-left">
              <h2 className="text-3xl font-semibold text-green-700 mb-4">Bem-vindo à Calculadora Agronômica!</h2>
              <p className="text-gray-700 text-lg mb-6">
                Esta aplicação web oferece um conjunto de calculadoras agronômicas essenciais para auxiliar no planejamento e manejo agrícola. Nossas ferramentas são projetadas para serem intuitivas e fornecer resultados precisos para diversas operações no campo.
              </p>
              <h3 className="text-2xl font-semibold text-green-600 mb-3">Funcionalidades Principais:</h3>
              <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
                <li>Cálculos de Calagem e Correção do Solo (Ex: Necessidade de Calagem, Calagem para Café, Mg Aplicado)</li>
                <li>Planejamento e Regulagem de Semeadura (Ex: Quantidade de Sementes, Regulagem de Semeadora, Tempo de Semeadura)</li>
                <li>Calibração e Operação de Pulverizadores (Ex: Velocidade, Regulagem de Bico, Dosagem por Tanque, Pulverizador Costal)</li>
                <li>Estimativas de Produtividade e Perdas (Ex: Produtividade de Soja, Café, Perdas na Colheita, Abortamento Floral)</li>
                <li>Ajustes e Cálculos de Colheita (Ex: Desconto de Umidade)</li>
                <li>Calibração de Equipamentos Diversos (Ex: Distribuidor de Fertilizantes)</li>
              </ul>
              <p className="text-gray-700 text-lg">
                Explore nossas calculadoras selecionando uma opção no menu.
              </p>
            </div>
          )}
        </main>
      </div>

      <footer className="bg-green-800 text-white text-center p-4 mt-auto">
        <p>&copy; {new Date().getFullYear()} Calculadora Agronômica. Todos os direitos reservados.</p>
        <p className="text-xs opacity-75">Developed by @hmarcosvieira</p>
      </footer>
    </div>
  );
};

export default App;


export enum CalculatorType {
  LIMING_REQUIREMENT = 'LIMING_REQUIREMENT',
  COFFEE_LIMING = 'COFFEE_LIMING',
  SEEDER_REGULATION_PLANTS = 'SEEDER_REGULATION_PLANTS',
  SEED_QUANTITY_KG_HA = 'SEED_QUANTITY_KG_HA',
  SPRAYER_REGULATION_NOZZLE = 'SPRAYER_REGULATION_NOZZLE',
  TRAVEL_SPEED = 'TRAVEL_SPEED',
  PESTICIDE_TANK_DOSAGE = 'PESTICIDE_TANK_DOSAGE',
  SOYBEAN_YIELD_EST = 'SOYBEAN_YIELD_EST',
  HARVEST_LOSS = 'HARVEST_LOSS',
  MOISTURE_DISCOUNT = 'MOISTURE_DISCOUNT',
  COFFEE_YIELD_EST = 'COFFEE_YIELD_EST',
  FERTILIZER_SPREADER_CALIBRATION = 'FERTILIZER_SPREADER_CALIBRATION',
  BACKPACK_SPRAYER_REGULATION = 'BACKPACK_SPRAYER_REGULATION',
  SOYBEAN_FLOWER_ABORTION_LOSS = 'SOYBEAN_FLOWER_ABORTION_LOSS',
  MAGNESIUM_APPLIED = 'MAGNESIUM_APPLIED',
  SOWING_TIME = 'SOWING_TIME',
  SPRAYING_SPEED = 'SPRAYING_SPEED',
}

export interface CalculatorInfo {
  id: CalculatorType;
  name: string;
  description: string;
  component: React.FC;
}

export interface InputConfig {
  name: string;
  label: string;
  type: 'number' | 'text' | 'select';
  unit?: string;
  placeholder?: string;
  options?: { value: string | number; label: string }[];
  defaultValue?: string | number;
}

export interface CalculationResult {
  label: string;
  value: string | number;
  unit?: string;
}
    
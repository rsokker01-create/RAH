
export interface Environment {
  temperature: number; // in Celsius
  wind: number; // in km/h
  water: number; // percentage
}

export enum PlantStatus {
  Healthy = 'صحي',
  Fruiting = 'مثمر',
  Wilted = 'ذابل',
  Frozen = 'متجمد',
  Dried = 'جاف',
  Broken = 'متكسر',
  Windy = 'عاصف'
}

export interface PlantState {
  status: PlantStatus;
  growth: number; // multiplier, 1 is normal
}

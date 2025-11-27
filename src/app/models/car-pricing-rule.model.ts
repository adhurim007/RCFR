export interface CarPricingRule {
  id?: number;
  carId: number;
  ruleType: string;
  pricePerDay: number;
  fromDate?: string | null;
  toDate?: string | null;
  daysOfWeek?: string[] | null;
  description?: string | null;
}

export type DataType = 'string' | 'number' | 'date' | 'boolean';
export type FieldRole = 'dimension' | 'measure';

export interface Field {
  id: string;
  name: string;
  dataType: DataType;
  role: FieldRole;
  description?: string;
  isCustom?: boolean;
  formula?: string;
}

export type AggregationType = 'sum' | 'avg' | 'count' | 'min' | 'max';

export interface SlotField {
  field: Field;
  aggregation?: AggregationType;
}

export interface StandardSlots {
  xAxis: SlotField | null;
  yAxis: SlotField | null;
  yAxisSecondary?: SlotField | null;
  legend: SlotField | null;
  size: SlotField | null;
  tooltip: SlotField | null;
}

export type StandardChartType =
  | 'bar'
  | 'stacked_bar'
  | 'line'
  | 'area'
  | 'scatter'
  | 'donut'
  | 'radar';

export type WildVisualizerType =
  | 'cosmic_orbit'
  | 'spiral_vortex'
  | 'topology_wave'
  | 'particle_hive';

export interface WildSlots {
  speedOrFrequency: SlotField | null;
  coreMassOrAmplitude: SlotField | null;
  colorSpectrum: SlotField | null;
  harmonicDensity: SlotField | null;
  customMetricSlot: SlotField | null;
}

export interface CustomVariable {
  id: string;
  name: string;
  expressionType: 'ratio' | 'exponential' | 'chaos_index' | 'custom_math';
  formulaTemplate: string;
  assignedFields: {
    slotA: Field | null;
    slotB: Field | null;
    slotC: Field | null;
  };
  customMultiplier: number;
}

export interface Dataset {
  id: string;
  name: string;
  category: string;
  description: string;
  fields: Field[];
  data: Record<string, any>[];
}

export type SyncRate = 1000 | 2500 | 5000;
export type AppViewMode = 'standard' | 'bananas_wild';

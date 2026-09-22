import { ChartThemeId } from '../types';

export interface ChartTheme {
  id: ChartThemeId;
  name: string;
  colors: string[];
  description: string;
  previewColors: string[];
}

export const CHART_THEMES: ChartTheme[] = [
  {
    id: 'ocean',
    name: 'Oceanic Blue',
    colors: ['#2563EB', '#0D9488', '#6366F1', '#38BDF8', '#8B5CF6', '#10B981'],
    previewColors: ['#2563EB', '#0D9488', '#6366F1'],
    description: 'Corporate royal blues and cool teals',
  },
  {
    id: 'coral',
    name: 'Context Coral',
    colors: ['#FF7A59', '#18181B', '#F97316', '#52525B', '#FB923C', '#71717A'],
    previewColors: ['#FF7A59', '#18181B', '#F97316'],
    description: 'ContextOS signature coral orange and obsidian',
  },
  {
    id: 'emerald',
    name: 'Emerald Forest',
    colors: ['#059669', '#10B981', '#14B8A6', '#0284C7', '#84CC16', '#065F46'],
    previewColors: ['#059669', '#10B981', '#14B8A6'],
    description: 'Fresh emerald greens and natural teals',
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    colors: ['#E11D48', '#F59E0B', '#D946EF', '#FB7185', '#EA580C', '#8B5CF6'],
    previewColors: ['#E11D48', '#F59E0B', '#D946EF'],
    description: 'Warm sunset rose, amber and magenta',
  },
  {
    id: 'monochrome',
    name: 'Slate Monochrome',
    colors: ['#18181B', '#3F3F46', '#71717A', '#A1A1AA', '#52525B', '#27272A'],
    previewColors: ['#18181B', '#52525B', '#A1A1AA'],
    description: 'Minimalist high-contrast dark neutrals',
  },
  {
    id: 'cyber',
    name: 'Cyber Vivid',
    colors: ['#4F46E5', '#06B6D4', '#EC4899', '#EAB308', '#8B5CF6', '#10B981'],
    previewColors: ['#4F46E5', '#06B6D4', '#EC4899'],
    description: 'Vibrant neon and electric accents',
  },
];

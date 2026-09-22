import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis,
} from 'recharts';
import { StandardChartType, StandardSlots, ChartThemeId } from '../types';
import { haptics } from '../utils/haptics';
import { CHART_THEMES } from '../data/themes';
import { Palette, Check } from 'lucide-react';

interface ChartCanvasProps {
  chartData: any[];
  legendKeys: string[];
  yFieldLabel: string;
  slots: StandardSlots;
  chartType: StandardChartType;
  onChangeChartType: (type: StandardChartType) => void;
  isDarkMode: boolean;
  totalRowCount: number;
  activeTab?: 'visual' | 'table';
  onChangeTab?: (tab: 'visual' | 'table') => void;
  colorTheme?: ChartThemeId;
  onChangeColorTheme?: (theme: ChartThemeId) => void;
}

export const ChartCanvas: React.FC<ChartCanvasProps> = ({
  chartData,
  legendKeys,
  yFieldLabel,
  slots,
  chartType,
  onChangeChartType,
  totalRowCount,
  activeTab: propActiveTab,
  onChangeTab: propOnChangeTab,
  colorTheme: propColorTheme,
  onChangeColorTheme: propOnChangeColorTheme,
}) => {
  // Support both internal and external control for tab and color theme
  const [internalTab, setInternalTab] = useState<'visual' | 'table'>('visual');
  const activeTab = propActiveTab !== undefined ? propActiveTab : internalTab;

  const [internalColorTheme, setInternalColorTheme] = useState<ChartThemeId>('ocean');
  const activeColorTheme = propColorTheme !== undefined ? propColorTheme : internalColorTheme;

  const handleSelectColorTheme = (themeId: ChartThemeId) => {
    haptics.tick();
    if (propOnChangeColorTheme) {
      propOnChangeColorTheme(themeId);
    } else {
      setInternalColorTheme(themeId);
    }
  };

  const currentTheme =
    CHART_THEMES.find((t) => t.id === activeColorTheme) || CHART_THEMES[0];
  const activePalette = currentTheme.colors;

  // Chart options: taller, square visual cards with miniature illustrations underneath
  const chartDefinitions: {
    id: StandardChartType;
    label: string;
    renderVisualPicture: () => React.ReactNode;
  }[] = [
    {
      id: 'bar',
      label: 'Clustered',
      renderVisualPicture: () => (
        <svg viewBox="0 0 54 28" className="w-full h-6.5" fill="none" aria-label="Clustered Bar Preview">
          <line x1="4" y1="25" x2="50" y2="25" stroke="#E4E4E7" strokeWidth="1.5" />
          <rect x="7" y="11" width="5" height="14" rx="1" fill={activePalette[0]} />
          <rect x="13" y="6" width="5" height="19" rx="1" fill="#18181B" />
          <rect x="22" y="15" width="5" height="10" rx="1" fill={activePalette[0]} />
          <rect x="28" y="9" width="5" height="16" rx="1" fill="#18181B" />
          <rect x="37" y="4" width="5" height="21" rx="1" fill={activePalette[0]} />
          <rect x="43" y="12" width="5" height="13" rx="1" fill="#18181B" />
        </svg>
      ),
    },
    {
      id: 'stacked_bar',
      label: 'Stacked',
      renderVisualPicture: () => (
        <svg viewBox="0 0 54 28" className="w-full h-6.5" fill="none" aria-label="Stacked Bar Preview">
          <line x1="4" y1="25" x2="50" y2="25" stroke="#E4E4E7" strokeWidth="1.5" />
          <rect x="8" y="15" width="9" height="10" rx="1" fill="#18181B" />
          <rect x="8" y="6" width="9" height="8" rx="1" fill={activePalette[0]} />
          <rect x="22" y="13" width="9" height="12" rx="1" fill="#18181B" />
          <rect x="22" y="3" width="9" height="9" rx="1" fill={activePalette[0]} />
          <rect x="36" y="17" width="9" height="8" rx="1" fill="#18181B" />
          <rect x="36" y="8" width="9" height="8" rx="1" fill={activePalette[0]} />
        </svg>
      ),
    },
    {
      id: 'line',
      label: 'Line',
      renderVisualPicture: () => (
        <svg viewBox="0 0 54 28" className="w-full h-6.5" fill="none" aria-label="Trend Line Preview">
          <line x1="4" y1="25" x2="50" y2="25" stroke="#E4E4E7" strokeWidth="1.5" />
          <path d="M 6 20 Q 18 5 30 15 T 48 4" stroke={activePalette[0]} strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="6" cy="20" r="2.5" fill="#18181B" />
          <circle cx="20" cy="10" r="2.5" fill="#18181B" />
          <circle cx="34" cy="14" r="2.5" fill="#18181B" />
          <circle cx="48" cy="4" r="2.5" fill="#18181B" />
        </svg>
      ),
    },
    {
      id: 'area',
      label: 'Area',
      renderVisualPicture: () => (
        <svg viewBox="0 0 54 28" className="w-full h-6.5" fill="none" aria-label="Area Spline Preview">
          <line x1="4" y1="25" x2="50" y2="25" stroke="#E4E4E7" strokeWidth="1.5" />
          <path d="M 6 21 Q 18 7 30 16 T 48 5 L 48 25 L 6 25 Z" fill={activePalette[0]} fillOpacity="0.25" />
          <path d="M 6 21 Q 18 7 30 16 T 48 5" stroke={activePalette[0]} strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'composed',
      label: 'Combo',
      renderVisualPicture: () => (
        <svg viewBox="0 0 54 28" className="w-full h-6.5" fill="none" aria-label="Combo Chart Preview">
          <line x1="4" y1="25" x2="50" y2="25" stroke="#E4E4E7" strokeWidth="1.5" />
          <rect x="8" y="12" width="7" height="13" rx="1" fill="#18181B" fillOpacity="0.8" />
          <rect x="23" y="7" width="7" height="18" rx="1" fill="#18181B" fillOpacity="0.8" />
          <rect x="38" y="14" width="7" height="11" rx="1" fill="#18181B" fillOpacity="0.8" />
          <path d="M 11 18 L 26 5 L 41 11" stroke={activePalette[0]} strokeWidth="2" strokeLinecap="round" />
          <circle cx="11" cy="18" r="2" fill={activePalette[0]} />
          <circle cx="26" cy="5" r="2" fill={activePalette[0]} />
          <circle cx="41" cy="11" r="2" fill={activePalette[0]} />
        </svg>
      ),
    },
    {
      id: 'scatter',
      label: 'Scatter',
      renderVisualPicture: () => (
        <svg viewBox="0 0 54 28" className="w-full h-6.5" fill="none" aria-label="Scatter Plot Preview">
          <line x1="4" y1="25" x2="50" y2="25" stroke="#E4E4E7" strokeWidth="1.5" />
          <line x1="4" y1="3" x2="4" y2="25" stroke="#E4E4E7" strokeWidth="1.5" />
          <circle cx="12" cy="18" r="3" fill={activePalette[0]} />
          <circle cx="19" cy="8" r="3.5" fill="#18181B" />
          <circle cx="28" cy="20" r="2.5" fill={activePalette[0]} />
          <circle cx="35" cy="6" r="4" fill={activePalette[0]} />
          <circle cx="41" cy="14" r="3" fill="#18181B" />
          <circle cx="47" cy="7" r="3" fill={activePalette[0]} />
        </svg>
      ),
    },
    {
      id: 'donut',
      label: 'Donut',
      renderVisualPicture: () => (
        <svg viewBox="0 0 54 28" className="w-full h-6.5" fill="none" aria-label="Donut Chart Preview">
          <circle cx="27" cy="14" r="10" stroke="#E4E4E7" strokeWidth="4.5" />
          <circle
            cx="27"
            cy="14"
            r="10"
            stroke={activePalette[0]}
            strokeWidth="4.5"
            strokeDasharray="33 38"
            strokeDashoffset="7"
          />
          <circle
            cx="27"
            cy="14"
            r="10"
            stroke="#18181B"
            strokeWidth="4.5"
            strokeDasharray="20 50"
            strokeDashoffset="-26"
          />
        </svg>
      ),
    },
    {
      id: 'pie',
      label: 'Pie',
      renderVisualPicture: () => (
        <svg viewBox="0 0 54 28" className="w-full h-6.5" fill="none" aria-label="Pie Chart Preview">
          <circle cx="27" cy="14" r="11" fill={activePalette[0]} />
          <path d="M 27 14 L 27 3 A 11 11 0 0 1 38 14 Z" fill="#18181B" />
          <path d="M 27 14 L 38 14 A 11 11 0 0 1 31 24.5 Z" fill={activePalette[1] || '#0D9488'} />
        </svg>
      ),
    },
    {
      id: 'radar',
      label: 'Radar',
      renderVisualPicture: () => (
        <svg viewBox="0 0 54 28" className="w-full h-6.5" fill="none" aria-label="Radar Axis Preview">
          <polygon points="27,2 44,10 38,24 16,24 10,10" stroke="#E4E4E7" strokeWidth="1" />
          <polygon
            points="27,4 41,11 35,23 18,20 12,12"
            fill={activePalette[0]}
            fillOpacity="0.25"
            stroke={activePalette[0]}
            strokeWidth="1.5"
          />
          <circle cx="27" cy="4" r="2" fill="#18181B" />
          <circle cx="41" cy="11" r="2" fill="#18181B" />
          <circle cx="35" cy="23" r="2" fill="#18181B" />
          <circle cx="18" cy="20" r="2" fill="#18181B" />
          <circle cx="12" cy="12" r="2" fill="#18181B" />
        </svg>
      ),
    },
  ];

  // Calculate summary metrics
  const totalSum = chartData.reduce((acc, row) => {
    if (legendKeys.length > 1) {
      return acc + legendKeys.reduce((kAcc, k) => kAcc + (Number(row[k]) || 0), 0);
    }
    return acc + (Number(row.value ?? row[legendKeys[0]]) || 0);
  }, 0);

  const peakRow = chartData.reduce(
    (max, row) => {
      const val =
        legendKeys.length > 1
          ? legendKeys.reduce((kAcc, k) => kAcc + (Number(row[k]) || 0), 0)
          : Number(row.value ?? row[legendKeys[0]]) || 0;
      return val > max.val ? { x: row.x, val } : max;
    },
    { x: '—', val: 0 }
  );

  const gridStroke = '#F4F4F5';
  const textFill = '#71717A';

  // Custom high-contrast tooltip
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-zinc-200 rounded-xl p-2.5 shadow-xl text-xs z-50 min-w-[140px]">
          <p className="font-bold text-zinc-900 mb-1 border-b border-zinc-100 pb-1">
            {label || payload[0]?.payload?.x}
          </p>
          <div className="space-y-1">
            {payload.map((entry: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between gap-3 text-zinc-800">
                <span className="flex items-center gap-1.5 font-medium text-zinc-600 truncate">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                    style={{ backgroundColor: entry.color || entry.fill }}
                  />
                  <span className="truncate">{entry.name}:</span>
                </span>
                <span className="font-bold text-zinc-900 shrink-0">
                  {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white p-2.5 sm:p-4 md:p-5 overflow-y-auto min-w-0">
      {/*
        Top Header Strip of Graph Display:
        1. Taller, square chart buttons allowing more to be populated up top
        2. Theme / color selector tile system in upper right hand corner in line with chart cards
      */}
      <div className="mb-3 sm:mb-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 sm:gap-3 border-b border-zinc-100 pb-3">
        {/* Left: Taller, Square Chart Visual Buttons */}
        <div className="flex-1 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1.5 no-scrollbar scrollbar-thin">
          {chartDefinitions.map((cd) => {
            const isSelected = chartType === cd.id;
            return (
              <button
                key={cd.id}
                onClick={() => {
                  haptics.tick();
                  onChangeChartType(cd.id);
                }}
                title={`Switch to ${cd.label} visual`}
                className={`w-[74px] h-[74px] sm:w-[82px] sm:h-[82px] shrink-0 aspect-square p-1.5 rounded-xl border flex flex-col items-center justify-between text-center transition-all cursor-pointer group ${
                  isSelected
                    ? 'border-zinc-900 bg-zinc-50/90 shadow-2xs ring-1.5 ring-zinc-900'
                    : 'border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50/60'
                }`}
              >
                {/* Visual Picture */}
                <div className="w-full flex-1 flex items-center justify-center pt-0.5">
                  {cd.renderVisualPicture()}
                </div>

                {/* Text Description */}
                <span
                  className={`text-[10px] sm:text-[11px] font-bold tracking-tight truncate w-full mt-1 ${
                    isSelected ? 'text-zinc-900 font-extrabold' : 'text-zinc-600'
                  }`}
                >
                  {cd.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right: Theme / Color Selector Tile System in upper right hand corner */}
        <div className="shrink-0 flex items-center gap-2 pl-0 md:pl-3 md:border-l md:border-zinc-200 justify-between md:justify-end">
          <div className="flex items-center gap-1.5 text-zinc-500">
            <Palette className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-[11px] uppercase tracking-wider font-bold text-zinc-700 hidden sm:inline">
              Palette
            </span>
          </div>

          {/* Theme Swatch Tiles */}
          <div className="flex items-center gap-1 p-0.5 rounded-xl bg-zinc-100/80 border border-zinc-200">
            {CHART_THEMES.map((theme) => {
              const isCurrent = activeColorTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => handleSelectColorTheme(theme.id)}
                  title={`${theme.name}: ${theme.description}`}
                  className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg border transition-all flex items-center justify-center cursor-pointer ${
                    isCurrent
                      ? 'bg-white border-zinc-900 ring-2 ring-zinc-900/90 shadow-2xs scale-105 z-10'
                      : 'bg-white/80 border-transparent hover:border-zinc-300 hover:scale-102'
                  }`}
                >
                  {/* Miniature Triple Color Bar Preview */}
                  <div className="flex gap-0.5 h-3.5 w-4 rounded-xs overflow-hidden">
                    {theme.previewColors.map((col, idx) => (
                      <span
                        key={idx}
                        className="flex-1 h-full inline-block"
                        style={{ backgroundColor: col }}
                      />
                    ))}
                  </div>

                  {isCurrent && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-zinc-900 text-white flex items-center justify-center">
                      <Check className="w-2 h-2 stroke-[3]" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPI Metric Summary Strip (Scales Responsively) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-3 sm:mb-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-2.5 sm:p-3 shadow-2xs min-w-0">
          <p className="text-[10px] uppercase font-bold text-zinc-400 truncate">Total Aggregate</p>
          <p className="text-lg sm:text-xl font-bold text-zinc-900 mt-0.5 truncate">
            {totalSum > 1000
              ? totalSum.toLocaleString(undefined, { maximumFractionDigits: 1 })
              : totalSum.toFixed(2)}
          </p>
          <p className="text-[10px] text-zinc-500 font-medium truncate mt-0.5">
            {yFieldLabel}
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-2.5 sm:p-3 shadow-2xs min-w-0">
          <p className="text-[10px] uppercase font-bold text-zinc-400 truncate">Top Category</p>
          <p className="text-lg sm:text-xl font-bold text-zinc-900 mt-0.5 truncate">{peakRow.x}</p>
          <p className="text-[10px] text-zinc-500 font-medium truncate mt-0.5">
            Peak: {peakRow.val.toLocaleString()}
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-2.5 sm:p-3 shadow-2xs min-w-0">
          <p className="text-[10px] uppercase font-bold text-zinc-400 truncate">Categories</p>
          <p className="text-lg sm:text-xl font-bold text-zinc-900 mt-0.5 truncate">{chartData.length}</p>
          <p className="text-[10px] text-zinc-500 font-medium truncate mt-0.5">
            from {totalRowCount} raw records
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-2.5 sm:p-3 shadow-2xs min-w-0">
          <p className="text-[10px] uppercase font-bold text-zinc-400 truncate">Series Breakdown</p>
          <p className="text-lg sm:text-xl font-bold text-zinc-900 mt-0.5 truncate">
            {slots.legend ? slots.legend.field.name : 'Single Series'}
          </p>
          <p className="text-[10px] text-zinc-500 font-medium truncate mt-0.5">
            {legendKeys.length} series plotted
          </p>
        </div>
      </div>

      {/* Main Chart Canvas Stage (Dynamic & ResponsiveContainer) */}
      <div className="flex-1 bg-white border border-zinc-200 rounded-2xl p-3 sm:p-5 md:p-6 shadow-2xs flex flex-col min-h-[380px] sm:min-h-[440px] min-w-0">
        {activeTab === 'visual' ? (
          <div className="flex-1 w-full h-full min-h-[340px] sm:min-h-[400px]">
            <ResponsiveContainer width="100%" height="100%" debounce={30}>
              {chartType === 'bar' ? (
                <BarChart data={chartData} margin={{ top: 15, right: 20, left: 5, bottom: 35 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis
                    dataKey="x"
                    stroke={textFill}
                    fontSize={11}
                    fontWeight={500}
                    tickLine={false}
                    interval={0}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis stroke={textFill} fontSize={11} fontWeight={500} tickLine={false} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '11px', fontWeight: '500' }} />
                  {legendKeys.map((key, idx) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      fill={activePalette[idx % activePalette.length]}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              ) : chartType === 'stacked_bar' ? (
                <BarChart data={chartData} margin={{ top: 15, right: 20, left: 5, bottom: 35 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis
                    dataKey="x"
                    stroke={textFill}
                    fontSize={11}
                    fontWeight={500}
                    tickLine={false}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis stroke={textFill} fontSize={11} fontWeight={500} tickLine={false} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '11px', fontWeight: '500' }} />
                  {legendKeys.map((key, idx) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      stackId="a"
                      fill={activePalette[idx % activePalette.length]}
                      radius={idx === legendKeys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                    />
                  ))}
                </BarChart>
              ) : chartType === 'line' ? (
                <LineChart data={chartData} margin={{ top: 15, right: 20, left: 5, bottom: 35 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis
                    dataKey="x"
                    stroke={textFill}
                    fontSize={11}
                    fontWeight={500}
                    tickLine={false}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis stroke={textFill} fontSize={11} fontWeight={500} tickLine={false} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '11px', fontWeight: '500' }} />
                  {legendKeys.map((key, idx) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={activePalette[idx % activePalette.length]}
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#18181B' }}
                      activeDot={{ r: 6, fill: activePalette[idx % activePalette.length] }}
                    />
                  ))}
                </LineChart>
              ) : chartType === 'area' ? (
                <AreaChart data={chartData} margin={{ top: 15, right: 20, left: 5, bottom: 35 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis
                    dataKey="x"
                    stroke={textFill}
                    fontSize={11}
                    fontWeight={500}
                    tickLine={false}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis stroke={textFill} fontSize={11} fontWeight={500} tickLine={false} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '11px', fontWeight: '500' }} />
                  {legendKeys.map((key, idx) => (
                    <Area
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={activePalette[idx % activePalette.length]}
                      fill={activePalette[idx % activePalette.length]}
                      fillOpacity={0.25}
                      strokeWidth={2}
                    />
                  ))}
                </AreaChart>
              ) : chartType === 'composed' ? (
                <ComposedChart data={chartData} margin={{ top: 15, right: 20, left: 5, bottom: 35 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={gridStroke} />
                  <XAxis
                    dataKey="x"
                    stroke={textFill}
                    fontSize={11}
                    fontWeight={500}
                    tickLine={false}
                    angle={-25}
                    textAnchor="end"
                  />
                  <YAxis stroke={textFill} fontSize={11} fontWeight={500} tickLine={false} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '11px', fontWeight: '500' }} />
                  {legendKeys.map((key, idx) => {
                    const isLine = idx % 2 === 1;
                    return isLine ? (
                      <Line
                        key={key}
                        type="monotone"
                        dataKey={key}
                        stroke={activePalette[idx % activePalette.length]}
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: '#18181B' }}
                      />
                    ) : (
                      <Bar
                        key={key}
                        dataKey={key}
                        fill={activePalette[idx % activePalette.length]}
                        radius={[4, 4, 0, 0]}
                      />
                    );
                  })}
                </ComposedChart>
              ) : chartType === 'scatter' ? (
                <ScatterChart margin={{ top: 15, right: 20, left: 5, bottom: 35 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
                  <XAxis
                    dataKey="x"
                    type="category"
                    stroke={textFill}
                    fontSize={11}
                    fontWeight={500}
                    name="Category"
                  />
                  <YAxis
                    dataKey="value"
                    stroke={textFill}
                    fontSize={11}
                    fontWeight={500}
                    name="Value"
                  />
                  <ZAxis dataKey="size" range={[80, 450]} name="Weight" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} content={<CustomChartTooltip />} />
                  <Scatter
                    name={yFieldLabel}
                    data={chartData}
                    fill={activePalette[0]}
                    stroke="#18181B"
                    strokeWidth={1}
                  />
                </ScatterChart>
              ) : chartType === 'donut' ? (
                <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontWeight: '500' }} />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="x"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={115}
                    paddingAngle={3}
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={activePalette[index % activePalette.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              ) : chartType === 'pie' ? (
                <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontWeight: '500' }} />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="x"
                    cx="50%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={115}
                    paddingAngle={1}
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`pie-cell-${index}`}
                        fill={activePalette[index % activePalette.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              ) : (
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius={105}
                  data={chartData.slice(0, 8)}
                  margin={{ top: 15, right: 25, left: 15, bottom: 15 }}
                >
                  <PolarGrid stroke={gridStroke} />
                  <PolarAngleAxis dataKey="x" stroke={textFill} fontSize={11} />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke={textFill} fontSize={10} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Radar
                    name={yFieldLabel}
                    dataKey="value"
                    stroke={activePalette[0]}
                    fill={activePalette[0]}
                    fillOpacity={0.3}
                  />
                </RadarChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
          /* High-contrast data table */
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50">
                  <th className="p-3 font-bold text-zinc-700">Category / Dimension</th>
                  {legendKeys.map((k) => (
                    <th key={k} className="p-3 font-bold text-zinc-700 text-right">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {chartData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="p-3 font-semibold text-zinc-900">{row.x}</td>
                    {legendKeys.map((k) => (
                      <td key={k} className="p-3 text-right font-mono text-zinc-800">
                        {typeof row[k] === 'number'
                          ? row[k].toLocaleString(undefined, { maximumFractionDigits: 2 })
                          : row[k] ?? '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

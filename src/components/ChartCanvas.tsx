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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ZAxis,
} from 'recharts';
import { StandardChartType, StandardSlots } from '../types';
import { haptics } from '../utils/haptics';
import {
  BarChart3,
  Table,
} from 'lucide-react';

interface ChartCanvasProps {
  chartData: any[];
  legendKeys: string[];
  yFieldLabel: string;
  slots: StandardSlots;
  chartType: StandardChartType;
  onChangeChartType: (type: StandardChartType) => void;
  isDarkMode: boolean;
  totalRowCount: number;
}

// Refined, high-contrast, professional BI chart palette
const CHART_PALETTE = [
  '#2563EB', // Royal Blue
  '#0D9488', // Deep Teal
  '#6366F1', // Indigo
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#8B5CF6', // Purple
  '#10B981', // Emerald
  '#0284C7', // Sky
];

export const ChartCanvas: React.FC<ChartCanvasProps> = ({
  chartData,
  legendKeys,
  yFieldLabel,
  slots,
  chartType,
  onChangeChartType,
  totalRowCount,
}) => {
  const [activeTab, setActiveTab] = useState<'visual' | 'table'>('visual');

  // Definitions with text descriptions on top AND miniature visual pictures underneath
  const chartDefinitions: {
    id: StandardChartType;
    label: string;
    renderVisualPicture: () => React.ReactNode;
  }[] = [
    {
      id: 'bar',
      label: 'Clustered Bar',
      renderVisualPicture: () => (
        <svg viewBox="0 0 54 30" className="w-full h-7" fill="none" aria-label="Clustered Bar Chart Preview">
          <line x1="4" y1="26" x2="50" y2="26" stroke="#E4E4E7" strokeWidth="1.5" />
          <rect x="7" y="12" width="5" height="14" rx="1" fill="#2563EB" />
          <rect x="13" y="7" width="5" height="19" rx="1" fill="#18181B" />
          <rect x="22" y="16" width="5" height="10" rx="1" fill="#2563EB" />
          <rect x="28" y="10" width="5" height="16" rx="1" fill="#18181B" />
          <rect x="37" y="5" width="5" height="21" rx="1" fill="#2563EB" />
          <rect x="43" y="13" width="5" height="13" rx="1" fill="#18181B" />
        </svg>
      ),
    },
    {
      id: 'stacked_bar',
      label: 'Stacked Bar',
      renderVisualPicture: () => (
        <svg viewBox="0 0 54 30" className="w-full h-7" fill="none" aria-label="Stacked Bar Chart Preview">
          <line x1="4" y1="26" x2="50" y2="26" stroke="#E4E4E7" strokeWidth="1.5" />
          <rect x="8" y="16" width="9" height="10" rx="1" fill="#18181B" />
          <rect x="8" y="7" width="9" height="8" rx="1" fill="#2563EB" />
          <rect x="22" y="14" width="9" height="12" rx="1" fill="#18181B" />
          <rect x="22" y="4" width="9" height="9" rx="1" fill="#2563EB" />
          <rect x="36" y="18" width="9" height="8" rx="1" fill="#18181B" />
          <rect x="36" y="9" width="9" height="8" rx="1" fill="#2563EB" />
        </svg>
      ),
    },
    {
      id: 'line',
      label: 'Trend Line',
      renderVisualPicture: () => (
        <svg viewBox="0 0 54 30" className="w-full h-7" fill="none" aria-label="Trend Line Preview">
          <line x1="4" y1="26" x2="50" y2="26" stroke="#E4E4E7" strokeWidth="1.5" />
          <path d="M 6 21 Q 18 6 30 16 T 48 5" stroke="#2563EB" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="6" cy="21" r="2.5" fill="#18181B" />
          <circle cx="20" cy="11" r="2.5" fill="#18181B" />
          <circle cx="34" cy="15" r="2.5" fill="#18181B" />
          <circle cx="48" cy="5" r="2.5" fill="#18181B" />
        </svg>
      ),
    },
    {
      id: 'area',
      label: 'Area Spline',
      renderVisualPicture: () => (
        <svg viewBox="0 0 54 30" className="w-full h-7" fill="none" aria-label="Area Spline Preview">
          <line x1="4" y1="26" x2="50" y2="26" stroke="#E4E4E7" strokeWidth="1.5" />
          <path d="M 6 22 Q 18 8 30 17 T 48 6 L 48 26 L 6 26 Z" fill="#2563EB" fillOpacity="0.2" />
          <path d="M 6 22 Q 18 8 30 17 T 48 6" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      id: 'scatter',
      label: 'Scatter Plot',
      renderVisualPicture: () => (
        <svg viewBox="0 0 54 30" className="w-full h-7" fill="none" aria-label="Scatter Plot Preview">
          <line x1="4" y1="26" x2="50" y2="26" stroke="#E4E4E7" strokeWidth="1.5" />
          <line x1="4" y1="4" x2="4" y2="26" stroke="#E4E4E7" strokeWidth="1.5" />
          <circle cx="12" cy="19" r="3" fill="#2563EB" />
          <circle cx="19" cy="9" r="3.5" fill="#18181B" />
          <circle cx="28" cy="21" r="2.5" fill="#2563EB" />
          <circle cx="35" cy="7" r="4" fill="#2563EB" />
          <circle cx="41" cy="15" r="3" fill="#18181B" />
          <circle cx="47" cy="8" r="3" fill="#2563EB" />
        </svg>
      ),
    },
    {
      id: 'donut',
      label: 'Donut / Pie',
      renderVisualPicture: () => (
        <svg viewBox="0 0 54 30" className="w-full h-7" fill="none" aria-label="Donut Chart Preview">
          <circle cx="27" cy="15" r="11" stroke="#E4E4E7" strokeWidth="5" />
          <circle
            cx="27"
            cy="15"
            r="11"
            stroke="#2563EB"
            strokeWidth="5"
            strokeDasharray="36 40"
            strokeDashoffset="8"
          />
          <circle
            cx="27"
            cy="15"
            r="11"
            stroke="#18181B"
            strokeWidth="5"
            strokeDasharray="22 54"
            strokeDashoffset="-28"
          />
        </svg>
      ),
    },
    {
      id: 'radar',
      label: 'Radar Axis',
      renderVisualPicture: () => (
        <svg viewBox="0 0 54 30" className="w-full h-7" fill="none" aria-label="Radar Axis Preview">
          <polygon points="27,3 45,11 39,26 15,26 9,11" stroke="#E4E4E7" strokeWidth="1" />
          <polygon points="27,8 40,14 35,23 19,23 14,14" stroke="#E4E4E7" strokeWidth="1" />
          <polygon
            points="27,5 42,12 36,25 18,22 12,13"
            fill="#2563EB"
            fillOpacity="0.2"
            stroke="#2563EB"
            strokeWidth="1.5"
          />
          <circle cx="27" cy="5" r="2" fill="#18181B" />
          <circle cx="42" cy="12" r="2" fill="#18181B" />
          <circle cx="36" cy="25" r="2" fill="#18181B" />
          <circle cx="18" cy="22" r="2" fill="#18181B" />
          <circle cx="12" cy="13" r="2" fill="#18181B" />
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
  const textFill = '#52525B';

  // Custom tooltip
  const CustomChartTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-zinc-200 rounded-lg p-2.5 shadow-xl text-xs z-50">
          <p className="font-bold text-zinc-900 mb-1 border-b border-zinc-100 pb-1">
            {label || payload[0]?.payload?.x}
          </p>
          <div className="space-y-1">
            {payload.map((entry: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between gap-4 text-zinc-800">
                <span className="flex items-center gap-1.5 font-medium text-zinc-600">
                  <span
                    className="w-2.5 h-2.5 rounded-full inline-block"
                    style={{ backgroundColor: entry.color || entry.fill }}
                  />
                  {entry.name}:
                </span>
                <span className="font-bold text-zinc-900">
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
    <div className="flex-1 flex flex-col h-full bg-white p-3 sm:p-5 overflow-y-auto">
      {/* Chart Visual Selection Gallery with Small Pictures Underneath Text Description */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider text-zinc-800">
              Select Chart Visual
            </span>
            <span className="text-[11px] text-zinc-400 hidden sm:inline">
              Click visual template to render
            </span>
          </div>

          {/* Switch: Visual vs Data Table */}
          <div className="flex items-center p-0.5 rounded-lg bg-zinc-100 border border-zinc-200">
            <button
              onClick={() => {
                haptics.tick();
                setActiveTab('visual');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'visual'
                  ? 'bg-white text-zinc-900 shadow-2xs font-bold border border-zinc-200/80'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Canvas</span>
            </button>
            <button
              onClick={() => {
                haptics.tick();
                setActiveTab('table');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'table'
                  ? 'bg-white text-zinc-900 shadow-2xs font-bold border border-zinc-200/80'
                  : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              <span>Data Grid</span>
            </button>
          </div>
        </div>

        {/* Visual Cards Grid: Text description on top, visual picture underneath */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {chartDefinitions.map((cd) => {
            const isSelected = chartType === cd.id;
            return (
              <button
                key={cd.id}
                onClick={() => {
                  haptics.tick();
                  onChangeChartType(cd.id);
                }}
                className={`flex flex-col items-center justify-between p-2 rounded-xl border text-center transition-all cursor-pointer group ${
                  isSelected
                    ? 'border-zinc-900 bg-zinc-50/80 shadow-xs ring-1 ring-zinc-900'
                    : 'border-zinc-200 bg-white hover:border-zinc-400 hover:bg-zinc-50/50'
                }`}
              >
                {/* 1. Text Description */}
                <span
                  className={`text-[11px] font-bold tracking-tight mb-1.5 truncate w-full ${
                    isSelected ? 'text-zinc-900' : 'text-zinc-700'
                  }`}
                >
                  {cd.label}
                </span>

                {/* 2. Visual Picture Underneath */}
                <div className="w-full flex items-center justify-center pt-0.5">
                  {cd.renderVisualPicture()}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* KPI Metric Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-3 shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-zinc-400">Total Aggregate</p>
          <p className="text-xl font-bold text-zinc-900 mt-0.5">
            {totalSum > 1000
              ? totalSum.toLocaleString(undefined, { maximumFractionDigits: 1 })
              : totalSum.toFixed(2)}
          </p>
          <p className="text-[10px] text-zinc-500 font-medium truncate mt-0.5">
            {yFieldLabel}
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-3 shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-zinc-400">Top Category</p>
          <p className="text-xl font-bold text-zinc-900 mt-0.5 truncate">{peakRow.x}</p>
          <p className="text-[10px] text-zinc-500 font-medium truncate mt-0.5">
            Peak: {peakRow.val.toLocaleString()}
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-3 shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-zinc-400">Categories</p>
          <p className="text-xl font-bold text-zinc-900 mt-0.5">{chartData.length}</p>
          <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
            from {totalRowCount} raw records
          </p>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-3 shadow-2xs">
          <p className="text-[10px] uppercase font-bold text-zinc-400">Series Breakdown</p>
          <p className="text-xl font-bold text-zinc-900 mt-0.5 truncate">
            {slots.legend ? slots.legend.field.name : 'Single Series'}
          </p>
          <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
            {legendKeys.length} series plotted
          </p>
        </div>
      </div>

      {/* Main Chart Canvas Area */}
      <div className="flex-1 bg-white border border-zinc-200 rounded-2xl p-4 sm:p-6 shadow-2xs flex flex-col min-h-[420px]">
        {activeTab === 'visual' ? (
          <div className="flex-1 w-full h-[400px] sm:h-[480px]">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
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
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: '500' }} />
                  {legendKeys.map((key, idx) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      fill={CHART_PALETTE[idx % CHART_PALETTE.length]}
                      radius={[4, 4, 0, 0]}
                    />
                  ))}
                </BarChart>
              ) : chartType === 'stacked_bar' ? (
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
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
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: '500' }} />
                  {legendKeys.map((key, idx) => (
                    <Bar
                      key={key}
                      dataKey={key}
                      stackId="a"
                      fill={CHART_PALETTE[idx % CHART_PALETTE.length]}
                      radius={idx === legendKeys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                    />
                  ))}
                </BarChart>
              ) : chartType === 'line' ? (
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
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
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: '500' }} />
                  {legendKeys.map((key, idx) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={CHART_PALETTE[idx % CHART_PALETTE.length]}
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#18181B' }}
                      activeDot={{ r: 6, fill: CHART_PALETTE[idx % CHART_PALETTE.length] }}
                    />
                  ))}
                </LineChart>
              ) : chartType === 'area' ? (
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
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
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '12px', fontWeight: '500' }} />
                  {legendKeys.map((key, idx) => (
                    <Area
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={CHART_PALETTE[idx % CHART_PALETTE.length]}
                      fill={CHART_PALETTE[idx % CHART_PALETTE.length]}
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                  ))}
                </AreaChart>
              ) : chartType === 'scatter' ? (
                <ScatterChart margin={{ top: 20, right: 30, left: 10, bottom: 40 }}>
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
                    fill="#2563EB"
                    stroke="#1D4ED8"
                    strokeWidth={1}
                  />
                </ScatterChart>
              ) : chartType === 'donut' ? (
                <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px', fontWeight: '500' }} />
                  <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="x"
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={120}
                    paddingAngle={3}
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_PALETTE[index % CHART_PALETTE.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              ) : (
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  data={chartData.slice(0, 8)}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <PolarGrid stroke={gridStroke} />
                  <PolarAngleAxis dataKey="x" stroke={textFill} fontSize={11} />
                  <PolarRadiusAxis angle={30} domain={[0, 'auto']} stroke={textFill} fontSize={10} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Radar
                    name={yFieldLabel}
                    dataKey="value"
                    stroke="#2563EB"
                    fill="#2563EB"
                    fillOpacity={0.25}
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

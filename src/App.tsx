/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Dataset,
  StandardSlots,
  WildSlots,
  StandardChartType,
  AppViewMode,
  CustomVariable,
  SlotField,
  Field,
  ChartThemeId,
} from './types';
import {
  INITIAL_DATASETS,
  processChartData,
  parseImportedDataset,
  simulateRealtimeTick,
} from './utils/dataEngine';
import { haptics } from './utils/haptics';
import { Header } from './components/Header';
import { FieldLibrary } from './components/FieldLibrary';
import { SlotDeck } from './components/SlotDeck';
import { ChartCanvas } from './components/ChartCanvas';
import { BananasWildStudio } from './components/BananasWildStudio';
import { CustomVariableBuilder } from './components/CustomVariableBuilder';
import { BarChart3, Sliders, Database, Sparkles } from 'lucide-react';

export interface AppProps {
  initialViewMode?: AppViewMode;
}

export default function App({ initialViewMode = 'standard' }: AppProps = {}) {
  const [allDatasets, setAllDatasets] = useState<Dataset[]>(INITIAL_DATASETS);
  const [currentDataset, setCurrentDataset] = useState<Dataset>(INITIAL_DATASETS[0]);
  const [viewMode, setViewMode] = useState<AppViewMode>(initialViewMode);
  const [slotMode, setSlotMode] = useState<'standard' | 'user_defined'>('standard');
  const [chartType, setChartType] = useState<StandardChartType>('bar');
  const [displayTab, setDisplayTab] = useState<'visual' | 'table'>('visual');
  const [colorTheme, setColorTheme] = useState<ChartThemeId>('ocean');
  const [isRealtimeSync, setIsRealtimeSync] = useState<boolean>(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isHapticsEnabled, setIsHapticsEnabled] = useState<boolean>(true);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);
  const [isCreateVarModalOpen, setIsCreateVarModalOpen] = useState<boolean>(false);
  const [isDraggingFieldId, setIsDraggingFieldId] = useState<string | null>(null);

  // Mobile active panel: 'canvas' | 'slots' | 'fields'
  const [mobileActivePanel, setMobileActivePanel] = useState<'canvas' | 'slots' | 'fields'>('canvas');

  // User-created custom variables
  const [customVariables, setCustomVariables] = useState<CustomVariable[]>([
    {
      id: 'custom_profit_margin',
      name: 'Profit Margin Multiplier',
      expressionType: 'ratio',
      formulaTemplate: '([Profit] / [Sales]) * Multiplier',
      assignedFields: {
        slotA: INITIAL_DATASETS[0].fields.find((f) => f.id === 'profit') || null,
        slotB: INITIAL_DATASETS[0].fields.find((f) => f.id === 'sales') || null,
        slotC: null,
      },
      customMultiplier: 100,
    },
  ]);

  // Standard Power BI assignable slots
  const [standardSlots, setStandardSlots] = useState<StandardSlots>({
    xAxis: { field: INITIAL_DATASETS[0].fields[0], aggregation: 'count' }, // Region
    yAxis: { field: INITIAL_DATASETS[0].fields[5], aggregation: 'sum' }, // Sales
    legend: { field: INITIAL_DATASETS[0].fields[1], aggregation: 'count' }, // Category
    size: { field: INITIAL_DATASETS[0].fields[6], aggregation: 'avg' }, // Profit
    tooltip: null,
  });

  // Bananas Wild special variable slots
  const [wildSlots, setWildSlots] = useState<WildSlots>({
    speedOrFrequency: { field: INITIAL_DATASETS[0].fields[5], aggregation: 'sum' }, // Sales
    coreMassOrAmplitude: { field: INITIAL_DATASETS[0].fields[6], aggregation: 'sum' }, // Profit
    colorSpectrum: { field: INITIAL_DATASETS[0].fields[1], aggregation: 'count' }, // Category
    harmonicDensity: { field: INITIAL_DATASETS[0].fields[7], aggregation: 'avg' }, // Quantity
    customMetricSlot: null,
  });

  // Real-Time Data Synchronization Loop
  useEffect(() => {
    if (!isRealtimeSync) return;

    const interval = setInterval(() => {
      setCurrentDataset((prev) => simulateRealtimeTick(prev));
    }, 1800);

    return () => clearInterval(interval);
  }, [isRealtimeSync]);

  // Reset standard slots when dataset changes if fields don't exist
  const handleSelectDataset = (dataset: Dataset) => {
    setCurrentDataset(dataset);
    const firstDim = dataset.fields.find((f) => f.role === 'dimension') || dataset.fields[0];
    const firstMeas = dataset.fields.find((f) => f.role === 'measure') || dataset.fields[1] || dataset.fields[0];
    const secondDim = dataset.fields.filter((f) => f.role === 'dimension')[1] || null;
    const secondMeas = dataset.fields.filter((f) => f.role === 'measure')[1] || null;

    setStandardSlots({
      xAxis: { field: firstDim, aggregation: 'count' },
      yAxis: { field: firstMeas, aggregation: 'sum' },
      legend: secondDim ? { field: secondDim, aggregation: 'count' } : null,
      size: secondMeas ? { field: secondMeas, aggregation: 'avg' } : null,
      tooltip: null,
    });

    setWildSlots({
      speedOrFrequency: { field: firstMeas, aggregation: 'sum' },
      coreMassOrAmplitude: secondMeas ? { field: secondMeas, aggregation: 'sum' } : { field: firstMeas, aggregation: 'sum' },
      colorSpectrum: { field: firstDim, aggregation: 'count' },
      harmonicDensity: dataset.fields.filter((f) => f.role === 'measure')[2] ? { field: dataset.fields.filter((f) => f.role === 'measure')[2], aggregation: 'avg' } : { field: firstMeas, aggregation: 'avg' },
      customMetricSlot: null,
    });
  };

  // Process standard chart dataset
  const processedData = useMemo(() => {
    return processChartData(
      currentDataset.data,
      standardSlots.xAxis,
      standardSlots.yAxis,
      standardSlots.legend,
      standardSlots.size,
      customVariables
    );
  }, [currentDataset.data, standardSlots, customVariables]);

  // Handle CSV/JSON import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = parseImportedDataset(file.name, content);
      if (parsed) {
        haptics.bananas();
        setAllDatasets((prev) => [parsed, ...prev]);
        handleSelectDataset(parsed);
      } else {
        alert('Could not parse file. Please upload a valid CSV or JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Slot updates
  const handleUpdateStandardSlot = (slotName: keyof StandardSlots, slotField: SlotField | null) => {
    setStandardSlots((prev) => ({
      ...prev,
      [slotName]: slotField,
    }));
  };

  const handleUpdateWildSlot = (slotName: keyof WildSlots, slotField: SlotField | null) => {
    setWildSlots((prev) => ({
      ...prev,
      [slotName]: slotField,
    }));
  };

  const handleClearAllSlots = () => {
    if (slotMode === 'standard') {
      setStandardSlots({
        xAxis: null,
        yAxis: null,
        legend: null,
        size: null,
        tooltip: null,
      });
    } else {
      setWildSlots({
        speedOrFrequency: null,
        coreMassOrAmplitude: null,
        colorSpectrum: null,
        harmonicDensity: null,
        customMetricSlot: null,
      });
    }
  };

  // Quick field assignment from field menu (for mobile or fast desktop)
  const handleQuickAssignField = (
    field: Field,
    targetSlot: 'xAxis' | 'yAxis' | 'legend' | 'size' | 'wildSpeed' | 'wildMass' | 'wildColor'
  ) => {
    haptics.snap();
    if (targetSlot === 'xAxis') {
      handleUpdateStandardSlot('xAxis', { field, aggregation: 'count' });
    } else if (targetSlot === 'yAxis') {
      handleUpdateStandardSlot('yAxis', { field, aggregation: field.role === 'measure' ? 'sum' : 'count' });
    } else if (targetSlot === 'legend') {
      handleUpdateStandardSlot('legend', { field, aggregation: 'count' });
    } else if (targetSlot === 'size') {
      handleUpdateStandardSlot('size', { field, aggregation: 'avg' });
    } else if (targetSlot === 'wildSpeed') {
      handleUpdateWildSlot('speedOrFrequency', { field, aggregation: 'sum' });
    } else if (targetSlot === 'wildMass') {
      handleUpdateWildSlot('coreMassOrAmplitude', { field, aggregation: 'sum' });
    } else if (targetSlot === 'wildColor') {
      handleUpdateWildSlot('colorSpectrum', { field, aggregation: 'count' });
    }
  };

  const handleSaveCustomVariable = (newVar: CustomVariable) => {
    setCustomVariables((prev) => [newVar, ...prev]);
    // Also assign as default to customMetricSlot in Wild view
    handleUpdateWildSlot('customMetricSlot', {
      field: {
        id: newVar.id,
        name: newVar.name,
        dataType: 'number',
        role: 'measure',
        isCustom: true,
      },
      aggregation: 'sum',
    });
  };

  // All combined fields including custom calculated variables
  const combinedAvailableFields: Field[] = [
    ...currentDataset.fields,
    ...customVariables.map((cv) => ({
      id: cv.id,
      name: cv.name,
      dataType: 'number' as const,
      role: 'measure' as const,
      isCustom: true,
    })),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900 font-sans selection:bg-zinc-200 selection:text-zinc-900">
      {/* Top Header */}
      <Header
        currentDataset={currentDataset}
        allDatasets={allDatasets}
        onSelectDataset={handleSelectDataset}
        onFileUpload={handleFileUpload}
        viewMode={viewMode}
        onToggleViewMode={setViewMode}
        activeDisplayTab={displayTab}
        onChangeDisplayTab={setDisplayTab}
        isRealtimeSync={isRealtimeSync}
        onToggleRealtimeSync={() => setIsRealtimeSync(!isRealtimeSync)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isHapticsEnabled={isHapticsEnabled}
        onToggleHaptics={() => {
          haptics.enabled = !isHapticsEnabled;
          setIsHapticsEnabled(!isHapticsEnabled);
        }}
        onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)}
      />

      {/* Mobile Responsive Sub-Nav Bar (phone/tablet) */}
      <div className="lg:hidden flex items-center justify-around border-b border-zinc-200 bg-zinc-50 px-2 py-1.5 text-xs">
        <button
          onClick={() => setMobileActivePanel('canvas')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
            mobileActivePanel === 'canvas'
              ? 'bg-zinc-900 text-white shadow-2xs font-bold'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Visualization</span>
        </button>
        <button
          onClick={() => setMobileActivePanel('slots')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
            mobileActivePanel === 'slots'
              ? 'bg-zinc-900 text-white shadow-2xs font-bold'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Value Slots</span>
        </button>
        <button
          onClick={() => setMobileActivePanel('fields')}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-all ${
            mobileActivePanel === 'fields'
              ? 'bg-zinc-900 text-white shadow-2xs font-bold'
              : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Fields ({combinedAvailableFields.length})</span>
        </button>
      </div>

      {/*
        Main Three-Column Workspace Layout as Requested:
        Left: Visualization Canvas
        Middle: Value Slots (stacked vertically, with User-Defined toggle)
        Right: Field Library
      */}
      <div className="flex-1 flex overflow-hidden bg-white">
        {/*
          1. VISUALIZATION ON LEFT
        */}
        <main
          className={`flex-1 flex flex-col h-[calc(100vh-53px)] overflow-hidden bg-white min-w-0 ${
            mobileActivePanel !== 'canvas' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {viewMode === 'standard' ? (
            <ChartCanvas
              chartData={processedData.chartData}
              legendKeys={processedData.legendKeys}
              yFieldLabel={processedData.yFieldLabel}
              slots={standardSlots}
              chartType={chartType}
              onChangeChartType={setChartType}
              isDarkMode={isDarkMode}
              totalRowCount={currentDataset.data.length}
              activeTab={displayTab}
              onChangeTab={setDisplayTab}
              colorTheme={colorTheme}
              onChangeColorTheme={setColorTheme}
            />
          ) : (
            <BananasWildStudio
              rawData={currentDataset.data}
              fields={combinedAvailableFields}
              customVariables={customVariables}
              wildSlots={wildSlots}
              onUpdateWildSlot={handleUpdateWildSlot}
              onOpenCreateVariableModal={() => setIsCreateVarModalOpen(true)}
              isDarkMode={isDarkMode}
            />
          )}
        </main>

        {/*
          2. VALUE SLOTS STACKED VERTICALLY (Just to left of Field Library)
          Contains toggle button for User Defined Variable Slots
        */}
        <section
          className={`w-full lg:w-64 xl:w-72 2xl:w-80 shrink-0 h-[calc(100vh-53px)] border-l border-zinc-200 bg-white flex flex-col overflow-hidden ${
            mobileActivePanel !== 'slots' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <SlotDeck
            standardSlots={standardSlots}
            wildSlots={wildSlots}
            slotMode={slotMode}
            onToggleSlotMode={setSlotMode}
            onUpdateStandardSlot={handleUpdateStandardSlot}
            onUpdateWildSlot={handleUpdateWildSlot}
            onClearAllSlots={handleClearAllSlots}
            availableFields={combinedAvailableFields}
            customVariables={customVariables}
            onOpenCreateVariableModal={() => setIsCreateVarModalOpen(true)}
          />
        </section>

        {/*
          3. LIST OF FIELDS ON RIGHT SIDE
        */}
        <aside
          className={`w-full lg:w-64 xl:w-72 2xl:w-80 shrink-0 h-[calc(100vh-53px)] border-l border-zinc-200 bg-white flex flex-col overflow-hidden ${
            mobileActivePanel !== 'fields' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          <FieldLibrary
            fields={currentDataset.fields}
            customVariables={customVariables}
            onOpenCreateVariableModal={() => setIsCreateVarModalOpen(true)}
            onQuickAssignField={handleQuickAssignField}
            isDraggingFieldId={isDraggingFieldId}
            setIsDraggingFieldId={setIsDraggingFieldId}
          />
        </aside>
      </div>

      {/* User Custom Variable Builder Modal */}
      <CustomVariableBuilder
        isOpen={isCreateVarModalOpen}
        onClose={() => setIsCreateVarModalOpen(false)}
        onSaveVariable={handleSaveCustomVariable}
        availableFields={currentDataset.fields}
        sampleData={currentDataset.data}
      />
    </div>
  );
}

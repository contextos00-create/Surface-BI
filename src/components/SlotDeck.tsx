import React, { useState } from 'react';
import {
  X,
  ChevronDown,
  Hash,
  Type,
  Sparkles,
  ArrowRightLeft,
  Trash2,
  PlusCircle,
  Sliders,
  Variable,
  Layers,
  Plus,
  Zap,
} from 'lucide-react';
import {
  Field,
  SlotField,
  StandardSlots,
  WildSlots,
  AggregationType,
  CustomVariable,
} from '../types';
import { haptics } from '../utils/haptics';

interface SlotDeckProps {
  standardSlots: StandardSlots;
  wildSlots: WildSlots;
  slotMode: 'standard' | 'user_defined';
  onToggleSlotMode: (mode: 'standard' | 'user_defined') => void;
  onUpdateStandardSlot: (slotName: keyof StandardSlots, slotField: SlotField | null) => void;
  onUpdateWildSlot: (slotName: keyof WildSlots, slotField: SlotField | null) => void;
  onClearAllSlots: () => void;
  availableFields: Field[];
  customVariables: CustomVariable[];
  onOpenCreateVariableModal: () => void;
}

export const SlotDeck: React.FC<SlotDeckProps> = ({
  standardSlots,
  wildSlots,
  slotMode,
  onToggleSlotMode,
  onUpdateStandardSlot,
  onUpdateWildSlot,
  onClearAllSlots,
  availableFields,
  customVariables,
  onOpenCreateVariableModal,
}) => {
  const [activeDragSlot, setActiveDragSlot] = useState<string | null>(null);
  const [activePickerSlot, setActivePickerSlot] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent, slotName: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (activeDragSlot !== slotName) {
      setActiveDragSlot(slotName);
    }
  };

  const handleDragLeave = (slotName: string) => {
    if (activeDragSlot === slotName) {
      setActiveDragSlot(null);
    }
  };

  const handleDrop = (e: React.DragEvent, slotName: string, isWild: boolean) => {
    e.preventDefault();
    setActiveDragSlot(null);
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const field: Field = JSON.parse(dataStr);
      haptics.snap();

      if (isWild) {
        onUpdateWildSlot(slotName as keyof WildSlots, {
          field,
          aggregation: field.role === 'measure' ? 'sum' : 'count',
        });
      } else {
        const defaultAgg: AggregationType = field.role === 'measure' ? 'sum' : 'count';
        onUpdateStandardSlot(slotName as keyof StandardSlots, {
          field,
          aggregation: defaultAgg,
        });
      }
    } catch (err) {
      console.error('Failed to parse dropped field:', err);
    }
  };

  const handleSelectFieldFromPicker = (
    slotName: string,
    field: Field,
    isWild: boolean
  ) => {
    haptics.snap();
    if (isWild) {
      onUpdateWildSlot(slotName as keyof WildSlots, {
        field,
        aggregation: field.role === 'measure' ? 'sum' : 'count',
      });
    } else {
      const defaultAgg: AggregationType = field.role === 'measure' ? 'sum' : 'count';
      onUpdateStandardSlot(slotName as keyof StandardSlots, {
        field,
        aggregation: defaultAgg,
      });
    }
    setActivePickerSlot(null);
  };

  const handleSwapXY = () => {
    haptics.tick();
    const tempX = standardSlots.xAxis;
    onUpdateStandardSlot('xAxis', standardSlots.yAxis);
    onUpdateStandardSlot('yAxis', tempX);
  };

  const standardSlotConfigs: {
    key: keyof StandardSlots;
    label: string;
    description: string;
    recommendedRole: string;
  }[] = [
    {
      key: 'xAxis',
      label: 'X-Axis (Categories / Time)',
      description: 'Primary categorical breakdown or time series',
      recommendedRole: 'Dimension',
    },
    {
      key: 'yAxis',
      label: 'Y-Axis (Values / Metrics)',
      description: 'Numeric measure for heights, coordinates, lengths',
      recommendedRole: 'Measure',
    },
    {
      key: 'legend',
      label: 'Legend / Grouping',
      description: 'Secondary dimension splitting series and colors',
      recommendedRole: 'Dimension',
    },
    {
      key: 'size',
      label: 'Size / Weight (Secondary)',
      description: 'Bubble radii, scatter weights, line thicknesses',
      recommendedRole: 'Measure',
    },
    {
      key: 'tooltip',
      label: 'Tooltip Info',
      description: 'Hover telemetry payload for inspectors',
      recommendedRole: 'Any Field',
    },
  ];

  const wildSlotConfigs: {
    key: keyof WildSlots;
    label: string;
    description: string;
    recommendedRole: string;
  }[] = [
    {
      key: 'speedOrFrequency',
      label: 'Wild: Velocity / Frequency',
      description: 'Orbital velocity and wave frequency',
      recommendedRole: 'Measure / Formula',
    },
    {
      key: 'coreMassOrAmplitude',
      label: 'Wild: Core Mass / Height',
      description: 'Particle node mass and pulse amplitude',
      recommendedRole: 'Measure / Formula',
    },
    {
      key: 'colorSpectrum',
      label: 'Wild: Spectrum Modulator',
      description: 'Dimensional clustering and hues',
      recommendedRole: 'Dimension',
    },
    {
      key: 'harmonicDensity',
      label: 'Wild: Harmonic Density',
      description: 'Petal count and wave polygon vertices',
      recommendedRole: 'Measure / Formula',
    },
    {
      key: 'customMetricSlot',
      label: 'Wild: User Formula Slot',
      description: 'Your custom mathematical formula variable',
      recommendedRole: 'Custom Formula',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-zinc-200">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#FF7A59]/10 text-[#FF7A59] flex items-center justify-center border border-[#FF7A59]/25">
              <Sliders className="w-3 h-3 text-[#FF7A59]" />
            </div>
            <h2 className="text-xs uppercase tracking-wider font-bold text-zinc-800">
              Value Wells & Slots
            </h2>
          </div>

          <div className="flex items-center gap-1">
            {slotMode === 'standard' && (
              <button
                id="swap-xy-btn"
                onClick={handleSwapXY}
                title="Swap X & Y Axes"
                className="p-1 rounded text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              id="clear-all-slots-btn"
              onClick={() => {
                haptics.remove();
                onClearAllSlots();
              }}
              title="Clear All Slots"
              className="p-1 rounded text-zinc-400 hover:text-red-600 hover:bg-zinc-100 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Visible Button / Toggle between Standard and User-Defined variable slots */}
        <div>
          <div className="text-[10px] uppercase font-bold text-zinc-400 mb-1.5">
            Slot Architecture Mode:
          </div>
          <div className="grid grid-cols-2 p-0.5 rounded-lg bg-zinc-100 border border-zinc-200">
            <button
              id="slot-mode-standard-toggle"
              type="button"
              onClick={() => {
                haptics.tick();
                onToggleSlotMode('standard');
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs transition-all cursor-pointer ${
                slotMode === 'standard'
                  ? 'bg-white text-zinc-900 shadow-2xs font-bold border border-zinc-200/80'
                  : 'text-zinc-600 hover:text-zinc-900 font-medium'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Standard XY</span>
            </button>

            <button
              id="slot-mode-wild-toggle"
              type="button"
              onClick={() => {
                haptics.bananas();
                onToggleSlotMode('user_defined');
              }}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-md text-xs transition-all cursor-pointer ${
                slotMode === 'user_defined'
                  ? 'bg-white text-zinc-900 shadow-2xs font-bold border border-zinc-200/80'
                  : 'text-zinc-600 hover:text-zinc-900 font-medium'
              }`}
            >
              <Variable className="w-3.5 h-3.5" />
              <span>User Defined</span>
            </button>
          </div>
        </div>
      </div>

      {/* User-Defined Mode Quick Banner & Action */}
      {slotMode === 'user_defined' && (
        <div className="p-3 bg-zinc-50 border-b border-zinc-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold text-zinc-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-zinc-500" />
              User Variables ({customVariables.length})
            </span>
            {/* Key Button: "+ New Formula" */}
            <button
              onClick={() => {
                haptics.tick();
                onOpenCreateVariableModal();
              }}
              className="text-[11px] font-bold text-white bg-[#FF5A36] hover:bg-[#E04826] px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>New Formula</span>
            </button>
          </div>

          {/* Quick chip selector for user defined formulas */}
          <div className="flex flex-wrap gap-1.5">
            {customVariables.map((cv) => (
              <button
                key={cv.id}
                onClick={() => {
                  haptics.snap();
                  onUpdateWildSlot('customMetricSlot', {
                    field: {
                      id: cv.id,
                      name: cv.name,
                      dataType: 'number',
                      role: 'measure',
                      isCustom: true,
                    },
                    aggregation: 'sum',
                  });
                }}
                className="text-[10px] font-medium bg-white border border-zinc-200 hover:border-zinc-400 text-zinc-800 px-2 py-1 rounded-md flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                title={`Click to assign ${cv.name} into Formula Slot`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                <span className="truncate max-w-[150px]">{cv.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Vertically Stacked Slots List */}
      <div className="flex-1 p-3.5 space-y-2.5 overflow-y-auto">
        <div className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 mb-1">
          {slotMode === 'standard' ? 'Standard Value Wells' : 'User-Defined Parameter Wells'}
        </div>

        {(slotMode === 'standard' ? standardSlotConfigs : wildSlotConfigs).map((config) => {
          const isWild = slotMode === 'user_defined';
          const currentSlot: SlotField | null = isWild
            ? (wildSlots[config.key as keyof WildSlots] ?? null)
            : (standardSlots[config.key as keyof StandardSlots] ?? null);
          const isOver = activeDragSlot === config.key;

          return (
            <div
              key={config.key}
              onDragOver={(e) => handleDragOver(e, config.key)}
              onDragLeave={() => handleDragLeave(config.key)}
              onDrop={(e) => handleDrop(e, config.key, isWild)}
              className={`relative rounded-xl border p-2.5 transition-all flex flex-col justify-between ${
                isOver
                  ? 'border-dashed border-zinc-600 bg-zinc-50'
                  : currentSlot
                  ? 'bg-zinc-50/70 border-zinc-200'
                  : 'bg-white border-dashed border-zinc-300 hover:border-zinc-400'
              }`}
            >
              {/* Slot Header */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-zinc-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                  {config.label}
                </span>
                <span className="text-[10px] uppercase font-semibold text-zinc-400">
                  {config.recommendedRole}
                </span>
              </div>

              {/* Slot Content */}
              {currentSlot ? (
                <div className="flex items-center justify-between gap-1.5 bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 shadow-2xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {currentSlot.field.isCustom ? (
                      <Sparkles className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    ) : currentSlot.field.role === 'measure' ? (
                      <Hash className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    ) : (
                      <Type className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                    )}
                    <span className="text-xs font-semibold text-zinc-900 truncate">
                      {currentSlot.field.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Aggregation Selector for Measures */}
                    {(!isWild && (config.key === 'yAxis' || config.key === 'size')) && (
                      <select
                        value={currentSlot.aggregation || 'sum'}
                        onChange={(e) => {
                          haptics.tick();
                          onUpdateStandardSlot(config.key as keyof StandardSlots, {
                            ...currentSlot,
                            aggregation: e.target.value as AggregationType,
                          });
                        }}
                        className="text-[10px] font-semibold bg-zinc-50 border border-zinc-200 rounded px-1.5 py-0.5 text-zinc-700 cursor-pointer focus:outline-hidden"
                      >
                        <option value="sum">SUM</option>
                        <option value="avg">AVG</option>
                        <option value="count">COUNT</option>
                        <option value="min">MIN</option>
                        <option value="max">MAX</option>
                      </select>
                    )}

                    {/* Remove Field from Slot */}
                    <button
                      type="button"
                      onClick={() => {
                        haptics.remove();
                        if (isWild) {
                          onUpdateWildSlot(config.key as keyof WildSlots, null);
                        } else {
                          onUpdateStandardSlot(config.key as keyof StandardSlots, null);
                        }
                      }}
                      className="p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-zinc-100 transition-colors"
                      title="Clear this field slot"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty Slot Target & Click Picker */
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      haptics.tick();
                      setActivePickerSlot(
                        activePickerSlot === config.key ? null : config.key
                      );
                    }}
                    className="w-full py-1.5 border border-dashed border-zinc-200 hover:border-zinc-400 rounded-lg text-[11px] text-zinc-400 hover:text-zinc-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <PlusCircle className="w-3 h-3" />
                    <span>Drop field or click to assign</span>
                  </button>

                  {/* Dropdown field selector if clicked */}
                  {activePickerSlot === config.key && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-30 bg-white border border-zinc-200 rounded-xl shadow-xl p-1 max-h-48 overflow-y-auto">
                      <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-100 mb-1">
                        Select Field from Library
                      </div>
                      <div className="space-y-0.5">
                        {availableFields.map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() =>
                              handleSelectFieldFromPicker(config.key, f, isWild)
                            }
                            className="w-full text-left px-2 py-1 rounded hover:bg-zinc-100 text-xs font-medium text-zinc-800 flex items-center justify-between truncate"
                          >
                            <span className="truncate">{f.name}</span>
                            <span className="text-[10px] text-zinc-400 ml-1 shrink-0 uppercase">
                              {f.role}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

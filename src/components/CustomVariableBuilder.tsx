import React, { useState } from 'react';
import {
  X,
  Sparkles,
} from 'lucide-react';
import { Field, CustomVariable } from '../types';
import { evaluateCustomVariable } from '../utils/dataEngine';
import { haptics } from '../utils/haptics';

interface CustomVariableBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveVariable: (variable: CustomVariable) => void;
  availableFields: Field[];
  sampleData: Record<string, any>[];
}

export const CustomVariableBuilder: React.FC<CustomVariableBuilderProps> = ({
  isOpen,
  onClose,
  onSaveVariable,
  availableFields,
  sampleData,
}) => {
  const [name, setName] = useState('Quantum Velocity Flux');
  const [expressionType, setExpressionType] = useState<CustomVariable['expressionType']>('chaos_index');
  const [slotA, setSlotA] = useState<Field | null>(
    availableFields.find((f) => f.role === 'measure') || null
  );
  const [slotB, setSlotB] = useState<Field | null>(
    availableFields.filter((f) => f.role === 'measure')[1] || null
  );
  const [slotC, setSlotC] = useState<Field | null>(
    availableFields.filter((f) => f.role === 'measure')[2] || null
  );
  const [multiplier, setMultiplier] = useState<number>(1.5);

  if (!isOpen) return null;

  const currentVariable: CustomVariable = {
    id: `custom_${Date.now()}`,
    name: name.trim() || 'Custom Variable',
    expressionType,
    formulaTemplate:
      expressionType === 'ratio'
        ? '([Slot A] / [Slot B]) * Multiplier'
        : expressionType === 'exponential'
        ? '([Slot A] ^ 1.15) * ([Slot B] / 100)'
        : expressionType === 'chaos_index'
        ? 'sin([Slot A]) * sqrt([Slot B]) * 10 + [Slot C]'
        : '([Slot A] * 1.5 + [Slot B] * 0.8 + [Slot C] * 0.2)',
    assignedFields: {
      slotA,
      slotB,
      slotC,
    },
    customMultiplier: multiplier,
  };

  // Compute preview for top 3 records
  const previewValues = sampleData.slice(0, 3).map((row, idx) => ({
    rowIdx: idx + 1,
    rowSample: row,
    computed: evaluateCustomVariable(currentVariable, row),
  }));

  const handleSave = () => {
    haptics.bananas();
    onSaveVariable(currentVariable);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-200 bg-white">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-100 text-zinc-700 flex items-center justify-center border border-zinc-200">
              <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900">
                Custom Variable Formula Lab
              </h3>
              <p className="text-[11px] text-zinc-500 font-normal">
                Map dataset fields to custom user-defined formula slots
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              haptics.remove();
              onClose();
            }}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-xs bg-white">
          {/* Variable Name */}
          <div>
            <label className="block font-bold text-zinc-800 mb-1">
              Variable Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Warp Surge Ratio, Efficiency Score"
              className="w-full px-3 py-2 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 font-medium text-zinc-900"
            />
          </div>

          {/* Mathematical Model Archetype */}
          <div>
            <label className="block font-bold text-zinc-800 mb-1.5">
              Formula Archetype
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  haptics.tick();
                  setExpressionType('chaos_index');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  expressionType === 'chaos_index'
                    ? 'border-zinc-900 bg-zinc-50 shadow-2xs ring-1 ring-zinc-900 font-bold'
                    : 'border-zinc-200 hover:border-zinc-400 text-zinc-600'
                }`}
              >
                <div className="font-bold text-xs mb-0.5 text-zinc-900">Chaos Wave Function</div>
                <div className="text-[10px] text-zinc-500">sin(A) * sqrt(B) + C</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  haptics.tick();
                  setExpressionType('ratio');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  expressionType === 'ratio'
                    ? 'border-zinc-900 bg-zinc-50 shadow-2xs ring-1 ring-zinc-900 font-bold'
                    : 'border-zinc-200 hover:border-zinc-400 text-zinc-600'
                }`}
              >
                <div className="font-bold text-xs mb-0.5 text-zinc-900">Ratio / Quotient</div>
                <div className="text-[10px] text-zinc-500">(Field A / Field B) * M</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  haptics.tick();
                  setExpressionType('exponential');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  expressionType === 'exponential'
                    ? 'border-zinc-900 bg-zinc-50 shadow-2xs ring-1 ring-zinc-900 font-bold'
                    : 'border-zinc-200 hover:border-zinc-400 text-zinc-600'
                }`}
              >
                <div className="font-bold text-xs mb-0.5 text-zinc-900">Power Surge Curve</div>
                <div className="text-[10px] text-zinc-500">(Field A ^ 1.15) * B</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  haptics.tick();
                  setExpressionType('custom_math');
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  expressionType === 'custom_math'
                    ? 'border-zinc-900 bg-zinc-50 shadow-2xs ring-1 ring-zinc-900 font-bold'
                    : 'border-zinc-200 hover:border-zinc-400 text-zinc-600'
                }`}
              >
                <div className="font-bold text-xs mb-0.5 text-zinc-900">Weighted Polynomial</div>
                <div className="text-[10px] text-zinc-500">1.5A + 0.8B + 0.2C</div>
              </button>
            </div>
          </div>

          {/* Assigned Field Slots */}
          <div className="space-y-2.5 bg-zinc-50 p-3 rounded-xl border border-zinc-200">
            <div className="font-bold text-zinc-800 text-xs">
              Assign Library Fields to Formula Slots:
            </div>

            {/* Slot A */}
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium text-zinc-600 w-16">Slot A:</span>
              <select
                value={slotA?.id || ''}
                onChange={(e) => {
                  haptics.tick();
                  const found = availableFields.find((f) => f.id === e.target.value) || null;
                  setSlotA(found);
                }}
                className="flex-1 bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 font-medium"
              >
                <option value="">-- Select Field A --</option>
                {availableFields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Slot B */}
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium text-zinc-600 w-16">Slot B:</span>
              <select
                value={slotB?.id || ''}
                onChange={(e) => {
                  haptics.tick();
                  const found = availableFields.find((f) => f.id === e.target.value) || null;
                  setSlotB(found);
                }}
                className="flex-1 bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 font-medium"
              >
                <option value="">-- Select Field B --</option>
                {availableFields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Slot C */}
            <div className="flex items-center justify-between gap-3">
              <span className="font-medium text-zinc-600 w-16">Slot C:</span>
              <select
                value={slotC?.id || ''}
                onChange={(e) => {
                  haptics.tick();
                  const found = availableFields.find((f) => f.id === e.target.value) || null;
                  setSlotC(found);
                }}
                className="flex-1 bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 font-medium"
              >
                <option value="">-- Select Field C --</option>
                {availableFields.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.role})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Gain Multiplier Slider */}
          <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200">
            <div className="font-bold text-zinc-800 text-xs mb-1.5">
              Output Multiplier Factor
            </div>
            <div className="flex items-center justify-between gap-3 pt-1">
              <span className="font-medium text-zinc-600 w-16">Gain:</span>
              <input
                type="range"
                min="0.1"
                max="5.0"
                step="0.1"
                value={multiplier}
                onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                className="flex-1 accent-zinc-800"
              />
              <span className="w-10 text-right font-mono font-bold text-zinc-900">
                {multiplier.toFixed(1)}x
              </span>
            </div>
          </div>

          {/* Live Preview Strip */}
          <div>
            <div className="font-bold text-zinc-800 mb-1.5">
              Live Preview Evaluator (Sample Top 3 Records)
            </div>
            <div className="grid grid-cols-3 gap-2">
              {previewValues.map((pv) => (
                <div
                  key={pv.rowIdx}
                  className="bg-zinc-50 p-2.5 rounded-lg border border-zinc-200 text-center"
                >
                  <p className="text-[10px] font-semibold text-zinc-400">Record #{pv.rowIdx}</p>
                  <p className="text-sm font-bold text-zinc-900 font-mono mt-0.5">
                    {pv.computed}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer with Key Coral Button */}
        <div className="p-4 border-t border-zinc-200 bg-white flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-zinc-600 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          {/* Key Button: Save & Add to Library */}
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-bold rounded-lg bg-[#FF5A36] hover:bg-[#E04826] text-white transition-colors shadow-xs cursor-pointer"
          >
            Save & Add to Library
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Hash,
  Type,
  Calendar,
  Sparkles,
  Search,
  GripVertical,
  Sliders,
  MoreVertical,
} from 'lucide-react';
import { Field, CustomVariable } from '../types';
import { haptics } from '../utils/haptics';

interface FieldLibraryProps {
  fields: Field[];
  customVariables: CustomVariable[];
  onOpenCreateVariableModal: () => void;
  onQuickAssignField: (
    field: Field,
    slot: 'xAxis' | 'yAxis' | 'legend' | 'size' | 'wildSpeed' | 'wildMass' | 'wildColor'
  ) => void;
  isDraggingFieldId: string | null;
  setIsDraggingFieldId: (id: string | null) => void;
}

export const FieldLibrary: React.FC<FieldLibraryProps> = ({
  fields,
  customVariables,
  onOpenCreateVariableModal,
  onQuickAssignField,
  isDraggingFieldId,
  setIsDraggingFieldId,
}) => {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'dimensions' | 'measures' | 'custom'>('all');
  const [activeMenuFieldId, setActiveMenuFieldId] = useState<string | null>(null);

  // Combine standard fields with custom calculated variables converted to fields
  const allFields: Field[] = [
    ...fields,
    ...customVariables.map((cv) => ({
      id: cv.id,
      name: cv.name,
      dataType: 'number' as const,
      role: 'measure' as const,
      isCustom: true,
      description: `Formula: ${cv.expressionType} (x${cv.customMultiplier})`,
    })),
  ];

  const filteredFields = allFields.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.id.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;
    if (activeTab === 'dimensions') return f.role === 'dimension';
    if (activeTab === 'measures') return f.role === 'measure' && !f.isCustom;
    if (activeTab === 'custom') return f.isCustom;
    return true;
  });

  const handleDragStart = (e: React.DragEvent, field: Field) => {
    haptics.tick();
    setIsDraggingFieldId(field.id);
    e.dataTransfer.setData('text/plain', JSON.stringify(field));
    e.dataTransfer.effectAllowed = 'copyMove';
  };

  const handleDragEnd = () => {
    setIsDraggingFieldId(null);
  };

  return (
    <div className="flex flex-col h-full bg-white select-none">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-zinc-200">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-zinc-100 text-zinc-700 flex items-center justify-center border border-zinc-200">
              <Sliders className="w-3 h-3 text-zinc-600" />
            </div>
            <h2 className="text-xs uppercase tracking-wider font-bold text-zinc-800">
              Field Library
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full border border-zinc-200">
            {allFields.length}
          </span>
        </div>

        {/* Search Input */}
        <div className="relative mb-2.5">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-400" />
          <input
            id="field-search-input"
            type="text"
            placeholder="Search fields or metrics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200 focus:outline-hidden focus:ring-1 focus:ring-zinc-900 text-zinc-800 placeholder:text-zinc-400 font-medium"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-600 overflow-x-auto pb-1">
          <button
            onClick={() => {
              haptics.tick();
              setActiveTab('all');
            }}
            className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'hover:bg-zinc-100 text-zinc-600'
            }`}
          >
            All
          </button>
          <button
            onClick={() => {
              haptics.tick();
              setActiveTab('dimensions');
            }}
            className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'dimensions'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'hover:bg-zinc-100 text-zinc-600'
            }`}
          >
            Dimensions
          </button>
          <button
            onClick={() => {
              haptics.tick();
              setActiveTab('measures');
            }}
            className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'measures'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'hover:bg-zinc-100 text-zinc-600'
            }`}
          >
            Measures
          </button>
          <button
            onClick={() => {
              haptics.tick();
              setActiveTab('custom');
            }}
            className={`px-2 py-1 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'custom'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'hover:bg-zinc-100 text-zinc-600'
            }`}
          >
            Custom ({customVariables.length})
          </button>
        </div>
      </div>

      {/* Field Item List */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
        {filteredFields.map((field) => {
          const isNumeric = field.role === 'measure';
          const isCustom = field.isCustom;
          const isDragging = isDraggingFieldId === field.id;

          return (
            <div
              key={field.id}
              draggable
              onDragStart={(e) => handleDragStart(e, field)}
              onDragEnd={handleDragEnd}
              className={`group relative flex items-center justify-between p-2 rounded-lg border transition-all cursor-grab active:cursor-grabbing select-none ${
                isDragging
                  ? 'opacity-40 border-dashed border-zinc-400 bg-zinc-100'
                  : 'bg-white border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50/60'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <GripVertical className="w-3.5 h-3.5 text-zinc-300 group-hover:text-zinc-600 shrink-0" />

                {/* Role Icon */}
                <div className="w-6 h-6 rounded flex items-center justify-center shrink-0 text-xs bg-zinc-100 text-zinc-700 border border-zinc-200">
                  {isCustom ? (
                    <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
                  ) : isNumeric ? (
                    <Hash className="w-3.5 h-3.5 text-zinc-700" />
                  ) : field.dataType === 'date' ? (
                    <Calendar className="w-3.5 h-3.5 text-zinc-700" />
                  ) : (
                    <Type className="w-3.5 h-3.5 text-zinc-700" />
                  )}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-semibold text-zinc-900 truncate">{field.name}</p>
                    {isCustom && (
                      <span className="text-[9px] font-semibold uppercase px-1 py-0.2 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
                        Formula
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-500 truncate font-normal">
                    {field.description || `${field.role} • ${field.dataType}`}
                  </p>
                </div>
              </div>

              {/* Quick Assign Menu Button */}
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    haptics.tick();
                    setActiveMenuFieldId(activeMenuFieldId === field.id ? null : field.id);
                  }}
                  title="Quick Assign to Slot"
                  className="p-1 rounded text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>

                {activeMenuFieldId === field.id && (
                  <div className="absolute right-0 top-6 z-50 w-44 bg-white border border-zinc-200 rounded-lg shadow-xl p-1 text-xs">
                    <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-100 mb-1">
                      Quick Assign
                    </div>
                    <button
                      onClick={() => {
                        onQuickAssignField(field, 'xAxis');
                        setActiveMenuFieldId(null);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-100 text-zinc-800 font-medium"
                    >
                      → Assign to X-Axis
                    </button>
                    <button
                      onClick={() => {
                        onQuickAssignField(field, 'yAxis');
                        setActiveMenuFieldId(null);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-100 text-zinc-800 font-medium"
                    >
                      → Assign to Y-Axis
                    </button>
                    <button
                      onClick={() => {
                        onQuickAssignField(field, 'legend');
                        setActiveMenuFieldId(null);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-100 text-zinc-800 font-medium"
                    >
                      → Assign to Legend
                    </button>
                    <button
                      onClick={() => {
                        onQuickAssignField(field, 'size');
                        setActiveMenuFieldId(null);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-100 text-zinc-800 font-medium"
                    >
                      → Assign to Size / Weight
                    </button>
                    <div className="border-t border-zinc-100 my-1"></div>
                    <button
                      onClick={() => {
                        onQuickAssignField(field, 'wildSpeed');
                        setActiveMenuFieldId(null);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-100 text-zinc-800 font-medium"
                    >
                      ⚡ Wild Slot: Speed
                    </button>
                    <button
                      onClick={() => {
                        onQuickAssignField(field, 'wildMass');
                        setActiveMenuFieldId(null);
                      }}
                      className="w-full text-left px-2 py-1.5 rounded hover:bg-zinc-100 text-zinc-800 font-medium"
                    >
                      ⚡ Wild Slot: Core Mass
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filteredFields.length === 0 && (
          <div className="text-center py-8 text-zinc-400 text-xs">
            No fields match &quot;{search}&quot;
          </div>
        )}
      </div>

      {/*
        Key Button 1: "+ Create Custom Variable"
        Toned down: Coral orange is specifically reserved for this key action button!
      */}
      <div className="p-3 border-t border-zinc-200 bg-white">
        <button
          id="create-custom-variable-btn"
          onClick={() => {
            haptics.tick();
            onOpenCreateVariableModal();
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-[#FF5A36] hover:bg-[#E04826] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>+ Create Custom Variable</span>
        </button>
      </div>
    </div>
  );
};

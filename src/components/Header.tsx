import React from 'react';
import {
  LayoutDashboard,
  Sparkles,
  Upload,
  Volume2,
  VolumeX,
  Radio,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';
import { Dataset, AppViewMode } from '../types';
import { haptics } from '../utils/haptics';

interface HeaderProps {
  currentDataset: Dataset;
  allDatasets: Dataset[];
  onSelectDataset: (dataset: Dataset) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  viewMode: AppViewMode;
  onToggleViewMode: (mode: AppViewMode) => void;
  isRealtimeSync: boolean;
  onToggleRealtimeSync: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isHapticsEnabled: boolean;
  onToggleHaptics: () => void;
  onOpenMobileDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDataset,
  allDatasets,
  onSelectDataset,
  onFileUpload,
  viewMode,
  onToggleViewMode,
  isRealtimeSync,
  onToggleRealtimeSync,
  isHapticsEnabled,
  onToggleHaptics,
  onOpenMobileDrawer,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-200 bg-white">
      <div className="w-full px-4 sm:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Brand & Mode Switch */}
        <div className="flex items-center gap-3 sm:gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-bold tracking-tight text-xs shadow-2xs">
              PF
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-zinc-900">
                  PowerFlow
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                  BI Studio
                </span>
              </div>
            </div>
          </div>

          {/* View Mode Pills: Standard XY Canvas vs Wild Studio */}
          <div className="hidden md:flex items-center p-0.5 rounded-lg bg-zinc-100 border border-zinc-200">
            <button
              id="view-mode-standard-btn"
              onClick={() => {
                haptics.tick();
                onToggleViewMode('standard');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                viewMode === 'standard'
                  ? 'bg-white text-zinc-900 shadow-2xs font-bold border border-zinc-200/80'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Standard Canvas
            </button>

            <button
              id="view-mode-bananas-btn"
              onClick={() => {
                haptics.bananas();
                onToggleViewMode('bananas_wild');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                viewMode === 'bananas_wild'
                  ? 'bg-white text-zinc-900 shadow-2xs font-bold border border-zinc-200/80'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
              Wild Visualizer
            </button>
          </div>
        </div>

        {/* Dataset Selector & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Dataset Dropdown */}
          <div className="relative group">
            <select
              id="dataset-select"
              value={currentDataset.id}
              onChange={(e) => {
                const found = allDatasets.find((d) => d.id === e.target.value);
                if (found) {
                  haptics.tick();
                  onSelectDataset(found);
                }
              }}
              className="text-xs font-medium bg-white border border-zinc-200 text-zinc-800 rounded-lg pl-3 pr-8 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-zinc-900 cursor-pointer appearance-none max-w-[140px] sm:max-w-[210px] truncate"
            >
              {allDatasets.map((ds) => (
                <option key={ds.id} value={ds.id}>
                  {ds.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 text-zinc-500 pointer-events-none" />
          </div>

          {/* Import CSV / JSON Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={onFileUpload}
            accept=".csv,.json"
            className="hidden"
          />
          <button
            id="import-data-btn"
            onClick={() => {
              haptics.tick();
              fileInputRef.current?.click();
            }}
            title="Import custom CSV or JSON dataset"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-zinc-700 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-zinc-600" />
            <span className="hidden md:inline">Import</span>
          </button>

          {/* Live Data Sync Indicator */}
          <button
            id="realtime-sync-toggle-btn"
            onClick={() => {
              haptics.tick();
              onToggleRealtimeSync();
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              isRealtimeSync
                ? 'bg-emerald-50/70 text-emerald-800 border-emerald-300'
                : 'bg-zinc-50 text-zinc-500 border-zinc-200'
            }`}
            title="Toggle Live Real-Time Data Synchronization"
          >
            {isRealtimeSync ? (
              <>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="hidden sm:inline">LIVE</span>
              </>
            ) : (
              <>
                <Radio className="w-3 h-3 opacity-60" />
                <span className="hidden sm:inline">SYNC OFF</span>
              </>
            )}
          </button>

          {/* Haptics & Sound Toggle */}
          <button
            id="haptics-toggle-btn"
            onClick={() => {
              haptics.snap();
              onToggleHaptics();
            }}
            title={isHapticsEnabled ? 'Haptics & Tactile Sound Enabled' : 'Haptics Muted'}
            className="p-1.5 text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg border border-zinc-200 transition-colors cursor-pointer"
          >
            {isHapticsEnabled ? (
              <Volume2 className="w-4 h-4 text-zinc-800" />
            ) : (
              <VolumeX className="w-4 h-4 text-zinc-400" />
            )}
          </button>

          {/* Mobile Drawer Trigger */}
          <button
            id="mobile-drawer-toggle-btn"
            onClick={onOpenMobileDrawer}
            className="lg:hidden p-1.5 text-zinc-700 hover:bg-zinc-100 rounded-lg border border-zinc-200"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Mode Switcher Sub-bar */}
      <div className="flex md:hidden border-t border-zinc-200 px-4 py-1.5 bg-zinc-50 justify-between items-center text-xs">
        <div className="flex items-center gap-1 w-full">
          <button
            onClick={() => {
              haptics.tick();
              onToggleViewMode('standard');
            }}
            className={`flex-1 py-1 text-center font-semibold rounded ${
              viewMode === 'standard' ? 'bg-white text-zinc-900 shadow-2xs font-bold' : 'text-zinc-600'
            }`}
          >
            Standard Canvas
          </button>
          <button
            onClick={() => {
              haptics.bananas();
              onToggleViewMode('bananas_wild');
            }}
            className={`flex-1 py-1 text-center font-semibold rounded ${
              viewMode === 'bananas_wild' ? 'bg-white text-zinc-900 shadow-2xs font-bold' : 'text-zinc-600'
            }`}
          >
            Wild Visualizer
          </button>
        </div>
      </div>
    </header>
  );
};

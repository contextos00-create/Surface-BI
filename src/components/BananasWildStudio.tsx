import React, { useEffect, useRef, useState } from 'react';
import {
  Sparkles,
  Zap,
  Atom,
  Flame,
  Wind,
  RotateCcw,
  X,
} from 'lucide-react';
import { Field, WildSlots, WildVisualizerType, CustomVariable } from '../types';
import { haptics } from '../utils/haptics';

interface BananasWildStudioProps {
  rawData: Record<string, any>[];
  fields: Field[];
  customVariables?: CustomVariable[];
  wildSlots: WildSlots;
  onUpdateWildSlot: (slotName: keyof WildSlots, slotField: any) => void;
  onOpenCreateVariableModal: () => void;
  isDarkMode: boolean;
}

export const BananasWildStudio: React.FC<BananasWildStudioProps> = ({
  rawData,
  fields,
  wildSlots,
  onUpdateWildSlot,
  onOpenCreateVariableModal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeVisualizer, setActiveVisualizer] = useState<WildVisualizerType>('cosmic_orbit');
  const [chaosFactor, setChaosFactor] = useState<number>(1.2);
  const [showTrails, setShowTrails] = useState<boolean>(true);
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);
  const [activePickerSlot, setActivePickerSlot] = useState<string | null>(null);

  // Field mappings from wild slots
  const speedField = wildSlots.speedOrFrequency?.field;
  const massField = wildSlots.coreMassOrAmplitude?.field;
  const colorField = wildSlots.colorSpectrum?.field;
  const harmonicField = wildSlots.harmonicDensity?.field;
  const customSlotField = wildSlots.customMetricSlot?.field;

  const handleDragOver = (e: React.DragEvent, slotKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (dragOverSlot !== slotKey) {
      setDragOverSlot(slotKey);
    }
  };

  const handleDragLeave = (slotKey: string) => {
    if (dragOverSlot === slotKey) {
      setDragOverSlot(null);
    }
  };

  const handleDrop = (e: React.DragEvent, slotKey: string) => {
    e.preventDefault();
    setDragOverSlot(null);
    try {
      const dataStr = e.dataTransfer.getData('text/plain');
      if (!dataStr) return;
      const field: Field = JSON.parse(dataStr);
      haptics.bananas();
      onUpdateWildSlot(slotKey as keyof WildSlots, {
        field,
        aggregation: field.role === 'measure' ? 'sum' : 'count',
      });
    } catch (err) {
      console.error('Failed to parse dropped field in Wild Studio:', err);
    }
  };

  const handleSelectField = (slotKey: string, field: Field) => {
    haptics.bananas();
    onUpdateWildSlot(slotKey as keyof WildSlots, {
      field,
      aggregation: field.role === 'measure' ? 'sum' : 'count',
    });
    setActivePickerSlot(null);
  };

  // Main Canvas Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // Resize canvas to container
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth * (window.devicePixelRatio || 1);
        canvas.height = parent.clientHeight * (window.devicePixelRatio || 1);
        ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Harmonious palette
    const nodeColors = ['#18181B', '#2563EB', '#0D9488', '#6366F1', '#D97706', '#475569'];

    // Normalize input data points
    const sampledRows = rawData.slice(0, 48);
    const dataPoints = sampledRows.map((row, idx) => {
      const sVal = Math.abs(Number(row[speedField?.id || '']) || 20);
      const mVal = Math.abs(Number(row[massField?.id || '']) || 15);
      const hVal = Math.abs(Number(row[harmonicField?.id || '']) || 5);
      const label = String(row[colorField?.id || ''] || `N-${idx}`);
      const customVal = customSlotField ? Number(row[customSlotField.id]) || 1 : 1;

      return {
        label,
        speed: (sVal / 100) * chaosFactor,
        mass: Math.max(4, Math.min(24, (mVal / 60) * 11)),
        harmonic: Math.max(3, Math.min(10, Math.floor(hVal % 8) + 3)),
        customVal,
        color: nodeColors[idx % nodeColors.length],
      };
    });

    const render = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);
      const centerX = width / 2;
      const centerY = height / 2;

      // Clear or trail on pure white canvas
      if (showTrails) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
        ctx.fillRect(0, 0, width, height);
      } else {
        ctx.clearRect(0, 0, width, height);
      }

      time += 0.015 * chaosFactor;

      if (activeVisualizer === 'cosmic_orbit') {
        // --- 1. COSMIC ORBIT ENGINE ---
        const pulsarRadius = 20 + Math.sin(time * 3) * 5;
        const coreGradient = ctx.createRadialGradient(
          centerX,
          centerY,
          2,
          centerX,
          centerY,
          pulsarRadius * 2
        );
        coreGradient.addColorStop(0, '#2563EB');
        coreGradient.addColorStop(0.6, '#3B82F6');
        coreGradient.addColorStop(1, 'transparent');
        ctx.fillStyle = coreGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulsarRadius * 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#18181B';
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulsarRadius * 0.45, 0, Math.PI * 2);
        ctx.fill();

        // Orbiting planetary data nodes
        dataPoints.forEach((node, i) => {
          const orbitRadius =
            60 + (i * (Math.min(width, height) * 0.42 - 70)) / dataPoints.length;
          const angle = time * node.speed + (i * (Math.PI * 2)) / dataPoints.length;

          // Faint orbit track
          ctx.strokeStyle = 'rgba(24, 24, 27, 0.07)';
          ctx.beginPath();
          ctx.arc(centerX, centerY, orbitRadius, 0, Math.PI * 2);
          ctx.stroke();

          const x = centerX + Math.cos(angle) * orbitRadius;
          const y = centerY + Math.sin(angle) * orbitRadius;

          ctx.fillStyle = node.color;
          ctx.beginPath();
          ctx.arc(x, y, node.mass, 0, Math.PI * 2);
          ctx.fill();

          if (i % 4 === 0) {
            ctx.strokeStyle = 'rgba(37, 99, 235, 0.15)';
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
          }
        });
      } else if (activeVisualizer === 'spiral_vortex') {
        // --- 2. ARCHIMEDEAN SPIRAL VORTEX ---
        const maxRadius = Math.min(width, height) * 0.46;
        dataPoints.forEach((node, i) => {
          const tNorm = i / dataPoints.length;
          const r = 20 + tNorm * maxRadius;
          const theta = tNorm * 14 * Math.PI + time * node.speed;

          const x = centerX + Math.cos(theta) * r;
          const y = centerY + Math.sin(theta) * r;

          const petalPoints = node.harmonic;
          ctx.fillStyle = node.color;
          ctx.beginPath();
          for (let p = 0; p < petalPoints; p++) {
            const pAngle = theta + (p * Math.PI * 2) / petalPoints;
            const pRadius = node.mass * (1 + Math.sin(time * 2 + p) * 0.3);
            const px = x + Math.cos(pAngle) * pRadius;
            const py = y + Math.sin(pAngle) * pRadius;
            if (p === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fill();
        });
      } else if (activeVisualizer === 'topology_wave') {
        // --- 3. TOPOLOGY OSCILLATING WAVE MATRIX ---
        const rows = 6;
        const cols = 8;
        const spacingX = (width * 0.8) / cols;
        const spacingY = (height * 0.6) / rows;
        const startX = width * 0.1;
        const startY = height * 0.2;

        for (let r = 0; r < rows; r++) {
          ctx.beginPath();
          for (let c = 0; c < cols; c++) {
            const idx = (r * cols + c) % dataPoints.length;
            const pt = dataPoints[idx];
            const waveOffset =
              Math.sin(time * 2 + c * 0.5 + r * 0.4) *
              (pt.mass * 2.5 * chaosFactor);
            const px = startX + c * spacingX;
            const py = startY + r * spacingY + waveOffset;

            if (c === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);

            ctx.fillStyle = pt.color;
            ctx.beginPath();
            ctx.arc(px, py, pt.mass * 0.45, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.strokeStyle = 'rgba(24, 24, 27, 0.15)';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
      } else if (activeVisualizer === 'particle_hive') {
        // --- 4. PARTICLE HIVE COLLISION CLOUD ---
        dataPoints.forEach((p1, i) => {
          const angle = (i * Math.PI * 2) / dataPoints.length + time * p1.speed * 0.6;
          const radius =
            Math.sin(time + i * 0.2) * (Math.min(width, height) * 0.32) +
            Math.min(width, height) * 0.12;
          const x1 = centerX + Math.cos(angle) * radius;
          const y1 = centerY + Math.sin(angle) * radius;

          // Connect nearby nodes
          dataPoints.forEach((p2, j) => {
            if (j > i) {
              const angle2 =
                (j * Math.PI * 2) / dataPoints.length + time * p2.speed * 0.6;
              const radius2 =
                Math.sin(time + j * 0.2) * (Math.min(width, height) * 0.32) +
                Math.min(width, height) * 0.12;
              const x2 = centerX + Math.cos(angle2) * radius2;
              const y2 = centerY + Math.sin(angle2) * radius2;

              const dist = Math.hypot(x2 - x1, y2 - y1);
              if (dist < 85) {
                ctx.strokeStyle = `rgba(24, 24, 27, ${1 - dist / 85})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(x1, y1);
                ctx.lineTo(x2, y2);
                ctx.stroke();
              }
            }
          });

          ctx.fillStyle = p1.color;
          ctx.beginPath();
          ctx.arc(x1, y1, p1.mass * 0.6, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [
    rawData,
    activeVisualizer,
    chaosFactor,
    showTrails,
    speedField,
    massField,
    colorField,
    harmonicField,
    customSlotField,
  ]);

  const wildSlotDefinitions: {
    key: keyof WildSlots;
    name: string;
    icon: React.ReactNode;
  }[] = [
    { key: 'speedOrFrequency', name: 'Speed / Velocity', icon: <Zap className="w-3.5 h-3.5 text-zinc-600" /> },
    { key: 'coreMassOrAmplitude', name: 'Core Mass', icon: <Flame className="w-3.5 h-3.5 text-zinc-600" /> },
    { key: 'colorSpectrum', name: 'Color Modulator', icon: <Atom className="w-3.5 h-3.5 text-zinc-600" /> },
    { key: 'harmonicDensity', name: 'Harmonic Density', icon: <Wind className="w-3.5 h-3.5 text-zinc-600" /> },
    { key: 'customMetricSlot', name: 'User Formula Metric', icon: <Sparkles className="w-3.5 h-3.5 text-zinc-600" /> },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-white overflow-hidden select-none">
      {/* Visualizer Selector Header */}
      <div className="p-3 sm:p-4 border-b border-zinc-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-zinc-100 text-zinc-700 flex items-center justify-center border border-zinc-200">
              <Sparkles className="w-3.5 h-3.5 text-zinc-700" />
            </div>
            <div>
              <h2 className="text-xs uppercase tracking-wider font-bold text-zinc-800">
                Wild Visualizer Engine
              </h2>
            </div>
          </div>

          {/* Engine Modes */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-zinc-100 border border-zinc-200">
            {[
              { id: 'cosmic_orbit', label: 'Cosmic Orbit' },
              { id: 'spiral_vortex', label: 'Spiral Vortex' },
              { id: 'topology_wave', label: 'Topology Wave' },
              { id: 'particle_hive', label: 'Particle Hive' },
            ].map((engine) => (
              <button
                key={engine.id}
                onClick={() => {
                  haptics.bananas();
                  setActiveVisualizer(engine.id as WildVisualizerType);
                }}
                className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  activeVisualizer === engine.id
                    ? 'bg-white text-zinc-900 shadow-2xs font-bold border border-zinc-200/80'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {engine.label}
              </button>
            ))}
          </div>
        </div>

        {/* Special Assignable Slots Strip */}
        <div className="mt-3 pt-3 border-t border-zinc-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              Assigned Wild Metric Slots
            </span>
            <button
              onClick={onOpenCreateVariableModal}
              className="text-xs font-semibold text-zinc-700 hover:text-zinc-900 flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
              <span>+ Create Special Variable</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {wildSlotDefinitions.map((slot) => {
              const currentSlot = wildSlots[slot.key];
              const isOver = dragOverSlot === slot.key;

              return (
                <div
                  key={slot.key}
                  onDragOver={(e) => handleDragOver(e, slot.key)}
                  onDragLeave={() => handleDragLeave(slot.key)}
                  onDrop={(e) => handleDrop(e, slot.key)}
                  className={`relative p-2 rounded-xl border transition-all min-h-[64px] flex flex-col justify-between ${
                    isOver
                      ? 'border-dashed border-zinc-600 bg-zinc-50'
                      : currentSlot
                      ? 'bg-zinc-50/70 border-zinc-200'
                      : 'bg-white border-dashed border-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1 min-w-0">
                      {slot.icon}
                      <span className="text-[10px] font-bold truncate text-zinc-800">
                        {slot.name}
                      </span>
                    </div>
                  </div>

                  {currentSlot ? (
                    <div className="flex items-center justify-between bg-white border border-zinc-200 px-2 py-0.5 rounded-md text-xs shadow-2xs">
                      <span className="font-semibold text-zinc-900 truncate">
                        {currentSlot.field.name}
                      </span>
                      <button
                        onClick={() => {
                          haptics.remove();
                          onUpdateWildSlot(slot.key, null);
                        }}
                        className="text-zinc-400 hover:text-zinc-800 p-0.5 transition-colors cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() =>
                        setActivePickerSlot(activePickerSlot === slot.key ? null : slot.key)
                      }
                      className="text-[10px] text-zinc-400 font-medium text-center hover:text-zinc-700 py-0.5 cursor-pointer"
                    >
                      + Assign Field
                    </button>
                  )}

                  {activePickerSlot === slot.key && (
                    <div className="absolute left-0 right-0 top-full mt-1 z-40 bg-white border border-zinc-200 rounded-xl shadow-xl p-1.5 max-h-44 overflow-y-auto">
                      <div className="space-y-1">
                        {fields.map((f) => (
                          <button
                            key={f.id}
                            onClick={() => handleSelectField(slot.key, f)}
                            className="w-full text-left px-2 py-1 rounded hover:bg-zinc-100 text-xs font-medium text-zinc-800 truncate"
                          >
                            {f.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Canvas Stage & Control Overlay */}
      <div className="flex-1 relative w-full min-h-[420px] bg-white flex flex-col justify-center items-center overflow-hidden">
        <canvas ref={canvasRef} className="w-full h-full cursor-crosshair" />

        {/* Floating Controls Bar */}
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-20 flex flex-wrap items-center gap-3 bg-white border border-zinc-200 p-2 sm:p-3 rounded-2xl shadow-xl">
          {/* Chaos Slider */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-zinc-800">Chaos Factor:</span>
            <input
              type="range"
              min="0.4"
              max="3.0"
              step="0.1"
              value={chaosFactor}
              onChange={(e) => {
                haptics.tick();
                setChaosFactor(parseFloat(e.target.value));
              }}
              className="w-24 accent-zinc-800 cursor-pointer"
            />
            <span className="font-mono text-[11px] font-bold w-7 text-zinc-900">
              {chaosFactor.toFixed(1)}x
            </span>
          </div>

          <div className="w-px h-4 bg-zinc-200 hidden sm:block"></div>

          {/* Particle Trails Toggle */}
          <button
            onClick={() => {
              haptics.tick();
              setShowTrails(!showTrails);
            }}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
              showTrails
                ? 'bg-zinc-900 text-white border-zinc-900'
                : 'bg-zinc-50 text-zinc-700 border-zinc-200'
            }`}
          >
            Trails: {showTrails ? 'ON' : 'OFF'}
          </button>

          {/* Reset Chaos button */}
          <button
            onClick={() => {
              haptics.snap();
              setChaosFactor(1.2);
            }}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 transition-colors cursor-pointer"
            title="Reset Chaos"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

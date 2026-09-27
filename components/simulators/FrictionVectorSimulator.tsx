'use client';

import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Sparkles, CheckCircle2, Zap, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export const FrictionVectorSimulator: React.FC = () => {
  const [angle, setAngle] = useState<number>(30); // degrees
  const [mass, setMass] = useState<number>(5); // kg
  const [mu, setMu] = useState<number>(0.3); // friction coefficient
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [blockPos, setBlockPos] = useState<number>(20); // percentage along the ramp (0% top to 80% bottom)
  const [hasSolved, setHasSolved] = useState<boolean>(false);

  const g = 9.8; // m/s^2

  // Physics calculation
  const rad = (angle * Math.PI) / 180;
  const normalForce = mass * g * Math.cos(rad);
  const downSlopeForce = mass * g * Math.sin(rad);
  const frictionForce = Math.min(mu * normalForce, downSlopeForce);
  const netForce = Math.max(0, downSlopeForce - mu * normalForce);
  const acceleration = netForce / mass;

  const willSlide = downSlopeForce > mu * normalForce;

  useEffect(() => {
    let animFrame: number;
    if (isPlaying && willSlide && blockPos < 80) {
      animFrame = requestAnimationFrame(() => {
        setBlockPos((prev) => {
          const next = prev + Math.max(0.2, acceleration * 0.1);
          if (next >= 80) {
            setIsPlaying(false);
            if (!hasSolved) {
              setHasSolved(true);
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
              });
            }
            return 80;
          }
          return next;
        });
      });
    }
    return () => cancelAnimationFrame(animFrame);
  }, [isPlaying, willSlide, blockPos, acceleration, hasSolved]);

  const handleReset = () => {
    setIsPlaying(false);
    setBlockPos(20);
  };

  const handleRun = () => {
    if (blockPos >= 80) {
      setBlockPos(20);
    }
    setIsPlaying(true);
  };

  return (
    <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>Interactive Mechanics Lab • High-Stakes Simulation</span>
          </div>
          <h2 className="text-xl font-black text-white">Inclined Plane & Vector Resolution</h2>
          <p className="text-xs text-slate-400 mt-1">
            Adjust the incline angle, mass, and friction coefficient to observe dynamic vector forces.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors flex items-center gap-1.5 text-xs font-semibold"
            title="Reset Block Position"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
          <button
            onClick={handleRun}
            className={`px-4 py-2.5 rounded-xl text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-lg ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
            }`}
          >
            <Play className="w-4 h-4 fill-white" />
            <span>{isPlaying ? 'Simulating...' : 'Test Physics Run'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Visual Simulation Canvas */}
        <div className="lg:col-span-7 bg-slate-950 border border-slate-800 rounded-2xl p-6 relative flex flex-col items-center justify-center min-h-[300px]">
          {/* Status banner */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-mono font-bold uppercase ${
                willSlide
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {willSlide ? 'Active Slip State' : 'Static Equilibrium'}
            </span>
          </div>

          {/* SVG Incline and Vectors */}
          <svg className="w-full h-64 overflow-visible" viewBox="0 0 400 240">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#818cf8" />
              </marker>
              <marker id="arrow-down" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#f87171" />
              </marker>
              <marker id="arrow-friction" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#fbbf24" />
              </marker>
            </defs>

            {/* Ramp base triangle */}
            {(() => {
              const startX = 40;
              const baseY = 210;
              const rampLength = 320;
              const height = rampLength * Math.sin(rad) * 0.75;
              const width = rampLength * Math.cos(rad) * 0.75;
              const endX = startX + width;
              const topY = baseY - height;

              // Block coordinates along the slope
              const t = blockPos / 100;
              const blockX = startX + (1 - t) * width;
              const blockY = topY + t * height;

              return (
                <>
                  {/* Ground Line */}
                  <line x1="20" y1={baseY} x2="380" y2={baseY} stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

                  {/* Wedge polygon */}
                  <polygon
                    points={`${startX},${baseY} ${endX},${baseY} ${startX},${topY}`}
                    fill="url(#rampGradient)"
                    stroke="#4f46e5"
                    strokeWidth="2"
                    className="opacity-40"
                  />
                  <linearGradient id="rampGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#1e1b4b" stopOpacity="0.2" />
                  </linearGradient>

                  {/* Angle arc */}
                  <path
                    d={`M ${endX - 35} ${baseY} A 35 35 0 0 0 ${endX - 35 * Math.cos(rad)} ${baseY - 35 * Math.sin(rad)}`}
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2"
                  />
                  <text x={endX - 55} y={baseY - 8} fill="#c084fc" fontSize="12" fontWeight="bold">
                    {angle}°
                  </text>

                  {/* Mass Block */}
                  <g transform={`translate(${blockX}, ${blockY}) rotate(${angle})`}>
                    <rect
                      x="-18"
                      y="-26"
                      width="36"
                      height="26"
                      rx="4"
                      fill="#38bdf8"
                      stroke="#0284c7"
                      strokeWidth="2"
                    />
                    <text x="0" y="-8" textAnchor="middle" fill="#0f172a" fontSize="11" fontWeight="bold">
                      {mass}kg
                    </text>

                    {/* Vector: Down slope force (red arrow) */}
                    <line
                      x1="0"
                      y1="-13"
                      x2="45"
                      y2="-13"
                      stroke="#f87171"
                      strokeWidth="2.5"
                      markerEnd="url(#arrow-down)"
                    />

                    {/* Vector: Friction force (yellow arrow pointing up slope) */}
                    <line
                      x1="0"
                      y1="-13"
                      x2="-35"
                      y2="-13"
                      stroke="#fbbf24"
                      strokeWidth="2.5"
                      markerEnd="url(#arrow-friction)"
                    />

                    {/* Vector: Normal force (blue arrow perpendicular to surface) */}
                    <line
                      x1="0"
                      y1="-13"
                      x2="0"
                      y2="-48"
                      stroke="#818cf8"
                      strokeWidth="2.5"
                      markerEnd="url(#arrow)"
                    />
                  </g>
                </>
              );
            })()}
          </svg>

          {/* Vectors Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs mt-2 border-t border-slate-800/80 pt-3 w-full font-mono">
            <span className="flex items-center gap-1.5 text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span>F_down: {downSlopeForce.toFixed(1)} N</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span>f_k: {frictionForce.toFixed(1)} N</span>
            </span>
            <span className="flex items-center gap-1.5 text-indigo-400">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
              <span>Normal N: {normalForce.toFixed(1)} N</span>
            </span>
          </div>
        </div>

        {/* Controls & Real-time Calculations */}
        <div className="lg:col-span-5 space-y-5">
          {/* Sliders */}
          <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
            {/* Incline Angle */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                <span>Incline Angle (θ)</span>
                <span className="font-mono text-indigo-400">{angle}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="1"
                value={angle}
                onChange={(e) => {
                  setAngle(Number(e.target.value));
                  setBlockPos(20);
                }}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            {/* Mass */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                <span>Object Mass (m)</span>
                <span className="font-mono text-cyan-400">{mass} kg</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={mass}
                onChange={(e) => {
                  setMass(Number(e.target.value));
                  setBlockPos(20);
                }}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            {/* Friction Coeff */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
                <span>Friction Coefficient (μ)</span>
                <span className="font-mono text-amber-400">{mu}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={mu}
                onChange={(e) => {
                  setMu(Number(e.target.value));
                  setBlockPos(20);
                }}
                className="w-full accent-amber-500 cursor-pointer"
              />
            </div>
          </div>

          {/* Mathematical readout card */}
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-900/40 text-xs space-y-2">
            <div className="font-bold text-indigo-200 flex items-center justify-between">
              <span>Analytical Breakdown</span>
              <span className="font-mono text-emerald-400">
                Acc: {acceleration.toFixed(2)} m/s²
              </span>
            </div>
            <div className="space-y-1 font-mono text-[11px] text-slate-300">
              <div>• F_gravity_parallel = m·g·sin({angle}°) = {downSlopeForce.toFixed(1)} N</div>
              <div>• F_friction_max = μ·m·g·cos({angle}°) = {(mu * normalForce).toFixed(1)} N</div>
              <div>• Net Resultant = {netForce.toFixed(1)} N</div>
            </div>
          </div>

          {hasSolved && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>Vector mechanics verified! You mastered the slip condition: tan(θ) &gt; μ.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, Shield, Check, AlertTriangle } from 'lucide-react';

export const CLOAK_PRESETS = [
  {
    id: 'default',
    name: 'Normal (Uncloaked)',
    tabTitle: 'Unblocked Games Vault - Play Eaglercraft 1.12.2',
    iconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2310b981'><path d='M6 11h4V7a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v4h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-4v4a2 2 0 0 1-2 2h0a2 2 0 0 1-2-2v-4H6a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2z'/></svg>",
    description: 'Original site branding with gamepad logo.',
  },
  {
    id: 'docs',
    name: 'Google Docs',
    tabTitle: 'Untitled document - Google Docs',
    iconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%234285f4'><path d='M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z'/></svg>",
    description: 'Looks like a regular school or office document.',
  },
  {
    id: 'classroom',
    name: 'Google Classroom',
    tabTitle: 'Classes',
    iconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%230f9d58'><path d='M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm9 11v-1a7 7 0 0 0-14 0v1z'/></svg>",
    description: 'Disguises this tab as your Google Classroom homepage.',
  },
  {
    id: 'drive',
    name: 'Google Drive',
    tabTitle: 'My Drive - Google Drive',
    iconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23f4b400'><path d='M7.71 3.5L1.15 15l3.43 6 6.55-11.5M9.73 15L6.3 21h13.12l3.43-6M22.29 13.5L15.73 2H8.87l6.56 11.5'/></svg>",
    description: 'Disguises as Google Drive cloud storage.',
  },
  {
    id: 'canvas',
    name: 'Canvas LMS',
    tabTitle: 'Dashboard',
    iconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23e63946'><circle cx='12' cy='12' r='10'/></svg>",
    description: 'Disguises as Canvas student portal dashboard.',
  },
  {
    id: 'wikipedia',
    name: 'Wikipedia',
    tabTitle: 'Wikipedia, the free encyclopedia',
    iconSvg: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ffffff'><text x='2' y='18' font-size='18' font-family='serif'>W</text></svg>",
    description: 'Disguises as an encyclopedia reference article.',
  },
];

export const TabCloakModal = ({
  isOpen,
  onClose,
  activePreset,
  onSelectPreset,
  panicUrl,
  onUpdatePanicUrl,
  onTriggerPanic,
}) => {
  const [customUrl, setCustomUrl] = useState(panicUrl);

  if (!isOpen) return null;

  const handleSavePanicUrl = (e) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onUpdatePanicUrl(customUrl.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-teal-950/80 border border-teal-800/80 text-teal-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Tab Cloaking & Stealth Panic
              </h3>
              <p className="text-xs text-zinc-400">
                Disguise your browser tab icon & title to look like school/work sites
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets List */}
        <div className="py-4">
          <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
            Choose Tab Cloak
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
            {CLOAK_PRESETS.map((preset) => {
              const isSelected = activePreset === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => onSelectPreset(preset.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-emerald-950/40 border-emerald-500/80 shadow-sm'
                      : 'bg-zinc-950/60 border-zinc-800/90 hover:border-zinc-700 hover:bg-zinc-900'
                  }`}
                >
                  <img
                    src={preset.iconSvg}
                    alt={preset.name}
                    className="w-5 h-5 mt-0.5 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white truncate">
                        {preset.name}
                      </span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {preset.tabTitle}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panic Button Configuration */}
        <div className="pt-4 border-t border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Panic Button Settings (Hotkey: " ] " key)</span>
            </label>
            <button
              onClick={onTriggerPanic}
              className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition-colors"
            >
              Test Panic Now
            </button>
          </div>

          <form onSubmit={handleSavePanicUrl} className="flex gap-2">
            <input
              type="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://classroom.google.com"
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white rounded-lg transition-colors whitespace-nowrap"
            >
              Save URL
            </button>
          </form>
          <p className="mt-1.5 text-[11px] text-zinc-500">
            Pressing the <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-zinc-300 font-mono">]</kbd> key at any time immediately redirects to this destination.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs rounded-lg transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

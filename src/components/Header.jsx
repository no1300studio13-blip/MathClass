import React from 'react';
import { Shield, EyeOff, Gamepad2, Plus, Sparkles, AlertCircle } from 'lucide-react';

export const Header = ({
  onOpenCloakModal,
  onOpenAddModal,
  onSelectEaglercraft,
  onPanic,
  activeCloak,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onFilterChange('all')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-950/50 group-hover:scale-105 transition-transform">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors whitespace-nowrap">
                Unblocked Vault
              </span>
              <span className="hidden sm:inline-block text-xs text-zinc-500 ml-2">
                · HTML5 & WebAssembly
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
          <button
            onClick={() => onFilterChange('all')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeFilter === 'all' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            All Games
          </button>

          <button
            onClick={onSelectEaglercraft}
            className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Eaglercraft 1.12.2</span>
          </button>

          <button
            onClick={() => onFilterChange('Retro')}
            className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
              activeFilter === 'Retro' ? 'text-emerald-400 font-semibold' : ''
            }`}
          >
            Retro & Arcade
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1 hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4 text-zinc-500" />
            <span>Add Custom Game</span>
          </button>

          <button
            onClick={onOpenCloakModal}
            className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            <Shield className="w-4 h-4 text-teal-400" />
            <span>Tab Cloaker {activeCloak !== 'default' && '· Active'}</span>
          </button>
        </nav>

        {/* Zone 3: Primary Panic / Quick Disguise Action */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onOpenCloakModal}
            title="Configure Tab Cloaking & Disguise"
            className="md:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <EyeOff className="w-4 h-4" />
          </button>

          <button
            onClick={onPanic}
            title="Panic Button: Instantly hides games & switches to educational site (Hotkey: ']' key)"
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-rose-200 bg-rose-950/80 border border-rose-800/80 rounded-lg hover:bg-rose-900 hover:text-white transition-all shadow-sm active:scale-95 whitespace-nowrap shrink-0"
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>Panic [ ]</span>
          </button>
        </div>
      </div>
    </header>
  );
};

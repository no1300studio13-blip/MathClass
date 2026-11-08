import React from 'react';
import { Play, Sparkles, Server, Compass, ShieldCheck, ChevronRight } from 'lucide-react';

export const EaglercraftSpotlight = ({
  game,
  onLaunch,
  onLaunchMirror,
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-zinc-900 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl shadow-emerald-950/40">
      {/* Decorative background grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 2px 2px, rgba(16, 185, 129, 0.6) 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left Column: Details & Headline */}
        <div className="max-w-2xl">
          {/* Unboxed category metadata */}
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-2">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <Sparkles className="w-3.5 h-3.5" />
              FLAGSHIP UNBLOCKED EMBED
            </span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>MINECRAFT JAVA 1.12.2</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>WEBASSEMBLY</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Eaglercraft 1.12.2
          </h1>

          <p className="mt-3 text-sm sm:text-base text-zinc-300 leading-relaxed">
            The complete Minecraft 1.12.2 Java client ported to browser WebAssembly. Enjoy singleplayer survival, creative worlds, multiplayer servers, shaders, sound packs, and custom skins right inside an iframe.
          </p>

          {/* Feature Highlights Grid */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 p-2.5 bg-black/40 border border-emerald-900/60 rounded-lg text-zinc-300">
              <Compass className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Singleplayer Worlds</span>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-black/40 border border-emerald-900/60 rounded-lg text-zinc-300">
              <Server className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Multiplayer WebSockets</span>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-black/40 border border-emerald-900/60 rounded-lg text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Pointer Lock Support</span>
            </div>
          </div>

          {/* Quick Mirrors Bar */}
          {game.mirrors && game.mirrors.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-zinc-400 font-medium">Fast Mirrors:</span>
              {game.mirrors.map((m, idx) => (
                <button
                  key={idx}
                  onClick={() => onLaunchMirror(m.url)}
                  className="px-2.5 py-1 bg-zinc-900/90 hover:bg-emerald-950 border border-zinc-700/80 hover:border-emerald-600 rounded-md text-[11px] text-zinc-300 hover:text-emerald-300 transition-colors whitespace-nowrap"
                >
                  {m.name.replace(' (Official 1.12.2)', '').replace(' Mirror', '')}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Launch CTA */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 shrink-0">
          <button
            onClick={onLaunch}
            className="group flex items-center justify-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-extrabold text-base rounded-xl shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Launch Eaglercraft</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="text-center lg:text-right text-[11px] text-zinc-400">
            <span>Runs 100% in-browser</span>
            <span className="mx-1.5 text-zinc-600">·</span>
            <span>No install required</span>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Play, Star, ExternalLink } from 'lucide-react';

export const GameCard = ({
  game,
  isFavorite,
  onSelect,
  onToggleFavorite,
  onOpenBlank,
}) => {
  const isEagler = game.id === 'eaglercraft-1-12-2';

  return (
    <div
      onClick={() => onSelect(game)}
      className={`group relative flex flex-col justify-between bg-zinc-900/80 hover:bg-zinc-850 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden ${
        isEagler
          ? 'border-emerald-600/50 hover:border-emerald-500 shadow-lg shadow-emerald-950/30'
          : 'border-zinc-800 hover:border-zinc-700 hover:shadow-md hover:shadow-black/40'
      }`}
    >
      {/* Visual Thumbnail Banner */}
      <div
        className={`relative w-full h-40 bg-gradient-to-br ${
          game.color || 'from-zinc-800 to-zinc-900'
        } p-4 flex flex-col justify-between overflow-hidden`}
      >
        {/* Subtle grid pattern background */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)',
            backgroundSize: '16px 16px',
          }}
        />

        {/* Top bar over thumbnail */}
        <div className="relative z-10 flex items-center justify-between text-xs text-white/80">
          <span className="font-mono tracking-wider uppercase text-[11px] font-semibold text-white/90">
            {game.category}
          </span>
          <button
            onClick={(e) => onToggleFavorite(game.id, e)}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="p-1.5 rounded-md bg-black/40 hover:bg-black/70 backdrop-blur-sm text-zinc-300 hover:text-amber-400 transition-colors"
          >
            <Star
              className={`w-3.5 h-3.5 ${
                isFavorite ? 'fill-amber-400 text-amber-400' : ''
              }`}
            />
          </button>
        </div>

        {/* Center decorative motif */}
        <div className="relative z-10 flex flex-col items-center justify-center my-auto">
          {isEagler ? (
            <div className="flex flex-col items-center">
              <span className="text-3xl filter drop-shadow">⛏️</span>
              <span className="text-xs font-mono font-bold text-emerald-200 tracking-wider mt-1">
                MINECRAFT 1.12.2
              </span>
            </div>
          ) : (
            <div className="text-2xl font-bold tracking-tight text-white/90 text-center px-2 line-clamp-1">
              {game.title}
            </div>
          )}
        </div>

        {/* Hover quick play overlay */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 z-20">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs rounded-lg shadow-lg transition-transform transform group-hover:scale-105">
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Play Now</span>
          </div>
          {onOpenBlank && (
            <button
              onClick={(e) => onOpenBlank(game, e)}
              title="Open in new window"
              className="p-2 rounded-lg bg-zinc-800/90 text-zinc-200 hover:text-white hover:bg-zinc-700 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed clean metadata */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-1.5">
            <span>{game.category}</span>
            <span aria-hidden="true" className="text-zinc-600">·</span>
            <span>{game.mirrors ? `${game.mirrors.length} Mirrors` : 'HTML5 Embed'}</span>
            {game.badge && (
              <>
                <span aria-hidden="true" className="text-zinc-600">·</span>
                <span className="text-emerald-400 font-medium">{game.badge}</span>
              </>
            )}
          </div>

          <h3 className="text-base font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
            {game.title}
          </h3>

          <p className="mt-1 text-xs text-zinc-400 line-clamp-2 leading-relaxed">
            {game.description}
          </p>
        </div>

        {/* Controls snippet if present */}
        {game.controls && game.controls.length > 0 && (
          <div className="mt-3 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-400">
            <span className="truncate max-w-[210px] text-zinc-400">
              🎮 {game.controls[0]}
            </span>
            <span className="text-emerald-400 text-xs font-medium group-hover:translate-x-0.5 transition-transform">
              Launch →
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

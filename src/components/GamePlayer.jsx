import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Maximize2,
  RefreshCw,
  ExternalLink,
  Star,
  Monitor,
  Info,
  Layers,
  HelpCircle,
  Wifi,
} from 'lucide-react';

export const GamePlayer = ({
  game,
  isFavorite,
  onBack,
  onToggleFavorite,
  onOpenBlank,
}) => {
  const isEagler = game.id === 'eaglercraft-1-12-2';
  const [activeMirrorUrl, setActiveMirrorUrl] = useState(game.iframeUrl);
  const [isTheater, setIsTheater] = useState(false);
  const [iframeKey, setIframeKey] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('controls');
  const containerRef = useRef(null);
  const iframeRef = useRef(null);

  // Sync active url when game changes
  useEffect(() => {
    setActiveMirrorUrl(game.iframeUrl);
    setIframeKey((prev) => prev + 1);
    setIsLoading(true);
  }, [game]);

  const handleRefresh = () => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleMirrorChange = (newUrl) => {
    setActiveMirrorUrl(newUrl);
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Keyboard shortcut listener for player
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isTheater && !document.fullscreenElement) {
        setIsTheater(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTheater]);

  return (
    <div
      ref={containerRef}
      className={`flex flex-col bg-zinc-950 min-h-screen text-zinc-100 ${
        isTheater ? 'fixed inset-0 z-50 overflow-y-auto' : ''
      }`}
    >
      {/* Top Player Control Bar */}
      <div className="sticky top-0 z-30 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-md">
        {/* Left: Back & Game Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-750 border border-zinc-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                {game.title}
                {isEagler && (
                  <span className="text-[11px] font-mono font-medium text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded">
                    v1.12.2 Java
                  </span>
                )}
              </h2>
            </div>
            <div className="text-[11px] text-zinc-400 flex items-center gap-2">
              <span>{game.category}</span>
              <span aria-hidden="true" className="text-zinc-600">·</span>
              <span>Loaded via iframe</span>
            </div>
          </div>
        </div>

        {/* Center: Mirror Switcher */}
        {game.mirrors && game.mirrors.length > 1 && (
          <div className="flex items-center gap-2 bg-zinc-950/80 border border-zinc-800 rounded-lg px-2.5 py-1">
            <Layers className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
            <label htmlFor="mirror-select" className="text-xs text-zinc-400 shrink-0">
              Mirror:
            </label>
            <select
              id="mirror-select"
              value={activeMirrorUrl}
              onChange={(e) => handleMirrorChange(e.target.value)}
              className="bg-transparent text-xs text-emerald-400 font-medium focus:outline-none cursor-pointer max-w-[190px] sm:max-w-[260px] truncate"
            >
              {game.mirrors.map((m, idx) => (
                <option key={idx} value={m.url} className="bg-zinc-900 text-zinc-200">
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleRefresh}
            title="Reload game frame"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reload</span>
          </button>

          <button
            onClick={(e) => onOpenBlank(game, e)}
            title="Open in new window (about:blank disguise)"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Tab</span>
          </button>

          <button
            onClick={() => setIsTheater(!isTheater)}
            title={isTheater ? 'Exit theater mode' : 'Enter theater mode'}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${
              isTheater
                ? 'bg-emerald-600 text-white'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Theater</span>
          </button>

          <button
            onClick={handleToggleFullscreen}
            title="Toggle Fullscreen"
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>

          <button
            onClick={(e) => onToggleFavorite(game.id, e)}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-amber-400 transition-colors ml-1"
          >
            <Star
              className={`w-4 h-4 ${
                isFavorite ? 'fill-amber-400 text-amber-400' : ''
              }`}
            />
          </button>
        </div>
      </div>

      {/* Main Iframe Player Canvas */}
      <div
        className={`relative flex-1 bg-black flex items-center justify-center ${
          isTheater ? 'w-full h-[calc(100vh-56px)]' : 'w-full aspect-[16/9] max-h-[82vh] min-h-[460px]'
        }`}
      >
        {/* Loading overlay indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-zinc-950/90 z-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
            <p className="text-sm font-medium text-zinc-300">
              Loading {game.title}...
            </p>
            {isEagler && (
              <p className="text-xs text-zinc-500 max-w-sm text-center">
                Downloading WebAssembly runtime & 1.12.2 client assets. If loading stalls, try another mirror from the dropdown.
              </p>
            )}
          </div>
        )}

        {/* The Game Iframe */}
        <iframe
          key={iframeKey}
          ref={iframeRef}
          src={activeMirrorUrl}
          title={game.title}
          allow="autoplay; fullscreen; pointer-lock; camera; microphone; gamepad; clipboard-read; clipboard-write"
          sandbox={
            game.sandbox ||
            'allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-modals allow-downloads'
          }
          className="w-full h-full border-0 focus:outline-none"
          onLoad={() => setIsLoading(false)}
        />
      </div>

      {/* Under-Game Info & Controls Tabs */}
      <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6">
        {/* Tab Controls Bar */}
        <div className="flex items-center gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-lg w-fit mb-6">
          <button
            onClick={() => setActiveTab('controls')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'controls'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            🎮 Controls & Shortcuts
          </button>

          {isEagler && (
            <button
              onClick={() => setActiveTab('multiplayer')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'multiplayer'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              🌐 Eagler Multiplayer Servers
            </button>
          )}

          <button
            onClick={() => setActiveTab('about')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'about'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            ℹ️ Game Details & JSON Source
          </button>
        </div>

        {/* Tab 1: Controls */}
        {activeTab === 'controls' && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-zinc-100 mb-3 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-400" />
              <span>Keybindings & How to Play</span>
            </h3>

            {isEagler && (
              <div className="mb-4 p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-xs text-emerald-200 leading-relaxed flex items-start gap-2.5">
                <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <b>Crucial for Minecraft/Eaglercraft:</b> Click inside the game window once to engage <b>Pointer Lock</b> (mouse look). To free your cursor to click browser menus, press <code className="bg-emerald-900/60 px-1.5 py-0.5 rounded text-white font-mono">ESC</code>.
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {game.controls && game.controls.length > 0 ? (
                game.controls.map((ctrl, i) => {
                  const parts = ctrl.split(' - ');
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between p-2.5 bg-zinc-950/70 border border-zinc-800/80 rounded-lg"
                    >
                      <span className="font-mono text-emerald-300 font-semibold">
                        {parts[0]}
                      </span>
                      <span className="text-zinc-400">{parts[1] || ''}</span>
                    </div>
                  );
                })
              ) : (
                <div className="text-zinc-400 py-2">
                  Standard keyboard and mouse controls apply.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Multiplayer Servers for Eaglercraft */}
        {activeTab === 'multiplayer' && isEagler && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-zinc-100 mb-2 flex items-center gap-2">
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span>Public Eaglercraft 1.12.2 Multiplayer Servers</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-4">
              In Eaglercraft, go to <b>Multiplayer</b> → <b>Direct Connect</b> or <b>Add Server</b> and enter one of these WebSocket addresses:
            </p>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">ArchMC 1.12.2 Network</div>
                  <div className="text-zinc-500 font-mono text-[11px]">wss://mc.arch.lol</div>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText('wss://mc.arch.lol')}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-[11px] font-mono transition-colors"
                >
                  Copy IP
                </button>
              </div>

              <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Aeon Eagler Survival & Minigames</div>
                  <div className="text-zinc-500 font-mono text-[11px]">wss://aeon-network.net/1.12</div>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText('wss://aeon-network.net/1.12')}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-[11px] font-mono transition-colors"
                >
                  Copy IP
                </button>
              </div>

              <div className="p-3 bg-zinc-950/80 border border-zinc-800 rounded-lg flex items-center justify-between">
                <div>
                  <div className="font-bold text-white">Eagler Asia Multi-Server</div>
                  <div className="text-zinc-500 font-mono text-[11px]">wss://eagler.asia/</div>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText('wss://eagler.asia/')}
                  className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded text-[11px] font-mono transition-colors"
                >
                  Copy IP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: About & JSON Details */}
        {activeTab === 'about' && (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-zinc-100 mb-2">Game Description</h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              {game.description}
            </p>

            <h4 className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
              JSON Storage Configuration
            </h4>
            <pre className="p-3 bg-zinc-950 border border-zinc-800/90 rounded-lg text-[11px] text-emerald-400 font-mono overflow-x-auto">
{JSON.stringify(
  {
    id: game.id,
    title: game.title,
    category: game.category,
    iframeUrl: activeMirrorUrl,
    sandbox: game.sandbox,
    mirrors: game.mirrors ? game.mirrors.length : 0,
  },
  null,
  2
)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import defaultGamesData from './data/games.json';
import { Header } from './components/Header.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayer } from './components/GamePlayer.jsx';
import { EaglercraftSpotlight } from './components/EaglercraftSpotlight.jsx';
import { TabCloakModal, CLOAK_PRESETS } from './components/TabCloakModal.jsx';
import { AddGameModal } from './components/AddGameModal.jsx';
import { Search, Sparkles, Star, History, Flame, RefreshCcw, Gamepad, Info } from 'lucide-react';

const STORAGE_FAVORITES_KEY = 'ubg_favorites_v1';
const STORAGE_RECENT_KEY = 'ubg_recent_v1';
const STORAGE_CUSTOM_KEY = 'ubg_custom_games_v1';
const STORAGE_CLOAK_KEY = 'ubg_tab_cloak_v1';
const STORAGE_PANIC_KEY = 'ubg_panic_url_v1';

export default function App() {
  // Game dataset loaded from JSON
  const [games, setGames] = useState(() => {
    try {
      const savedCustom = localStorage.getItem(STORAGE_CUSTOM_KEY);
      if (savedCustom) {
        const customItems = JSON.parse(savedCustom);
        // Deduplicate with default
        const defaultIds = new Set(defaultGamesData.map((g) => g.id));
        const filteredCustom = customItems.filter((g) => !defaultIds.has(g.id));
        return [...defaultGamesData, ...filteredCustom];
      }
    } catch (e) {
      console.warn('Error reading local games:', e);
    }
    return defaultGamesData;
  });

  // Active view state
  const [selectedGame, setSelectedGame] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Favorites & recents
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_FAVORITES_KEY);
      return saved ? JSON.parse(saved) : ['eaglercraft-1-12-2', 'cookie-clicker'];
    } catch {
      return ['eaglercraft-1-12-2'];
    }
  });

  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_RECENT_KEY);
      return saved ? JSON.parse(saved) : ['eaglercraft-1-12-2'];
    } catch {
      return [];
    }
  });

  // Tab cloaking & stealth
  const [activeCloak, setActiveCloak] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_CLOAK_KEY) || 'default';
    } catch {
      return 'default';
    }
  });

  const [panicUrl, setPanicUrl] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_PANIC_KEY) || 'https://classroom.google.com';
    } catch {
      return 'https://classroom.google.com';
    }
  });

  // Modals
  const [isCloakModalOpen, setIsCloakModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Apply tab cloaking to document head
  const applyTabCloak = useCallback((presetId) => {
    const preset = CLOAK_PRESETS.find((p) => p.id === presetId) || CLOAK_PRESETS[0];
    document.title = preset.tabTitle;

    let favicon = document.getElementById('site-favicon');
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.id = 'site-favicon';
      favicon.rel = 'icon';
      document.head.appendChild(favicon);
    }
    favicon.href = preset.iconSvg;
  }, []);

  useEffect(() => {
    applyTabCloak(activeCloak);
    try {
      localStorage.setItem(STORAGE_CLOAK_KEY, activeCloak);
    } catch {}
  }, [activeCloak, applyTabCloak]);

  // Panic button action
  const handlePanic = useCallback(() => {
    // Hide active game immediately
    setSelectedGame(null);
    // Redirect window to configured safe URL
    window.location.href = panicUrl;
  }, [panicUrl]);

  // Global Panic Key Listener (']' key)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input or textarea
      const target = e.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.key === ']') {
        e.preventDefault();
        handlePanic();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePanic]);

  // Save favorites & recents
  const handleToggleFavorite = (id, e) => {
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      try {
        localStorage.setItem(STORAGE_FAVORITES_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const handleSelectGame = (game) => {
    setSelectedGame(game);
    setRecentlyPlayed((prev) => {
      const next = [game.id, ...prev.filter((id) => id !== game.id)].slice(0, 8);
      try {
        localStorage.setItem(STORAGE_RECENT_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Launch specific mirror
  const handleLaunchMirror = (mirrorUrl) => {
    const eagler = games.find((g) => g.id === 'eaglercraft-1-12-2');
    if (eagler) {
      setSelectedGame({
        ...eagler,
        iframeUrl: mirrorUrl,
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Add custom game
  const handleAddGame = (newGame) => {
    setGames((prev) => {
      const updated = [newGame, ...prev];
      const customOnly = updated.filter((g) => g.id.startsWith('custom-'));
      try {
        localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(customOnly));
      } catch {}
      return updated;
    });
    setSelectedGame(newGame);
  };

  // Export games catalog to JSON file
  const handleExportJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(games, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'games.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import custom games JSON
  const handleImportJson = (importedGames) => {
    if (Array.isArray(importedGames) && importedGames.length > 0) {
      setGames(importedGames);
      try {
        localStorage.setItem(STORAGE_CUSTOM_KEY, JSON.stringify(importedGames));
      } catch {}
    }
  };

  // Reset to default games.json
  const handleResetCatalog = () => {
    if (confirm('Reset games catalog back to original JSON data?')) {
      localStorage.removeItem(STORAGE_CUSTOM_KEY);
      setGames(defaultGamesData);
    }
  };

  // Open game in stealth about:blank window
  const handleOpenBlank = (game, e) => {
    e.stopPropagation();
    try {
      const win = window.open('about:blank', '_blank');
      if (win) {
        win.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>${game.title}</title>
              <style>
                body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #000; }
                iframe { width: 100%; height: 100%; border: none; }
              </style>
            </head>
            <body>
              <iframe src="${game.iframeUrl}" allow="autoplay; fullscreen; pointer-lock; camera; microphone; gamepad"></iframe>
            </body>
          </html>
        `);
        win.document.close();
      }
    } catch {
      window.open(game.iframeUrl, '_blank');
    }
  };

  // Find flagship Eaglercraft 1.12.2 game
  const eaglercraftGame = useMemo(() => {
    return (
      games.find((g) => g.id === 'eaglercraft-1-12-2') ||
      games.find((g) => g.title.toLowerCase().includes('eaglercraft')) ||
      games[0]
    );
  }, [games]);

  // Filtered games
  const filteredGames = useMemo(() => {
    return games.filter((g) => {
      // Category filter
      if (activeCategory === 'favorites') {
        if (!favorites.includes(g.id)) return false;
      } else if (activeCategory === 'recent') {
        if (!recentlyPlayed.includes(g.id)) return false;
      } else if (activeCategory !== 'all') {
        if (g.category.toLowerCase() !== activeCategory.toLowerCase()) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = g.title.toLowerCase().includes(query);
        const matchCat = g.category.toLowerCase().includes(query);
        const matchDesc = g.description.toLowerCase().includes(query);
        return matchTitle || matchCat || matchDesc;
      }

      return true;
    });
  }, [games, activeCategory, searchQuery, favorites, recentlyPlayed]);

  // Categories list
  const categories = [
    { id: 'all', label: 'All Games' },
    { id: 'favorites', label: `Starred (${favorites.length})` },
    { id: 'Sandbox', label: 'Sandbox & Craft' },
    { id: 'Action', label: 'Action & Speed' },
    { id: 'Arcade', label: 'Arcade' },
    { id: 'Retro', label: 'Retro' },
    { id: 'Puzzle', label: 'Puzzle & Logic' },
    { id: 'Sports', label: 'Sports' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-zinc-950">
      {/* Top Bar Navigation */}
      <Header
        onOpenCloakModal={() => setIsCloakModalOpen(true)}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onSelectEaglercraft={() => handleSelectGame(eaglercraftGame)}
        onPanic={handlePanic}
        activeCloak={activeCloak}
        activeFilter={activeCategory}
        onFilterChange={(cat) => {
          setSelectedGame(null);
          setActiveCategory(cat);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedGame ? (
          /* Active Game Player Mode */
          <GamePlayer
            game={selectedGame}
            isFavorite={favorites.includes(selectedGame.id)}
            onBack={() => setSelectedGame(null)}
            onToggleFavorite={handleToggleFavorite}
            onOpenBlank={handleOpenBlank}
          />
        ) : (
          /* Catalog & Browse Mode */
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Flagship Hero Spotlight: Eaglercraft 1.12.2 */}
            {eaglercraftGame && (
              <EaglercraftSpotlight
                game={eaglercraftGame}
                onLaunch={() => handleSelectGame(eaglercraftGame)}
                onLaunchMirror={handleLaunchMirror}
              />
            )}

            {/* Search & Category Filter Bar */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, tag, or description..."
                    className="w-full bg-zinc-900/90 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Catalog Metrics & Reset */}
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span>
                    Showing <b className="text-zinc-200">{filteredGames.length}</b> of{' '}
                    <b className="text-zinc-200">{games.length}</b> games in JSON
                  </span>
                  <button
                    onClick={handleResetCatalog}
                    title="Reset to default games"
                    className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    <RefreshCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Category Segmented Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-zinc-900/90 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850 border border-zinc-800/80'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recently Played Strip (if any) */}
            {recentlyPlayed.length > 0 && activeCategory === 'all' && !searchQuery && (
              <div className="pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                  <History className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Recently Played</span>
                </div>
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {recentlyPlayed
                    .map((id) => games.find((g) => g.id === id))
                    .filter(Boolean)
                    .map((recentGame) => (
                      <button
                        key={recentGame.id}
                        onClick={() => handleSelectGame(recentGame)}
                        className="flex items-center gap-2.5 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:border-emerald-600/60 rounded-xl text-left transition-colors whitespace-nowrap shrink-0 group"
                      >
                        <div
                          className={`w-6 h-6 rounded-md bg-gradient-to-tr ${
                            recentGame.color || 'from-zinc-700 to-zinc-800'
                          } flex items-center justify-center text-xs`}
                        >
                          🎮
                        </div>
                        <span className="text-xs font-bold text-zinc-200 group-hover:text-emerald-400">
                          {recentGame.title}
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Games Grid */}
            <div className="pt-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-emerald-400" />
                  <h2 className="text-base font-bold text-white tracking-tight">
                    {activeCategory === 'all'
                      ? 'All Unblocked Games'
                      : activeCategory === 'favorites'
                      ? 'Starred Games'
                      : `${activeCategory} Games`}
                  </h2>
                </div>
              </div>

              {filteredGames.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredGames.map((game) => (
                    <GameCard
                      key={game.id}
                      game={game}
                      isFavorite={favorites.includes(game.id)}
                      onSelect={handleSelectGame}
                      onToggleFavorite={handleToggleFavorite}
                      onOpenBlank={handleOpenBlank}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center bg-zinc-900/40 border border-zinc-800/80 rounded-2xl p-8">
                  <Gamepad className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                  <h3 className="text-base font-bold text-zinc-200 mb-1">
                    No games found
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-4">
                    {searchQuery
                      ? `No games matching "${searchQuery}". Try another keyword or add it to the JSON file!`
                      : 'There are no games in this category yet.'}
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs rounded-lg transition-colors"
                  >
                    + Add Custom Game
                  </button>
                </div>
              )}
            </div>

            {/* Quick Unblocked Features Info Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-zinc-800/80 text-xs text-zinc-400">
              <div className="p-4 bg-zinc-900/50 border border-zinc-800/80 rounded-xl">
                <div className="font-bold text-zinc-200 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Eaglercraft 1.12.2 Integration</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Real WebAssembly Minecraft client with singleplayer survival worlds, pointer lock mouse steering, and public WebSocket multiplayer servers.
                </p>
              </div>

              <div className="p-4 bg-zinc-900/50 border border-zinc-800/80 rounded-xl">
                <div className="font-bold text-zinc-200 mb-1 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-teal-400" />
                  <span>Stored in JSON Configuration</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Every game is stored as an iframe schema in <code className="text-emerald-400 font-mono">games.json</code>. You can export, edit, or import your own games anytime.
                </p>
              </div>

              <div className="p-4 bg-zinc-900/50 border border-zinc-800/80 rounded-xl">
                <div className="font-bold text-zinc-200 mb-1 flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-400" />
                  <span>Tab Cloak & Stealth Hotkey</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Disguise your browser tab as Google Docs, Classroom, or Drive. Press <kbd className="px-1 py-0.5 bg-zinc-800 text-zinc-300 rounded font-mono">]</kbd> to instantly panic-switch.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-800/80 py-6 bg-zinc-950 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-400">Unblocked Games Vault</span>
            <span aria-hidden="true" className="text-zinc-700">·</span>
            <span>HTML5 & WebAssembly</span>
            <span aria-hidden="true" className="text-zinc-700">·</span>
            <span>JSON Iframe Engine</span>
          </div>
          <div>
            Press <kbd className="px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded text-[11px] font-mono">]</kbd> for instant panic disguise
          </div>
        </div>
      </footer>

      {/* Modals */}
      <TabCloakModal
        isOpen={isCloakModalOpen}
        onClose={() => setIsCloakModalOpen(false)}
        activePreset={activeCloak}
        onSelectPreset={(preset) => {
          setActiveCloak(preset);
          setIsCloakModalOpen(false);
        }}
        panicUrl={panicUrl}
        onUpdatePanicUrl={(url) => {
          setPanicUrl(url);
          try {
            localStorage.setItem(STORAGE_PANIC_KEY, url);
          } catch {}
        }}
        onTriggerPanic={handlePanic}
      />

      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGame={handleAddGame}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
      />
    </div>
  );
}

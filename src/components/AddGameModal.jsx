import React, { useState } from 'react';
import { X, Plus, Download, Upload, FileCode } from 'lucide-react';

export const AddGameModal = ({
  isOpen,
  onClose,
  onAddGame,
  onExportJson,
  onImportJson,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Action');
  const [iframeUrl, setIframeUrl] = useState('');
  const [description, setDescription] = useState('');
  const [controls, setControls] = useState('');
  const [mirror2, setMirror2] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !iframeUrl.trim()) return;

    // Clean iframe url in case user pasted a raw <iframe src="..."> string
    let cleanUrl = iframeUrl.trim();
    const srcMatch = cleanUrl.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      cleanUrl = srcMatch[1];
    }

    const mirrors = [{ name: 'Primary Embed', url: cleanUrl }];
    if (mirror2.trim()) {
      mirrors.push({ name: 'Mirror 2', url: mirror2.trim() });
    }

    const newGame = {
      id: 'custom-' + Date.now(),
      title: title.trim(),
      category,
      description: description.trim() || 'Custom iframe web game added by user.',
      iframeUrl: cleanUrl,
      mirrors,
      controls: controls
        .split('\n')
        .map((c) => c.trim())
        .filter(Boolean),
      sandbox: 'allow-scripts allow-same-origin allow-pointer-lock allow-forms',
      color: 'from-indigo-600 via-purple-700 to-zinc-950',
    };

    onAddGame(newGame);
    onClose();
    // Reset form
    setTitle('');
    setIframeUrl('');
    setDescription('');
    setControls('');
    setMirror2('');
  };

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed)) {
          onImportJson(parsed);
          alert(`Successfully imported ${parsed.length} games from JSON!`);
          onClose();
        } else {
          alert('Invalid JSON: Must be an array of game objects.');
        }
      } catch (err) {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-emerald-400">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Add Custom Iframe Game
              </h3>
              <p className="text-xs text-zinc-400">
                Embed any HTML5 game or unblocked URL into the JSON store
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="py-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
              Game Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Smash Karts, Paper.io, Subway Surfers"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Action">Action</option>
                <option value="Arcade">Arcade</option>
                <option value="Sandbox">Sandbox</option>
                <option value="Puzzle">Puzzle</option>
                <option value="Sports">Sports</option>
                <option value="Retro">Retro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
                Backup Mirror (Optional)
              </label>
              <input
                type="url"
                value={mirror2}
                onChange={(e) => setMirror2(e.target.value)}
                placeholder="https://backup-mirror.com/game"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
              Game Iframe URL or Embed Code *
            </label>
            <input
              type="text"
              required
              value={iframeUrl}
              onChange={(e) => setIframeUrl(e.target.value)}
              placeholder="https://... or <iframe src='...'>"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Quick description of gameplay..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-1">
              Controls (One per line)
            </label>
            <textarea
              rows={2}
              value={controls}
              onChange={(e) => setControls(e.target.value)}
              placeholder="WASD - Move&#10;Space - Jump"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500 font-mono text-[11px]"
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 font-bold text-xs rounded-lg transition-colors"
            >
              Add to Games JSON
            </button>
          </div>
        </form>

        {/* JSON Import / Export Section */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-zinc-400">
            <FileCode className="w-4 h-4 text-emerald-400" />
            <span>Manage games.json:</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="cursor-pointer px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1">
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
              <input
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>

            <button
              type="button"
              onClick={onExportJson}
              className="px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white rounded-lg text-xs font-medium transition-colors flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export games.json</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

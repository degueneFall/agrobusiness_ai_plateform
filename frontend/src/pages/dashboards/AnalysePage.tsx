import React, { useState, useEffect } from 'react';
import { plotsService } from '../../services/plots.service';
import { seedsService } from '../../services/seeds.service';
import { aiCompatibilityService } from '../../services/ai-compatibility.service';
import type { Plot } from '../../services/plots.service';
import type { Seed } from '../../services/seeds.service';

const AnalysePage: React.FC = () => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [selectedPlotId, setSelectedPlotId] = useState<number | null>(null);
  const [selectedSeedId, setSelectedSeedId] = useState<number | null>(null);
  const [compatibility, setCompatibility] = useState<{ compatibilityScore: number; confidenceLevel: number; expectedYield: number | null; reasoning: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const showMessage = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3000);
  };

  useEffect(() => {
    Promise.all([plotsService.getAll(), seedsService.getAll()]).then(([p, s]) => {
      setPlots(p);
      setSeeds(s);
      if (p.length && !selectedPlotId) setSelectedPlotId(p[0].id);
      if (s.length && !selectedSeedId) setSelectedSeedId(s[0].id);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedPlotId || !selectedSeedId) { setCompatibility(null); return; }
    setLoading(true);
    aiCompatibilityService.getCompatibility(selectedPlotId, selectedSeedId)
      .then(setCompatibility)
      .catch(() => setCompatibility(null))
      .finally(() => setLoading(false));
  }, [selectedPlotId, selectedSeedId]);

  const plot = plots.find((p) => p.id === selectedPlotId);
  const seed = seeds.find((s) => s.id === selectedSeedId);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white tracking-tight">Analyse de Compatibilité des Semences</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            {seed?.name ?? 'Semence'} vs. <span className="text-primary font-semibold underline">{plot?.name ?? 'Parcelle'}</span>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => showMessage('Export PDF sera disponible prochainement.')}
            className="flex items-center justify-center rounded-lg h-11 px-5 border border-slate-300 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/10 text-slate-700 dark:text-white text-sm font-bold hover:bg-slate-50 dark:hover:bg-primary/10 transition-all"
          >
            <span className="material-symbols-outlined mr-2 text-lg">download</span> Exporter PDF
          </button>
          <button
            type="button"
            onClick={() => showMessage(compatibility ? 'Simulation lancée avec les paramètres actuels.' : 'Sélectionnez une parcelle et une semence pour lancer la simulation.')}
            className="flex items-center justify-center rounded-lg h-11 px-6 bg-primary text-background-dark text-sm font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20"
          >
            <span className="material-symbols-outlined mr-2 text-lg">play_arrow</span> Lancer Simulation
          </button>
          {actionMessage && (
            <p className="text-sm text-primary font-medium animate-pulse">{actionMessage}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Parcelle</label>
          <select value={selectedPlotId ?? ''} onChange={(e) => setSelectedPlotId(Number(e.target.value) || null)}
            className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 py-2 px-3 text-slate-800 dark:text-white">
            <option value="">—</option>
            {plots.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Semence</label>
          <select value={selectedSeedId ?? ''} onChange={(e) => setSelectedSeedId(Number(e.target.value) || null)}
            className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 py-2 px-3 text-slate-800 dark:text-white">
            <option value="">—</option>
            {seeds.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
      </div>

      {loading && <p className="text-slate-500">Calcul en cours...</p>}
      {!loading && compatibility && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl p-6 bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20 shadow-sm">
              <div className="flex justify-between items-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-tight">Probabilité de Réussite</p>
                <span className="material-symbols-outlined text-primary">trending_up</span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-slate-900 dark:text-white text-4xl font-bold">{compatibility.compatibilityScore}%</p>
              </div>
            </div>
            <div className="rounded-xl p-6 bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20 shadow-sm">
              <div className="flex justify-between items-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-tight">Niveau de Confiance</p>
                <span className="material-symbols-outlined text-blue-500">verified_user</span>
              </div>
              <p className="text-slate-900 dark:text-white text-lg font-bold mt-2">{(compatibility.confidenceLevel * 100).toFixed(0)}%</p>
            </div>
            <div className="rounded-xl p-6 bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20 shadow-sm">
              <div className="flex justify-between items-center">
                <p className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-tight">Rendement attendu</p>
                <span className="material-symbols-outlined text-amber-500">calendar_today</span>
              </div>
              <p className="text-slate-900 dark:text-white text-lg font-bold mt-2">{compatibility.expectedYield != null ? `${compatibility.expectedYield} t/ha` : '—'}</p>
            </div>
          </div>
          {compatibility.reasoning && compatibility.reasoning.length > 0 && (
            <div className="rounded-2xl p-6 bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-primary">eco</span>
                Exigences variété vs. terrain
              </h3>
              <ul className="list-disc list-inside text-sm text-slate-600 dark:text-slate-300 space-y-1">
                {compatibility.reasoning.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
        </>
      )}
      {!loading && !compatibility && selectedPlotId && selectedSeedId && <p className="text-slate-500">Sélectionnez une parcelle et une semence.</p>}
    </div>
  );
};

export default AnalysePage;

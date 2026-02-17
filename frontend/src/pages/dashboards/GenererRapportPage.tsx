import React, { useState, useEffect } from 'react';
import { plotsService } from '../../services/plots.service';
import { reportsService } from '../../services/reports.service';
import type { Plot } from '../../services/plots.service';

const GenererRapportPage: React.FC = () => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [perimetre, setPerimetre] = useState<string>('all');
  const [reportType, setReportType] = useState('soil_health');
  const [includeAi, setIncludeAi] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    plotsService.getAll().then(setPlots).catch(() => setPlots([]));
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setSent(false);
    try {
      const title = perimetre === 'all' ? 'Rapport global' : `Rapport parcelle ${perimetre}`;
      await reportsService.create({
        title,
        reportType: reportType as any,
        parameters: { perimetre, reportType, includeAi },
      });
      setSent(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Génération de rapport</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Choisissez le périmètre et les options du rapport.</p>
      </div>
      {sent && <div className="p-4 bg-primary/10 text-primary rounded-xl text-sm">Rapport créé avec succès.</div>}
      <div className="rounded-2xl p-6 bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Périmètre</label>
          <select value={perimetre} onChange={(e) => setPerimetre(e.target.value)}
            className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 py-2.5 px-3 text-slate-800 dark:text-white">
            <option value="all">Toutes les parcelles</option>
            {plots.map((p) => <option key={p.id} value={String(p.id)}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Type de rapport</label>
          <div className="space-y-2">
            {[
              { value: 'soil_health', label: 'Santé des sols (NDVI)' },
              { value: 'roi', label: 'Rentabilité & ROI' },
              { value: 'recommendations', label: 'Compatibilité semences' },
              { value: 'custom', label: 'Synthèse globale' },
            ].map((opt) => (
              <label key={opt.value} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-emerald-900/20 hover:bg-slate-50 dark:hover:bg-emerald-900/20 cursor-pointer">
                <input type="radio" name="reportType" value={opt.value} checked={reportType === opt.value} onChange={() => setReportType(opt.value)} className="text-primary focus:ring-primary" />
                <span className="text-slate-700 dark:text-slate-200">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={includeAi} onChange={(e) => setIncludeAi(e.target.checked)} className="rounded text-primary focus:ring-primary" />
            <span className="text-sm text-slate-700 dark:text-slate-300">Inclure les recommandations IA</span>
          </label>
        </div>
        <button type="button" onClick={handleGenerate} disabled={loading}
          className="w-full py-3 bg-primary text-background-dark font-bold rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
          <span className="material-symbols-outlined">description</span>
          {loading ? 'Génération...' : 'Générer le rapport'}
        </button>
      </div>
    </div>
  );
};

export default GenererRapportPage;

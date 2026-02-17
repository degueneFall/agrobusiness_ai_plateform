import React, { useState, useEffect } from 'react';
import { reportsService, type Report } from '../../services/reports.service';

const RapportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [superficie, setSuperficie] = useState(200);
  const [coutSemences, setCoutSemences] = useState(85);
  const [irrigation, setIrrigation] = useState(30.5);
  const [engrais, setEngrais] = useState('Hautement azoté (Optimal)');

  useEffect(() => {
    reportsService.getAll().then(setReports).catch(() => setReports([])).finally(() => setLoading(false));
  }, []);

  const handleCalculer = async () => {
    try {
      await reportsService.create({
        title: `Simulation rentabilité - ${superficie} ha`,
        reportType: 'roi',
        parameters: { superficie, coutSemences, irrigation, engrais },
      });
      const list = await reportsService.getAll();
      setReports(list);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="w-full lg:w-80 flex-shrink-0">
        <div className="rounded-xl p-6 bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20">
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-primary">analytics</span>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Outil de Simulation</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Superficie (ha)</label>
              <input type="number" value={superficie} onChange={(e) => setSuperficie(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-900/30 rounded-lg py-2 px-3 text-sm text-slate-800 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Coûts Semences (€/sac)</label>
              <input type="number" step="0.01" value={coutSemences} onChange={(e) => setCoutSemences(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-900/30 rounded-lg py-2 px-3 text-sm text-slate-800 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Irrigation (€/ha)</label>
              <input type="number" step="0.01" value={irrigation} onChange={(e) => setIrrigation(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-900/30 rounded-lg py-2 px-3 text-sm text-slate-800 dark:text-white" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Qualité d&apos;Engrais</label>
              <select value={engrais} onChange={(e) => setEngrais(e.target.value)}
                className="w-full bg-slate-50 dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-900/30 rounded-lg py-2 px-3 text-sm text-slate-800 dark:text-white">
                <option>Hautement azoté (Optimal)</option>
                <option>NPK Standard</option>
                <option>Complément Biologique</option>
              </select>
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-emerald-900/20">
              <button type="button" onClick={handleCalculer}
                className="w-full py-2.5 bg-primary text-background-dark font-bold rounded-lg hover:bg-primary/90 transition-colors">
                Calculer la rentabilité
              </button>
            </div>
          </div>
        </div>
      </aside>
      <div className="flex-1 space-y-6">
        <div className="rounded-2xl p-6 bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">description</span>
            Rapports générés
          </h3>
          {loading ? <p className="text-slate-500">Chargement...</p> : reports.length === 0 ? (
            <p className="text-slate-500 text-sm">Aucun rapport. Lancez une simulation.</p>
          ) : (
            <ul className="space-y-2">
              {reports.map((r) => (
                <li key={r.id} className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-emerald-900/10 last:border-0">
                  <span className="text-slate-800 dark:text-white font-medium">{r.title}</span>
                  <span className="text-xs text-slate-500">{new Date(r.createdAt).toLocaleDateString('fr-FR')}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="rounded-2xl p-6 bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">trending_up</span>
            Tendance ROI
          </h3>
          <div className="h-32 flex items-center justify-center bg-slate-50 dark:bg-emerald-900/20 rounded-xl">
            <p className="text-slate-500 dark:text-slate-400 text-sm">Graphique à connecter aux données de rapports</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RapportsPage;

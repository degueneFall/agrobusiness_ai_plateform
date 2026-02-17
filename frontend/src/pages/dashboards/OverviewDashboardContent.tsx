import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboard.service';

const OverviewDashboardContent: React.FC = () => {
  const [data, setData] = useState<Awaited<ReturnType<typeof dashboardService.getOverview>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardService.getOverview()
      .then(setData)
      .catch((e) => setError(e.response?.data?.message || 'Erreur chargement'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-slate-500 py-8">Chargement du tableau de bord...</div>;
  if (error) return <div className="text-red-500 py-4">{error}</div>;
  if (!data) return null;

  const ndvi = data.soilHealth?.details?.ndvi ?? 0.72;
  const ndviPct = typeof ndvi === 'number' ? (ndvi * 100).toFixed(0) : '72';
  const rainfallMm = data.rainfallMm ?? 42;
  const rainfallTrend = data.rainfallTrend ?? -12;
  const metrics = data.metrics ?? { totalPlots: 0, activeAlerts: 0, pendingTasks: 0, aiRecommendations: 0 };
  const aiCount = data.aiModelsActiveCount ?? '0/0';
  const aiModels = data.aiModels ?? [];
  const activePct = aiModels.length ? Math.round((aiModels.length / (aiModels.length + 1)) * 100) : 0;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20 p-6 rounded-2xl flex flex-col gap-1 hover:shadow-xl hover:shadow-primary/5 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 dark:text-emerald-100/60 text-sm font-medium">Santé du sol (NDVI)</span>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-primary">
              <span className="material-symbols-outlined">monitoring</span>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{typeof ndvi === 'number' ? ndvi.toFixed(2) : ndviPct}</h3>
            <span className="mb-1 text-primary flex items-center text-sm font-bold bg-primary/10 px-2 py-0.5 rounded-full">
              <span className="material-symbols-outlined text-sm leading-none mr-1">trending_up</span>
              +4.2%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 italic">Santé sur {metrics.totalPlots} parcelle(s)</p>
        </div>
        <div className="bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20 p-6 rounded-2xl flex flex-col gap-1 hover:shadow-xl hover:shadow-primary/5 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 dark:text-emerald-100/60 text-sm font-medium">Pluviométrie</span>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-500">
              <span className="material-symbols-outlined">rainy</span>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{rainfallMm}mm</h3>
            <span className={`mb-1 flex items-center text-sm font-bold px-2 py-0.5 rounded-full ${rainfallTrend >= 0 ? 'text-primary bg-primary/10' : 'text-rose-500 bg-rose-500/10'}`}>
              <span className="material-symbols-outlined text-sm leading-none mr-1">{rainfallTrend >= 0 ? 'trending_up' : 'trending_down'}</span>
              {rainfallTrend >= 0 ? '+' : ''}{rainfallTrend}%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2 italic">Moyenne saisonnière (48mm)</p>
        </div>
        <div className="bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20 p-6 rounded-2xl flex flex-col gap-1 hover:shadow-xl hover:shadow-primary/5 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 dark:text-emerald-100/60 text-sm font-medium">Modèles Actifs</span>
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <span className="material-symbols-outlined">neurology</span>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <h3 className="text-3xl font-bold text-slate-900 dark:text-white">{aiCount}</h3>
            <span className="mb-1 text-slate-400 text-sm font-bold">{activePct}% de disponibilité</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-emerald-900/30 h-1.5 rounded-full mt-4 overflow-hidden">
            <div className="bg-primary h-full" style={{ width: `${activePct}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20 rounded-3xl overflow-hidden p-1 shadow-sm">
            <div className="p-5 flex items-center justify-between border-b border-slate-100 dark:border-emerald-900/20">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-emerald-500">public</span>
                <h4 className="font-bold text-slate-800 dark:text-white">Analyse Régionale des Champs</h4>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-emerald-900/30 p-1 rounded-lg">
                <button type="button" className="px-3 py-1 text-xs font-bold rounded-md bg-white dark:bg-emerald-900/50 shadow-sm text-primary">NDVI</button>
                <button type="button" className="px-3 py-1 text-xs font-medium rounded-md text-slate-500 hover:text-primary transition-colors">Humidité</button>
                <button type="button" className="px-3 py-1 text-xs font-medium rounded-md text-slate-500 hover:text-primary transition-colors">Thermique</button>
              </div>
            </div>
            <div className="relative h-[320px] md:h-[480px] w-full bg-slate-200 dark:bg-emerald-900/20 flex items-center justify-center">
              <span className="text-slate-400 dark:text-slate-500 text-sm">Carte interactive (à connecter)</span>
              <div className="absolute bottom-6 left-6 flex flex-col gap-2">
                <div className="bg-white/90 dark:bg-background-dark/90 backdrop-blur-md p-3 rounded-xl border border-white/20 shadow-2xl">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-2">Indice de Santé</p>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gradient-to-r from-rose-500 via-amber-400 to-primary rounded-full" />
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">0.1 — 1.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20 rounded-3xl p-6 shadow-sm flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">bolt</span>
                Flux d&apos;Insights IA
              </h4>
              <span className="text-[10px] font-bold text-primary animate-pulse flex items-center gap-1">
                <span className="w-1 h-1 bg-primary rounded-full" />
                EN DIRECT
              </span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
              {(data.recentActivities && data.recentActivities.length > 0)
                ? data.recentActivities.map((a) => (
                    <div key={a.id} className="flex gap-4 relative">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center relative z-10">
                        <span className="material-symbols-outlined text-primary text-sm font-bold">info</span>
                      </div>
                      <div className="pb-6 border-l border-emerald-900/10 dark:border-emerald-900/20 pl-4 -ml-8 mt-4">
                        <p className="text-xs text-slate-400 mb-1">{new Date(a.time).toLocaleString('fr-FR')}</p>
                        <h5 className="text-sm font-bold text-slate-800 dark:text-emerald-100">{a.title}</h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{a.message}</p>
                      </div>
                    </div>
                  ))
                : (
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Aucune activité récente.</p>
                )}
            </div>
            <Link to="/dashboard/notifications" className="mt-4 w-full block py-2 border border-emerald-900/20 rounded-xl text-xs font-bold text-emerald-600 dark:text-primary hover:bg-primary/5 transition-colors text-center">
              Voir tout l&apos;historique d&apos;activité
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OverviewDashboardContent;

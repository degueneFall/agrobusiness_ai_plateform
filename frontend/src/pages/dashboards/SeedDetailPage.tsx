import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { seedsService, type Seed } from '../../services/seeds.service';

const waterLabel: Record<string, string> = { low: 'Faible', medium: 'Moyen', high: 'Élevé' };
const cropLabel: Record<string, string> = { corn: 'Maïs', wheat: 'Blé', soybean: 'Soja', sunflower: 'Tournesol', rice: 'Riz', millet: 'Mil', sorghum: 'Sorgho', other: 'Autre' };

const SeedDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [seed, setSeed] = useState<Seed | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    seedsService.getOne(Number(id)).then(setSeed).catch(() => setError('Semence introuvable')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-slate-500">Chargement...</p>;
  if (error || !seed) return <p className="text-red-500">{error ?? 'Semence introuvable'}</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/dashboard/semences" className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-emerald-900/30">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{seed.name}</h1>
      </div>
      <div className="rounded-2xl p-6 bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20 space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-primary/10">
            <span className="material-symbols-outlined text-4xl text-primary">grass</span>
          </div>
          <div>
            <span className="text-xs font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full">{seed.varietyCode ?? seed.id}</span>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{cropLabel[seed.cropType] ?? seed.cropType}</p>
          </div>
        </div>
        {seed.description && <p className="text-slate-600 dark:text-slate-300">{seed.description}</p>}
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-slate-500 dark:text-slate-400 font-medium">Rendement potentiel</dt>
            <dd className="font-semibold text-slate-800 dark:text-white">{seed.yieldPotential != null ? `${seed.yieldPotential} t/ha` : '—'}</dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400 font-medium">Cycle de croissance</dt>
            <dd className="font-semibold text-slate-800 dark:text-white">{seed.growthCycleDays != null ? `${seed.growthCycleDays} jours` : '—'}</dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400 font-medium">Besoin en eau</dt>
            <dd className="font-semibold text-slate-800 dark:text-white">{seed.waterRequirement ? waterLabel[seed.waterRequirement] : '—'}</dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400 font-medium">pH optimal</dt>
            <dd className="font-semibold text-slate-800 dark:text-white">
              {seed.optimalPhMin != null && seed.optimalPhMax != null ? `${seed.optimalPhMin} – ${seed.optimalPhMax}` : '—'}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400 font-medium">Type de sol</dt>
            <dd className="font-semibold text-slate-800 dark:text-white">{seed.optimalSoilType ?? '—'}</dd>
          </div>
          <div>
            <dt className="text-slate-500 dark:text-slate-400 font-medium">Prix / kg</dt>
            <dd className="font-semibold text-slate-800 dark:text-white">{seed.pricePerKg != null ? `${seed.pricePerKg} €` : '—'}</dd>
          </div>
        </dl>
        <div className="flex gap-2 pt-2">
          <span className={`px-2 py-1 rounded text-xs font-medium ${seed.droughtResistant ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200' : 'bg-slate-100 text-slate-500'}`}>
            Résistance sécheresse
          </span>
          <span className={`px-2 py-1 rounded text-xs font-medium ${seed.nitrogenEfficient ? 'bg-primary/20 text-primary' : 'bg-slate-100 text-slate-500'}`}>
            Efficace azote
          </span>
        </div>
      </div>
      <Link to="/dashboard/analyse" className="inline-flex items-center gap-2 py-2 px-4 rounded-lg bg-primary text-white font-medium hover:brightness-110">
        <span className="material-symbols-outlined">bar_chart</span>
        Analyser la compatibilité
      </Link>
    </div>
  );
};

export default SeedDetailPage;

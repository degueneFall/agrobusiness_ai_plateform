import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { seedsService, type Seed } from '../../services/seeds.service';

const waterLabel: Record<string, string> = { low: 'Faible', medium: 'Moyen', high: 'Élevé' };
const cropLabel: Record<string, string> = { corn: 'Maïs', wheat: 'Blé', soybean: 'Soja', sunflower: 'Tournesol', rice: 'Riz', millet: 'Mil', sorghum: 'Sorgho', other: 'Autre' };

const CatalogueSemencesPage: React.FC = () => {
  const [seeds, setSeeds] = useState<Seed[]>([]);
  const [loading, setLoading] = useState(true);
  const [soilType, setSoilType] = useState<string>('');
  const [phRange, setPhRange] = useState(7);
  const [waterReq, setWaterReq] = useState<string>('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string | number> = {};
    if (soilType) params.optimalSoilType = soilType;
    if (waterReq) params.waterRequirement = waterReq;
    params.phMin = phRange - 0.5;
    params.phMax = phRange + 0.5;
    if (search.trim()) params.search = search.trim();
    seedsService.getAll(params).then(setSeeds).catch(() => setSeeds([])).finally(() => setLoading(false));
  }, [soilType, phRange, waterReq, search]);

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
        <div className="rounded-xl p-6 bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20">
          <h3 className="text-[10px] font-bold text-slate-400 dark:text-emerald-700 uppercase tracking-widest mb-4">Filtres</h3>
          <div className="space-y-6">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">TYPE DE SOL</label>
              <div className="flex flex-wrap gap-2">
                {['clay', 'sandy', 'loamy', 'humus'].map((s) => (
                  <button key={s} type="button" onClick={() => setSoilType(soilType === s ? '' : s)}
                    className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${soilType === s ? 'bg-primary text-background-dark' : 'bg-slate-100 dark:bg-emerald-900/30 text-slate-500 dark:text-slate-400 hover:bg-primary/20'}`}
                  >
                    {s === 'clay' ? 'Argileux' : s === 'sandy' ? 'Sableux' : s === 'loamy' ? 'Limoneux' : 'Humifère'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">PLAGE DE PH</label>
                <span className="text-[10px] bg-primary/20 text-primary px-1.5 rounded">{phRange - 0.5} - {phRange + 0.5}</span>
              </div>
              <input type="range" min="0" max="14" value={phRange} onChange={(e) => setPhRange(Number(e.target.value))} className="w-full cursor-pointer accent-primary" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-2">BESOINS EN EAU</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-emerald-900/20 p-1 rounded-lg">
                {(['low', 'medium', 'high'] as const).map((w) => (
                  <button key={w} type="button" onClick={() => setWaterReq(waterReq === w ? '' : w)}
                    className={`py-1.5 rounded text-[10px] font-medium ${waterReq === w ? 'bg-primary text-background-dark' : 'text-slate-600 dark:text-slate-300 hover:bg-primary/20'}`}
                  >
                    {waterLabel[w]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>
      <div className="flex-1">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Catalogue de Semences</h2>
          <div className="relative w-48">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input type="text" placeholder="Rechercher..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/10 text-sm text-slate-800 dark:text-white" />
          </div>
        </div>
        {loading ? (
          <p className="text-slate-500">Chargement...</p>
        ) : seeds.length === 0 ? (
          <p className="text-slate-500">Aucune semence ne correspond aux filtres.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {seeds.map((s) => (
              <div key={s.id} className="rounded-xl p-5 bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-3">
                  <span className="material-symbols-outlined text-3xl text-primary">grass</span>
                  <span className="text-xs font-bold bg-primary/20 text-primary px-2 py-0.5 rounded-full">{s.varietyCode || s.id}</span>
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white">{s.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{cropLabel[s.cropType] || s.cropType}</p>
                <div className="mt-4 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <p>Rendement: <span className="font-semibold text-primary">{s.yieldPotential != null ? `${s.yieldPotential} t/ha` : '—'}</span></p>
                  <p>pH: {s.optimalPhMin != null && s.optimalPhMax != null ? `${s.optimalPhMin} – ${s.optimalPhMax}` : '—'} • Eau: {s.waterRequirement ? waterLabel[s.waterRequirement] : '—'}</p>
                </div>
                <Link to={`/dashboard/semences/${s.id}`} className="mt-4 w-full block py-2 rounded-lg bg-primary/10 text-primary text-sm font-bold hover:bg-primary/20 transition-colors text-center">
                  Voir détail
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogueSemencesPage;

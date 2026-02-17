import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { plotsService, type Plot } from '../../services/plots.service';
import { regionsService, type Region } from '../../services/regions.service';
import { getApiErrorMessage } from '../../services/api';

const soilLabel: Record<string, string> = { clay: 'Argileux', sandy: 'Sableux', loamy: 'Limoneux', humus: 'Humifère', mixed: 'Mixte' };
const soilTypes = ['clay', 'sandy', 'loamy', 'humus', 'mixed'] as const;
const statusLabel: Record<string, string> = { active: 'Active', fallow: 'En jachère', preparation: 'Préparation' };
const statusOptions = ['active', 'fallow', 'preparation'] as const;

const CartographiePage: React.FC = () => {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    areaHectares: '',
    regionId: '' as string | number,
    soilType: '',
    soilPh: '',
    status: 'active',
  });

  const loadPlots = () => {
    plotsService.getAll().then(setPlots).catch(() => setPlots([])).finally(() => setLoading(false));
  };

  useEffect(() => {
    setLoading(true);
    loadPlots();
    regionsService.getAll().then(setRegions).catch(() => setRegions([]));
  }, []);

  const filtered = search.trim()
    ? plots.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    : plots;

  const tag = (p: Plot) => {
    const ndvi = p.ndviScore != null ? Number(p.ndviScore) : null;
    if (ndvi != null && ndvi >= 0.7) return { label: 'Rendement Élevé', class: 'bg-primary/20 text-primary' };
    if (ndvi != null && ndvi < 0.5) return { label: 'Irrigation', class: 'bg-yellow-500/20 text-yellow-500' };
    return { label: 'Stable', class: 'bg-blue-500/20 text-blue-500' };
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const area = parseFloat(form.areaHectares);
    if (!form.name.trim()) {
      setError('Nom obligatoire.');
      return;
    }
    if (Number.isNaN(area) || area <= 0) {
      setError('Surface en hectares invalide.');
      return;
    }
    setSaving(true);
    try {
      await plotsService.create({
        name: form.name.trim(),
        areaHectares: area,
        regionId: form.regionId ? Number(form.regionId) : undefined,
        soilType: form.soilType || undefined,
        soilPh: form.soilPh ? parseFloat(form.soilPh) : undefined,
        status: form.status,
      });
      setModalOpen(false);
      setForm({ name: '', areaHectares: '', regionId: '', soilType: '', soilPh: '', status: 'active' });
      loadPlots();
    } catch (err: any) {
      setError(getApiErrorMessage(err, 'Erreur lors de la création.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-0">
      <aside className="w-full lg:w-80 flex-shrink-0 flex flex-col border border-slate-200 dark:border-emerald-900/20 rounded-2xl bg-white dark:bg-emerald-900/5 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-emerald-900/20">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-slate-500 text-lg">search</span>
            <input
              type="text"
              placeholder="Rechercher des parcelles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-900/30 rounded-lg pl-10 py-2 text-sm focus:ring-2 focus:ring-primary/50 text-slate-800 dark:text-white"
            />
          </div>
          <div className="flex items-center justify-between mt-4">
            <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Zones Agricoles</h2>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-primary text-white text-xs font-bold hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-lg">add</span>
              Nouvelle parcelle
            </button>
          </div>
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mt-4">Parcelles</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {loading ? (
            <p className="text-slate-500">Chargement...</p>
          ) : filtered.length === 0 ? (
            <p className="text-slate-500 text-sm">Aucune parcelle. Cliquez sur « Nouvelle parcelle » pour en créer une.</p>
          ) : (
            filtered.map((p) => {
              const t = tag(p);
              return (
                <div
                  key={p.id}
                  className="group p-3 rounded-xl bg-slate-50 dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20 hover:border-primary/50 transition-all cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="h-10 w-10 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-slate-500 text-xl">terrain</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${t.class}`}>{t.label}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-white">{p.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{p.areaHectares} ha • {p.soilType ? soilLabel[p.soilType] || p.soilType : '—'}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[10px]">
                    <span className="text-slate-500 uppercase">NDVI: <span className="text-primary font-bold">{p.ndviScore != null ? Number(p.ndviScore).toFixed(2) : '—'}</span></span>
                    <span className="text-slate-500 uppercase">pH: <span className="text-slate-700 dark:text-slate-200 font-bold">{p.soilPh != null ? Number(p.soilPh) : '—'}</span></span>
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="p-4 border-t border-slate-100 dark:border-emerald-900/20">
          <Link to="/dashboard/rapports/generer" className="block w-full bg-primary text-background-dark font-bold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors text-center">
            <span className="material-symbols-outlined text-lg">description</span>
            Générer Rapport IA
          </Link>
        </div>
      </aside>
      <section className="flex-1 min-h-[400px] rounded-2xl bg-slate-100 dark:bg-emerald-900/20 border border-slate-200 dark:border-emerald-900/20 overflow-hidden flex items-center justify-center">
        <div className="text-center p-8">
          <span className="material-symbols-outlined text-6xl text-slate-400 dark:text-slate-500 mb-4">map</span>
          <p className="text-slate-600 dark:text-slate-400 font-medium">Cartographie interactive</p>
          <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">{plots.length} parcelle(s) — carte à connecter (Leaflet/Mapbox)</p>
        </div>
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => !saving && setModalOpen(false)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 dark:border-emerald-900/30" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Nouvelle parcelle</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Nom *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 px-3 py-2 text-slate-800 dark:text-white"
                  placeholder="ex. Parcelle Nord A"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Surface (ha) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.areaHectares}
                  onChange={(e) => setForm((f) => ({ ...f, areaHectares: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 px-3 py-2 text-slate-800 dark:text-white"
                  placeholder="ex. 12.5"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Région</label>
                <select
                  value={form.regionId}
                  onChange={(e) => setForm((f) => ({ ...f, regionId: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 px-3 py-2 text-slate-800 dark:text-white"
                >
                  <option value="">— Aucune —</option>
                  {regions.map((r) => (
                    <option key={r.id} value={r.id}>{r.name} ({r.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Type de sol</label>
                <select
                  value={form.soilType}
                  onChange={(e) => setForm((f) => ({ ...f, soilType: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 px-3 py-2 text-slate-800 dark:text-white"
                >
                  <option value="">— Aucun —</option>
                  {soilTypes.map((s) => (
                    <option key={s} value={s}>{soilLabel[s]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">pH du sol</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  value={form.soilPh}
                  onChange={(e) => setForm((f) => ({ ...f, soilPh: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 px-3 py-2 text-slate-800 dark:text-white"
                  placeholder="ex. 6.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Statut</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 px-3 py-2 text-slate-800 dark:text-white"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{statusLabel[s]}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} disabled={saving} className="flex-1 py-2 rounded-lg border border-slate-300 dark:border-emerald-900/30 text-slate-700 dark:text-slate-300 font-medium disabled:opacity-50">
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="flex-1 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-50">
                  {saving ? 'Création…' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartographiePage;

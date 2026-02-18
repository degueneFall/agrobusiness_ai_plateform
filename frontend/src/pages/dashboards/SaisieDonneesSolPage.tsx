import React, { useState, useEffect } from 'react';
import { plotsService, type Plot } from '../../services/plots.service';
import { soilDataService, type SoilType, type CreateSoilDataDto } from '../../services/soil-data.service';
import { getApiErrorMessage } from '../../services/api';

const SaisieDonneesSolPage: React.FC = () => {
    const [plots, setPlots] = useState<Plot[]>([]);
    const [soilTypes, setSoilTypes] = useState<SoilType[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [form, setForm] = useState<CreateSoilDataDto>({
        idParcelle: 0,
        ph: undefined,
        azote: undefined,
        phosphore: undefined,
        potassium: undefined,
        humidite: undefined,
        idSol: undefined,
        dateMesure: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        Promise.all([
            plotsService.getAll(),
            soilDataService.getSoilTypes(),
        ])
            .then(([plotsData, soilTypesData]) => {
                setPlots(plotsData);
                setSoilTypes(soilTypesData);
                if (plotsData.length > 0) {
                    setForm((f) => ({ ...f, idParcelle: plotsData[0].id }));
                }
            })
            .catch(() => {
                setError('Erreur lors du chargement des données.');
            })
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);

        if (!form.idParcelle) {
            setError('Veuillez sélectionner une parcelle.');
            return;
        }

        // Validate pH range
        if (form.ph !== undefined && (form.ph < 0 || form.ph > 14)) {
            setError('Le pH doit être entre 0 et 14.');
            return;
        }

        // Validate humidity range
        if (form.humidite !== undefined && (form.humidite < 0 || form.humidite > 100)) {
            setError("L'humidité doit être entre 0 et 100%.");
            return;
        }

        // Validate NPK values
        if (form.azote !== undefined && form.azote < 0) {
            setError("L'azote ne peut pas être négatif.");
            return;
        }
        if (form.phosphore !== undefined && form.phosphore < 0) {
            setError('Le phosphore ne peut pas être négatif.');
            return;
        }
        if (form.potassium !== undefined && form.potassium < 0) {
            setError('Le potassium ne peut pas être négatif.');
            return;
        }

        setSaving(true);
        try {
            await soilDataService.createSoilData(form);
            setSuccess(true);
            // Reset form except date and parcelle
            setForm((f) => ({
                ...f,
                ph: undefined,
                azote: undefined,
                phosphore: undefined,
                potassium: undefined,
                humidite: undefined,
                idSol: undefined,
            }));
            setTimeout(() => setSuccess(false), 5000);
        } catch (err: any) {
            setError(getApiErrorMessage(err, 'Erreur lors de la saisie des données.'));
        } finally {
            setSaving(false);
        }
    };

    const selectedPlot = plots.find((p) => p.id === form.idParcelle);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-primary animate-spin">refresh</span>
                    <p className="text-slate-600 dark:text-slate-400 mt-4">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
                    Saisie des Données Sol
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    Enregistrez les analyses NPK, pH et humidité de vos parcelles
                </p>
            </div>

            {/* Info banner */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">info</span>
                    <div>
                        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
                            À propos des analyses de sol
                        </h3>
                        <p className="text-sm text-blue-800 dark:text-blue-400">
                            Les données NPK (Azote, Phosphore, Potassium) et le pH sont essentiels pour déterminer la compatibilité avec les semences recommandées par l'IA.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Form */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-emerald-900/5 border border-slate-200 dark:border-emerald-900/20 rounded-2xl p-6">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Parcelle selection */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Parcelle *
                                </label>
                                <select
                                    value={form.idParcelle}
                                    onChange={(e) => setForm((f) => ({ ...f, idParcelle: Number(e.target.value) }))}
                                    className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary/50"
                                    required
                                >
                                    {plots.length === 0 ? (
                                        <option value="">Aucune parcelle disponible</option>
                                    ) : (
                                        plots.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name} ({p.areaHectares} ha)
                                            </option>
                                        ))
                                    )}
                                </select>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Date de mesure *
                                </label>
                                <input
                                    type="date"
                                    value={form.dateMesure}
                                    onChange={(e) => setForm((f) => ({ ...f, dateMesure: e.target.value }))}
                                    max={new Date().toISOString().split('T')[0]}
                                    className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary/50"
                                    required
                                />
                            </div>

                            {/* NPK Section */}
                            <div className="border-t border-slate-200 dark:border-emerald-900/20 pt-5">
                                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-lg text-primary">science</span>
                                    Analyse NPK (kg/ha)
                                </h3>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                            Azote (N)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={form.azote ?? ''}
                                            onChange={(e) => setForm((f) => ({ ...f, azote: e.target.value ? parseFloat(e.target.value) : undefined }))}
                                            className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 px-3 py-2 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary/50"
                                            placeholder="ex. 45"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                            Phosphore (P)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={form.phosphore ?? ''}
                                            onChange={(e) => setForm((f) => ({ ...f, phosphore: e.target.value ? parseFloat(e.target.value) : undefined }))}
                                            className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 px-3 py-2 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary/50"
                                            placeholder="ex. 30"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                                            Potassium (K)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={form.potassium ?? ''}
                                            onChange={(e) => setForm((f) => ({ ...f, potassium: e.target.value ? parseFloat(e.target.value) : undefined }))}
                                            className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 px-3 py-2 text-slate-800 dark:text-white text-sm focus:ring-2 focus:ring-primary/50"
                                            placeholder="ex. 150"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* pH and Humidity */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        pH du sol
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="14"
                                        value={form.ph ?? ''}
                                        onChange={(e) => setForm((f) => ({ ...f, ph: e.target.value ? parseFloat(e.target.value) : undefined }))}
                                        className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary/50"
                                        placeholder="ex. 6.8"
                                    />
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Valeur entre 0 et 14</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Humidité (%)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        max="100"
                                        value={form.humidite ?? ''}
                                        onChange={(e) => setForm((f) => ({ ...f, humidite: e.target.value ? parseFloat(e.target.value) : undefined }))}
                                        className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary/50"
                                        placeholder="ex. 22.5"
                                    />
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Valeur entre 0 et 100</p>
                                </div>
                            </div>

                            {/* Soil Type */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                    Type de sol
                                </label>
                                <select
                                    value={form.idSol ?? ''}
                                    onChange={(e) => setForm((f) => ({ ...f, idSol: e.target.value ? Number(e.target.value) : undefined }))}
                                    className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 px-4 py-3 text-slate-800 dark:text-white focus:ring-2 focus:ring-primary/50"
                                >
                                    <option value="">— Non spécifié —</option>
                                    {soilTypes.map((st) => (
                                        <option key={st.id} value={st.id}>
                                            {st.typeSol}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Messages */}
                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg p-4">
                                    <p className="text-sm text-red-800 dark:text-red-300 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg">error</span>
                                        {error}
                                    </p>
                                </div>
                            )}

                            {success && (
                                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/30 rounded-lg p-4">
                                    <p className="text-sm text-green-800 dark:text-green-300 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-lg">check_circle</span>
                                        Données enregistrées avec succès !
                                    </p>
                                </div>
                            )}

                            {/* Submit button */}
                            <button
                                type="submit"
                                disabled={saving || plots.length === 0}
                                className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="material-symbols-outlined text-xl">save</span>
                                {saving ? 'Enregistrement...' : 'Enregistrer les données'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Info sidebar */}
                <div className="space-y-4">
                    {/* Selected plot info */}
                    {selectedPlot && (
                        <div className="bg-white dark:bg-emerald-900/5 border border-slate-200 dark:border-emerald-900/20 rounded-2xl p-5">
                            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg text-primary">terrain</span>
                                Parcelle sélectionnée
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">Nom:</span>
                                    <span className="font-semibold text-slate-800 dark:text-white">{selectedPlot.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600 dark:text-slate-400">Surface:</span>
                                    <span className="font-semibold text-slate-800 dark:text-white">{selectedPlot.areaHectares} ha</span>
                                </div>
                                {selectedPlot.soilType && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">Sol:</span>
                                        <span className="font-semibold text-slate-800 dark:text-white">{selectedPlot.soilType}</span>
                                    </div>
                                )}
                                {selectedPlot.soilPh && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-600 dark:text-slate-400">pH actuel:</span>
                                        <span className="font-semibold text-slate-800 dark:text-white">{selectedPlot.soilPh}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* NPK Guide */}
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border border-primary/20 rounded-2xl p-5">
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-white mb-3">
                            Guide NPK
                        </h3>
                        <div className="space-y-3 text-xs text-slate-700 dark:text-slate-300">
                            <div>
                                <span className="font-bold text-primary">Azote (N):</span> Favorise la croissance végétative et la couleur verte des feuilles
                            </div>
                            <div>
                                <span className="font-bold text-primary">Phosphore (P):</span> Stimule le développement racinaire et la floraison
                            </div>
                            <div>
                                <span className="font-bold text-primary">Potassium (K):</span> Renforce la résistance aux maladies et améliore la qualité
                            </div>
                        </div>
                    </div>

                    {/* pH Scale */}
                    <div className="bg-white dark:bg-emerald-900/5 border border-slate-200 dark:border-emerald-900/20 rounded-2xl p-5">
                        <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                            Échelle pH
                        </h3>
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span className="text-slate-600 dark:text-slate-400">0-5.5: Très acide</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                <span className="text-slate-600 dark:text-slate-400">5.5-6.5: Acide</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                <span className="text-slate-600 dark:text-slate-400">6.5-7.5: Neutre (optimal)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                <span className="text-slate-600 dark:text-slate-400">7.5-8.5: Alcalin</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                                <span className="text-slate-600 dark:text-slate-400">8.5+: Très alcalin</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SaisieDonneesSolPage;

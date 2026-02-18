import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { plotsService, type Plot } from '../../services/plots.service';
import { soilDataService, type SoilData } from '../../services/soil-data.service';
import { getApiErrorMessage } from '../../services/api';

const soilLabel: Record<string, string> = {
    clay: 'Argileux',
    sandy: 'Sableux',
    loamy: 'Limoneux',
    humus: 'Humifère',
    mixed: 'Mixte'
};

const statusLabel: Record<string, string> = {
    active: 'Active',
    fallow: 'En jachère',
    preparation: 'Préparation'
};

const DetailParcelePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [plot, setPlot] = useState<Plot | null>(null);
    const [soilData, setSoilData] = useState<SoilData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        const plotId = parseInt(id, 10);

        Promise.all([
            plotsService.getOne(plotId),
            soilDataService.getSoilDataByPlot(plotId).catch(() => []),
        ])
            .then(([plotData, soilDataArray]) => {
                setPlot(plotData);
                setSoilData(soilDataArray);
            })
            .catch((err) => {
                setError(getApiErrorMessage(err, 'Erreur lors du chargement de la parcelle.'));
            })
            .finally(() => setLoading(false));
    }, [id]);

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

    if (error || !plot) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <span className="material-symbols-outlined text-6xl text-red-500">error</span>
                    <p className="text-red-600 dark:text-red-400 mt-4">{error || 'Parcelle non trouvée'}</p>
                    <Link
                        to="/dashboard/cartographie"
                        className="mt-4 inline-block text-primary hover:underline"
                    >
                        ← Retour à la cartographie
                    </Link>
                </div>
            </div>
        );
    }

    const latestSoilData = soilData.length > 0 ? soilData[0] : null;
    const ndvi = plot.ndviScore != null ? Number(plot.ndviScore) : null;

    // Determine health status
    const getHealthStatus = () => {
        if (ndvi != null && ndvi >= 0.7) return { label: 'Excellent', color: 'bg-green-500', icon: 'check_circle' };
        if (ndvi != null && ndvi >= 0.5) return { label: 'Bon', color: 'bg-blue-500', icon: 'info' };
        if (ndvi != null && ndvi < 0.5) return { label: 'Attention', color: 'bg-yellow-500', icon: 'warning' };
        return { label: 'Non évalué', color: 'bg-slate-400', icon: 'help' };
    };

    const healthStatus = getHealthStatus();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link
                        to="/dashboard/cartographie"
                        className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary mb-2 inline-flex items-center gap-1"
                    >
                        <span className="material-symbols-outlined text-lg">arrow_back</span>
                        Retour à la cartographie
                    </Link>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white mt-2">
                        {plot.name}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">
                        Centre de contrôle technique
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        to={`/dashboard/saisie-donnees-sol?plot=${plot.id}`}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
                    >
                        <span className="material-symbols-outlined">science</span>
                        Nouvelle analyse sol
                    </Link>
                </div>
            </div>

            {/* Status Banner */}
            <div className={`${healthStatus.color} text-white rounded-2xl p-6 shadow-lg`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-white/20 rounded-xl flex items-center justify-center">
                            <span className="material-symbols-outlined text-4xl">{healthStatus.icon}</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">État de santé : {healthStatus.label}</h2>
                            <p className="text-white/80 mt-1">
                                Dernière mise à jour : {plot.lastNdviUpdate ? new Date(plot.lastNdviUpdate).toLocaleDateString('fr-FR') : 'Jamais'}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-5xl font-bold">{ndvi != null ? ndvi.toFixed(2) : '—'}</div>
                        <div className="text-white/80 text-sm uppercase tracking-wide">NDVI Score</div>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Info Cards */}
                <div className="lg:col-span-2 space-y-6">
                    {/* General Info */}
                    <div className="bg-white dark:bg-emerald-900/5 border border-slate-200 dark:border-emerald-900/20 rounded-2xl p-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">info</span>
                            Informations Générales
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Surface</p>
                                <p className="text-2xl font-bold text-slate-800 dark:text-white">{plot.areaHectares} ha</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Statut</p>
                                <span className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                                    {statusLabel[plot.status] || plot.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Type de sol</p>
                                <p className="text-lg font-semibold text-slate-800 dark:text-white">
                                    {plot.soilType ? soilLabel[plot.soilType] || plot.soilType : 'Non spécifié'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">pH du sol</p>
                                <p className="text-lg font-semibold text-slate-800 dark:text-white">
                                    {plot.soilPh != null ? Number(plot.soilPh).toFixed(1) : 'Non mesuré'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Latest Soil Analysis */}
                    {latestSoilData ? (
                        <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 border border-primary/20 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">science</span>
                                    Dernière Analyse NPK
                                </h3>
                                <span className="text-sm text-slate-600 dark:text-slate-400">
                                    {new Date(latestSoilData.dateMesure).toLocaleDateString('fr-FR')}
                                </span>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="bg-white/50 dark:bg-white/10 rounded-xl p-4 text-center">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Azote (N)</p>
                                    <p className="text-3xl font-bold text-primary">
                                        {latestSoilData.azote != null ? latestSoilData.azote.toFixed(1) : '—'}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">kg/ha</p>
                                </div>
                                <div className="bg-white/50 dark:bg-white/10 rounded-xl p-4 text-center">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Phosphore (P)</p>
                                    <p className="text-3xl font-bold text-primary">
                                        {latestSoilData.phosphore != null ? latestSoilData.phosphore.toFixed(1) : '—'}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">kg/ha</p>
                                </div>
                                <div className="bg-white/50 dark:bg-white/10 rounded-xl p-4 text-center">
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Potassium (K)</p>
                                    <p className="text-3xl font-bold text-primary">
                                        {latestSoilData.potassium != null ? latestSoilData.potassium.toFixed(1) : '—'}
                                    </p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">kg/ha</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="bg-white/50 dark:bg-white/10 rounded-xl p-3">
                                    <p className="text-sm text-slate-600 dark:text-slate-400">pH</p>
                                    <p className="text-2xl font-bold text-slate-800 dark:text-white">
                                        {latestSoilData.ph != null ? latestSoilData.ph.toFixed(1) : '—'}
                                    </p>
                                </div>
                                <div className="bg-white/50 dark:bg-white/10 rounded-xl p-3">
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Humidité</p>
                                    <p className="text-2xl font-bold text-slate-800 dark:text-white">
                                        {latestSoilData.humidite != null ? `${latestSoilData.humidite.toFixed(1)}%` : '—'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-slate-50 dark:bg-slate-900/20 border border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center">
                            <span className="material-symbols-outlined text-6xl text-slate-400 dark:text-slate-600">science</span>
                            <p className="text-slate-600 dark:text-slate-400 mt-4 font-medium">Aucune analyse de sol disponible</p>
                            <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                                Effectuez une première analyse pour voir les données NPK
                            </p>
                            <Link
                                to={`/dashboard/saisie-donnees-sol?plot=${plot.id}`}
                                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
                            >
                                <span className="material-symbols-outlined">add</span>
                                Effectuer une analyse
                            </Link>
                        </div>
                    )}

                    {/* Historical Analyses */}
                    {soilData.length > 1 && (
                        <div className="bg-white dark:bg-emerald-900/5 border border-slate-200 dark:border-emerald-900/20 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">history</span>
                                Historique des Analyses ({soilData.length - 1} précédentes)
                            </h3>
                            <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                                {soilData.slice(1).map((data) => (
                                    <div
                                        key={data.id}
                                        className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/20 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-semibold text-slate-800 dark:text-white">
                                                {new Date(data.dateMesure).toLocaleDateString('fr-FR')}
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                                N: {data.azote ?? '—'} | P: {data.phosphore ?? '—'} | K: {data.potassium ?? '—'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                                                pH {data.ph != null ? Number(data.ph).toFixed(1) : '—'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Actions & Recommendations */}
                <div className="space-y-6">
                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-emerald-900/5 border border-slate-200 dark:border-emerald-900/20 rounded-2xl p-5">
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wide">
                            Actions Rapides
                        </h3>
                        <div className="space-y-3">
                            <Link
                                to={`/dashboard/analyse?plot=${plot.id}`}
                                className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/20 hover:bg-slate-100 dark:hover:bg-slate-900/30 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-primary">psychology</span>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-white text-sm">Analyse IA</p>
                                    <p className="text-xs text-slate-500">Recommandations semences</p>
                                </div>
                            </Link>
                            <Link
                                to={`/dashboard/saisie-donnees-sol?plot=${plot.id}`}
                                className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/20 hover:bg-slate-100 dark:hover:bg-slate-900/30 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-primary">science</span>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-white text-sm">Analyse Sol</p>
                                    <p className="text-xs text-slate-500">Saisir données NPK</p>
                                </div>
                            </Link>
                            <Link
                                to="/dashboard/rapports/generer"
                                className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/20 hover:bg-slate-100 dark:hover:bg-slate-900/30 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined text-primary">description</span>
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-white text-sm">Rapport ROI</p>
                                    <p className="text-xs text-slate-500">Rentabilité prévisionnelle</p>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Plot Metrics */}
                    <div className="bg-white dark:bg-emerald-900/5 border border-slate-200 dark:border-emerald-900/20 rounded-2xl p-5">
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-4 uppercase tracking-wide">
                            Indicateurs Clés
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs text-slate-600 dark:text-slate-400">Santé végétale (NDVI)</span>
                                    <span className="text-sm font-bold text-slate-800 dark:text-white">
                                        {ndvi != null ? `${(ndvi * 100).toFixed(0)}%` : '—'}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${healthStatus.color}`}
                                        style={{ width: ndvi != null ? `${ndvi * 100}%` : '0%' }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs text-slate-600 dark:text-slate-400">pH du sol</span>
                                    <span className="text-sm font-bold text-slate-800 dark:text-white">
                                        {plot.soilPh != null ? Number(plot.soilPh).toFixed(1) : '—'}
                                    </span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                    {plot.soilPh != null && (
                                        <div
                                            className="h-2 rounded-full bg-green-500"
                                            style={{ width: `${(Number(plot.soilPh) / 14) * 100}%` }}
                                        ></div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-900/30 rounded-2xl p-5">
                        <div className="flex items-start gap-3">
                            <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">lightbulb</span>
                            <div>
                                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 text-sm">
                                    Conseil Agronome
                                </h4>
                                <p className="text-xs text-blue-800 dark:text-blue-400">
                                    Effectuez des analyses de sol régulières (tous les 3-6 mois) pour un suivi optimal des nutriments NPK.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailParcelePage;

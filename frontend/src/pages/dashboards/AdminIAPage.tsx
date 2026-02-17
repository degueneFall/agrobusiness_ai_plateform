import React from 'react';

const AdminIAPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Configuration & Entraînement des Modèles IA</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Hyperparamètres, variables et courbes d&apos;apprentissage.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl p-6 bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">psychology</span>
            Modèles actifs
          </h3>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>• Recommandation de semences v2.4</li>
            <li>• Santé des sols (NDVI)</li>
            <li>• Prévision rendements</li>
          </ul>
        </div>
        <div className="rounded-2xl p-6 bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20">
          <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
            <span className="material-symbols-outlined text-primary">tune</span>
            Hyperparamètres
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Learning rate, batch size, epochs — à connecter à l&apos;API d&apos;entraînement.</p>
        </div>
      </div>
      <div className="rounded-2xl p-6 bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20">
        <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary">show_chart</span>
          Courbes d&apos;apprentissage
        </h3>
        <div className="h-48 flex items-center justify-center bg-slate-50 dark:bg-emerald-900/20 rounded-xl">
          <p className="text-slate-500 dark:text-slate-400 text-sm">Loss / Précision (données à connecter)</p>
        </div>
      </div>
    </div>
  );
};

export default AdminIAPage;

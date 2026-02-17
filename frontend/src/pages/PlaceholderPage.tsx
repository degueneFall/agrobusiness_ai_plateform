import React from 'react';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => (
  <div className="bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20 rounded-2xl p-8 text-center">
    <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{title}</h2>
    {description && <p className="text-slate-500 dark:text-slate-400 text-sm">{description}</p>}
    <p className="text-slate-400 dark:text-slate-500 text-xs mt-4">Page à venir (maquette disponible)</p>
  </div>
);

export default PlaceholderPage;

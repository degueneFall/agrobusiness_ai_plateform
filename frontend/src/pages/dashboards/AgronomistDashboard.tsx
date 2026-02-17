import React from 'react';
import { Users, Map, FileText, TrendingUp } from 'lucide-react';

const AgronomistDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Espace Agronome</h2>
        <p className="text-gray-600">Suivi des exploitations et rapports d&apos;expertise.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Agriculteurs suivis</p>
              <p className="text-2xl font-bold text-gray-800">—</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Map className="h-6 w-6 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Parcelles analysées</p>
              <p className="text-2xl font-bold text-gray-800">—</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-100 rounded-lg">
              <FileText className="h-6 w-6 text-sky-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Rapports ce mois</p>
              <p className="text-2xl font-bold text-gray-800">—</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Préconisations</p>
              <p className="text-2xl font-bold text-gray-800">—</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Activité récente</h3>
        <p className="text-gray-500 text-sm">Les rapports et analyses apparaîtront ici.</p>
      </div>
    </div>
  );
};

export default AgronomistDashboard;

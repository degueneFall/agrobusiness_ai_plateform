import React from 'react';
import { BarChart3, AlertTriangle, Calendar, Sprout } from 'lucide-react';

const FarmerDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Espace Agriculteur</h2>
        <p className="text-gray-600">Vue d&apos;ensemble de vos parcelles et recommandations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Sprout className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Parcelles</p>
              <p className="text-2xl font-bold text-gray-800">—</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Alertes actives</p>
              <p className="text-2xl font-bold text-gray-800">—</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Tâches à venir</p>
              <p className="text-2xl font-bold text-gray-800">—</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Recommandations IA</p>
              <p className="text-2xl font-bold text-gray-800">—</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Mes parcelles</h3>
        <p className="text-gray-500 text-sm">Aucune parcelle pour le moment. Cette section sera alimentée par vos données.</p>
      </div>
    </div>
  );
};

export default FarmerDashboard;

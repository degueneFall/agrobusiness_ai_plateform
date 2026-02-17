import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Settings, Shield, Activity } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Espace Administration</h2>
        <p className="text-gray-600">Gestion des utilisateurs, des rôles et de la plateforme.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/admin/roles"
          className="bg-white rounded-lg shadow p-5 border border-gray-100 hover:border-indigo-200 hover:shadow-md transition"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Gestion des rôles</p>
              <p className="text-sm font-medium text-indigo-600">Accéder →</p>
            </div>
          </div>
        </Link>
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Shield className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-800">—</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Activity className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Activité</p>
              <p className="text-2xl font-bold text-gray-800">—</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-5 border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Settings className="h-6 w-6 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Paramètres</p>
              <p className="text-sm text-gray-400">À venir</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Actions rapides</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/admin/roles"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium"
          >
            Gestion des rôles
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

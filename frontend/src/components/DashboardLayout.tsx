import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { USER_ROLE_LABELS } from '../types';
import type { UserRole } from '../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const { user, logout, isAdmin } = useAuth();
  const roleLabel = user?.role ? USER_ROLE_LABELS[user.role as UserRole] ?? user.role : '';

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-gray-800">
                {title ?? `Tableau de bord — ${roleLabel}`}
              </h1>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                {roleLabel}
              </span>
            </div>
            <nav className="flex items-center gap-2">
              {isAdmin && (
                <Link
                  to="/admin/roles"
                  className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded-lg"
                >
                  Gestion des rôles
                </Link>
              )}
              <span className="text-sm text-gray-600">
                {user?.firstName} {user?.lastName}
              </span>
              <button
                onClick={logout}
                className="ml-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
              >
                Déconnexion
              </button>
            </nav>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

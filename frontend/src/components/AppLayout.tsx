import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { USER_ROLE_LABELS } from '../types';
import type { UserRole } from '../types';
import { notificationsService, type Notification } from '../services/notifications.service';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const navItems = [
  { to: '/dashboard', icon: 'dashboard', label: 'Tableau de bord' },
  { to: '/dashboard/cartographie', icon: 'map', label: 'Cartographie' },
  { to: '/dashboard/analyse', icon: 'bar_chart', label: 'Analyse' },
  { to: '/dashboard/semences', icon: 'eco', label: 'Semences' },
  { to: '/dashboard/rapports', icon: 'description', label: 'Rapports' },
];

const AppLayout: React.FC<AppLayoutProps> = ({ children, title = 'Tableau de Bord Global' }) => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const [search, setSearch] = useState('');
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    notificationsService.getUnreadCount().then(setUnreadCount).catch(() => {});
  }, [location.pathname]);

  useEffect(() => {
    if (!notifOpen) return;
    notificationsService.getAll(10).then(setNotifications).catch(() => setNotifications([]));
  }, [notifOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const roleLabel = user?.role ? USER_ROLE_LABELS[user.role as UserRole] ?? user.role : '';

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-white transition-colors font-display">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-emerald-900/30 bg-background-light dark:bg-background-dark hidden lg:flex flex-col">
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-primary/20 p-2 rounded-lg">
              <span className="material-symbols-outlined text-primary text-3xl">potted_plant</span>
            </div>
            <div className="flex flex-col">
              <h1 className="text-slate-900 dark:text-white text-lg font-bold leading-tight">AgriAI</h1>
              <p className="text-emerald-600 dark:text-primary/70 text-xs font-medium uppercase tracking-wider">Suite Executive</p>
            </div>
          </div>
          <nav className="flex-1 space-y-1">
            {navItems.map(({ to, icon, label }) => {
              const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined">{icon}</span>
                  <span className="text-sm font-medium tracking-wide">{label}</span>
                </Link>
              );
            })}
            {isAdmin && (
              <>
                <Link
                  to="/admin/roles"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    location.pathname === '/admin/roles'
                      ? 'bg-primary/10 text-primary'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-primary'
                  }`}
                >
                  <span className="material-symbols-outlined">group</span>
                  <span className="text-sm font-medium tracking-wide">Gestion des rôles</span>
                </Link>
                <Link
                  to="/admin/ia"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-primary transition-all duration-200"
                >
                  <span className="material-symbols-outlined">smart_toy</span>
                  <span className="text-sm font-medium tracking-wide">Admin IA</span>
                </Link>
              </>
            )}
          </nav>
          <div className="mt-auto pt-6 border-t border-emerald-900/20">
            <Link
              to="/dashboard/rapports/generer"
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-background-dark font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span className="text-sm">Générer Rapport</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 flex items-center justify-between px-4 md:px-8 border-b border-emerald-900/10 dark:border-emerald-900/30">
          <div className="flex items-center gap-4 md:gap-6 flex-1">
            <h2 className="text-lg md:text-xl font-bold tracking-tight text-slate-800 dark:text-white truncate">
              {title}
            </h2>
            <div className="relative max-w-md w-full hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xl">search</span>
              <input
                type="text"
                placeholder="Rechercher zones, variétés de semences..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border-none bg-slate-100 dark:bg-emerald-900/20 text-sm focus:ring-2 focus:ring-primary/50 text-slate-700 dark:text-white placeholder:text-slate-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen((o) => !o)}
                className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-emerald-900/30"
                title="Notifications"
              >
                <span className="material-symbols-outlined">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold bg-red-500 text-white rounded-full ring-2 ring-white dark:ring-background-dark">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 max-h-[400px] overflow-y-auto rounded-xl border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-slate-900 shadow-xl z-50">
                  <div className="p-3 border-b border-slate-100 dark:border-emerald-900/20 flex justify-between items-center">
                    <span className="font-semibold text-slate-800 dark:text-white">Notifications</span>
                    <Link to="/dashboard/notifications" onClick={() => setNotifOpen(false)} className="text-xs font-medium text-primary hover:underline">
                      Voir tout
                    </Link>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-emerald-900/20">
                    {notifications.length === 0 ? (
                      <p className="p-4 text-sm text-slate-500">Aucune notification</p>
                    ) : (
                      notifications.map((n) => (
                        <Link
                          key={n.id}
                          to="/dashboard/notifications"
                          onClick={() => setNotifOpen(false)}
                          className={`block p-3 text-left hover:bg-slate-50 dark:hover:bg-emerald-900/20 ${!n.isRead ? 'bg-primary/5' : ''}`}
                        >
                          <p className="font-medium text-slate-800 dark:text-white text-sm">{n.title}</p>
                          {n.message && <p className="text-xs text-slate-500 truncate">{n.message}</p>}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <Link to="/dashboard/parametres" className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-emerald-900/30" title="Paramètres">
              <span className="material-symbols-outlined">settings</span>
            </Link>
            <div className="h-8 w-px bg-slate-200 dark:bg-emerald-900/30 mx-1 md:mx-2" />
            <div className="flex items-center gap-2 md:gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-800 dark:text-white truncate max-w-[120px]">
                  {user?.firstName || user?.email}
                </p>
                <p className="text-[10px] text-emerald-600 dark:text-primary/70 uppercase font-bold tracking-tighter">
                  {roleLabel}
                </p>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-primary ring-2 ring-primary/20 bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-primary font-bold">
                {(user?.firstName?.[0] || user?.email?.[0] || '?').toUpperCase()}
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="ml-1 p-2 rounded-lg text-slate-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"
              title="Déconnexion"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AppLayout;

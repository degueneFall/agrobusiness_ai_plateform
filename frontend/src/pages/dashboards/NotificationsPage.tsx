import React, { useState, useEffect } from 'react';
import { notificationsService, type Notification } from '../../services/notifications.service';

const NotificationsPage: React.FC = () => {
  const [list, setList] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    notificationsService.getAll(100).then(setList).catch(() => setList([])).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleMarkAsRead = (id: number) => {
    notificationsService.markAsRead(id).then(() => {
      setList((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    }).catch(() => {});
  };

  const handleMarkAllAsRead = () => {
    notificationsService.markAllAsRead().then(() => {
      setList((prev) => prev.map((n) => ({ ...n, isRead: true })));
    }).catch(() => {});
  };

  const unreadCount = list.filter((n) => !n.isRead).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Notifications</h1>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="text-sm font-medium text-primary hover:underline"
          >
            Tout marquer comme lu
          </button>
        )}
      </div>
      {loading ? (
        <p className="text-slate-500">Chargement...</p>
      ) : list.length === 0 ? (
        <p className="text-slate-500">Aucune notification.</p>
      ) : (
        <ul className="space-y-2">
          {list.map((n) => (
            <li
              key={n.id}
              className={`rounded-xl p-4 border transition-colors ${
                n.isRead
                  ? 'bg-slate-50 dark:bg-emerald-900/10 border-slate-100 dark:border-emerald-900/20'
                  : 'bg-white dark:bg-emerald-900/20 border-primary/20'
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 dark:text-white">{n.title}</p>
                  {n.message && <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{n.message}</p>}
                  <p className="text-xs text-slate-400 mt-2">{new Date(n.createdAt).toLocaleString('fr-FR')}</p>
                </div>
                {!n.isRead && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(n.id)}
                    className="flex-shrink-0 text-xs font-medium text-primary hover:underline"
                  >
                    Marquer lu
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsPage;

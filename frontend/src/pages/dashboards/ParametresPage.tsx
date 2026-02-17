import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { usersService, type UpdateProfileData } from '../../services/users.service';
import { USER_ROLE_LABELS } from '../../types';
import type { UserRole } from '../../types';

const NOTIF_EMAIL_KEY = 'agriai_settings_notif_email';

const ParametresPage: React.FC = () => {
  const { refreshUser } = useAuth();
  const [profile, setProfile] = useState<{ firstName?: string; lastName?: string; email?: string; phone?: string; role?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '' });
  const [notifEmail, setNotifEmail] = useState(() => localStorage.getItem(NOTIF_EMAIL_KEY) !== 'false');

  useEffect(() => {
    usersService.getMe()
      .then((data) => {
        setProfile({
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? '',
          email: data.email,
          phone: (data as { phone?: string }).phone ?? '',
          role: data.role,
        });
        setForm({
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? '',
          phone: (data as { phone?: string }).phone ?? '',
        });
      })
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  const showMsg = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const data: UpdateProfileData = {
      firstName: form.firstName.trim() || undefined,
      lastName: form.lastName.trim() || undefined,
      phone: form.phone.trim() || undefined,
    };
    usersService.updateProfile(data)
      .then((updated) => {
        setProfile((p) => (p ? { ...p, ...updated, phone: (updated as { phone?: string }).phone } : null));
        refreshUser();
        showMsg('success', 'Profil enregistré.');
      })
      .catch(() => showMsg('error', 'Erreur lors de l’enregistrement.'))
      .finally(() => setSaving(false));
  };

  const handleNotifToggle = (checked: boolean) => {
    setNotifEmail(checked);
    localStorage.setItem(NOTIF_EMAIL_KEY, String(checked));
    showMsg('success', 'Préférence enregistrée.');
  };

  if (loading) return <p className="text-slate-500">Chargement...</p>;

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Paramètres</h1>

      {/* Profil */}
      <section className="rounded-2xl p-6 bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary">person</span>
          Profil
        </h2>
        {profile && (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Prénom</label>
                <input
                  type="text"
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 px-3 py-2 text-slate-800 dark:text-white"
                  placeholder="Prénom"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Nom</label>
                <input
                  type="text"
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 px-3 py-2 text-slate-800 dark:text-white"
                  placeholder="Nom"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Email</label>
              <p className="text-slate-700 dark:text-slate-300 py-2">{profile.email}</p>
              <p className="text-xs text-slate-500">L’email ne peut pas être modifié ici.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Téléphone</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 px-3 py-2 text-slate-800 dark:text-white"
                placeholder="06 12 34 56 78"
              />
            </div>
            {profile.role && (
              <p className="text-sm text-slate-500">
                Rôle : <span className="font-medium text-slate-700 dark:text-slate-300">{USER_ROLE_LABELS[profile.role as UserRole] ?? profile.role}</span>
              </p>
            )}
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:brightness-110 disabled:opacity-50"
            >
              {saving ? 'Enregistrement…' : 'Enregistrer le profil'}
            </button>
          </form>
        )}
      </section>

      {/* Notifications */}
      <section className="rounded-2xl p-6 bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary">notifications</span>
          Notifications
        </h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={notifEmail}
            onChange={(e) => handleNotifToggle(e.target.checked)}
            className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary"
          />
          <span className="text-slate-700 dark:text-slate-300">Recevoir les notifications par email</span>
        </label>
      </section>

      {/* Sécurité */}
      <section className="rounded-2xl p-6 bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-primary">lock</span>
          Sécurité
        </h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">Changer votre mot de passe (fonctionnalité à venir).</p>
        <button
          type="button"
          onClick={() => showMsg('success', 'Changement de mot de passe sera disponible prochainement.')}
          className="px-4 py-2 rounded-lg border border-slate-300 dark:border-emerald-900/30 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-emerald-900/20"
        >
          Changer le mot de passe
        </button>
      </section>

      {message && (
        <p className={`text-sm font-medium ${message.type === 'success' ? 'text-primary' : 'text-red-500'}`}>
          {message.text}
        </p>
      )}
    </div>
  );
};

export default ParametresPage;

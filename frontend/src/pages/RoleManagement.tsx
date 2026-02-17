import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usersService } from '../services/users.service';
import type { User, UserRole } from '../types';
import { USER_ROLE_LABELS, USER_ROLES } from '../types';
import { getApiErrorMessage } from '../services/api';

const RoleManagement: React.FC = () => {
    const { user: currentUser, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [createSaving, setCreateSaving] = useState(false);
    const [createForm, setCreateForm] = useState({ email: '', password: '', firstName: '', lastName: '', role: 'farmer' as UserRole });

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        if (!isAdmin) {
            navigate('/dashboard');
            return;
        }
        loadUsers();
    }, [currentUser, isAdmin, navigate]);

    const loadUsers = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await usersService.getAll();
            setUsers(data);
        } catch (e: any) {
            setError(e.response?.data?.message || 'Erreur lors du chargement des utilisateurs.');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (u: User, newRole: UserRole) => {
        if (u.role === newRole) return;
        setUpdatingId(u.id);
        setError(null);
        try {
            const updated = await usersService.updateRole(u.id, newRole);
            setUsers((prev) => prev.map((x) => (x.id === updated.id ? updated : x)));
        } catch (e: any) {
            setError(e.response?.data?.message || 'Erreur lors de la mise à jour du rôle.');
        } finally {
            setUpdatingId(null);
        }
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!createForm.email.trim() || createForm.password.length < 6) {
            setError('Email et mot de passe (6 caractères min) obligatoires.');
            return;
        }
        setError(null);
        setCreateSaving(true);
        try {
            await usersService.createByAdmin({
                email: createForm.email.trim(),
                password: createForm.password,
                firstName: createForm.firstName.trim() || undefined,
                lastName: createForm.lastName.trim() || undefined,
                role: createForm.role,
            });
            setCreateModalOpen(false);
            setCreateForm({ email: '', password: '', firstName: '', lastName: '', role: 'farmer' });
            loadUsers();
        } catch (e: any) {
            setError(getApiErrorMessage(e, 'Erreur lors de la création du compte.'));
        } finally {
            setCreateSaving(false);
        }
    };

    if (!currentUser) return null;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Gestion des rôles</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Modifier le rôle des utilisateurs ou créer un compte (admin, agronome, agriculteur)</p>
                </div>
                <button
                    type="button"
                    onClick={() => { setCreateModalOpen(true); setError(null); }}
                    className="flex items-center gap-2 py-2 px-4 rounded-lg bg-primary text-white font-bold hover:bg-primary/90"
                >
                    <span className="material-symbols-outlined">person_add</span>
                    Créer un utilisateur
                </button>
            </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-200 rounded-lg">
                        {error}
                    </div>
                )}

                {loading ? (
                    <p className="text-slate-600 dark:text-slate-400">Chargement des utilisateurs...</p>
                ) : (
                    <div className="bg-white dark:bg-emerald-900/10 border border-slate-100 dark:border-emerald-900/20 rounded-xl shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-emerald-900/20">
                            <thead className="bg-slate-50 dark:bg-emerald-900/20">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Nom</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Rôle</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-emerald-900/20">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-emerald-900/10">
                                        <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">{u.id}</td>
                                        <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">{u.email}</td>
                                        <td className="px-4 py-3 text-sm text-slate-700 dark:text-slate-200">
                                            {[u.firstName, u.lastName].filter(Boolean).join(' ') || '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={u.role as UserRole}
                                                onChange={(e) => handleRoleChange(u, e.target.value as UserRole)}
                                                disabled={updatingId === u.id}
                                                className="border border-slate-300 dark:border-emerald-900/30 rounded-lg px-2 py-1 text-sm bg-white dark:bg-emerald-900/20 text-slate-800 dark:text-white"
                                            >
                                                {USER_ROLES.map((r) => (
                                                    <option key={r} value={r}>
                                                        {USER_ROLE_LABELS[r]}
                                                    </option>
                                                ))}
                                            </select>
                                            {updatingId === u.id && (
                                                <span className="ml-2 text-xs text-slate-500">Enregistrement...</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

            {createModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={() => !createSaving && setCreateModalOpen(false)}>
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 dark:border-emerald-900/30" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Créer un utilisateur</h3>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Email *</label>
                                <input type="email" value={createForm.email} onChange={(e) => setCreateForm((f) => ({ ...f, email: e.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 px-3 py-2 text-slate-800 dark:text-white" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Mot de passe * (min. 6 caractères)</label>
                                <input type="password" value={createForm.password} onChange={(e) => setCreateForm((f) => ({ ...f, password: e.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 px-3 py-2 text-slate-800 dark:text-white" minLength={6} required />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Prénom</label>
                                    <input type="text" value={createForm.firstName} onChange={(e) => setCreateForm((f) => ({ ...f, firstName: e.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 px-3 py-2 text-slate-800 dark:text-white" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Nom</label>
                                    <input type="text" value={createForm.lastName} onChange={(e) => setCreateForm((f) => ({ ...f, lastName: e.target.value }))} className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 px-3 py-2 text-slate-800 dark:text-white" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Rôle *</label>
                                <select value={createForm.role} onChange={(e) => setCreateForm((f) => ({ ...f, role: e.target.value as UserRole }))} className="w-full rounded-lg border border-slate-200 dark:border-emerald-900/30 bg-white dark:bg-emerald-900/20 px-3 py-2 text-slate-800 dark:text-white">
                                    {USER_ROLES.map((r) => (<option key={r} value={r}>{USER_ROLE_LABELS[r]}</option>))}
                                </select>
                            </div>
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => setCreateModalOpen(false)} disabled={createSaving} className="flex-1 py-2 rounded-lg border border-slate-300 dark:border-emerald-900/30 text-slate-700 dark:text-slate-300 font-medium disabled:opacity-50">Annuler</button>
                                <button type="submit" disabled={createSaving} className="flex-1 py-2 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-50">{createSaving ? 'Création…' : 'Créer'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoleManagement;

import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const isLoginRequest = error.config?.url?.includes('/auth/login');
            if (!isLoginRequest) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

/** Message lisible pour l'utilisateur (erreur réseau, API, etc.) */
export function getApiErrorMessage(err: any, fallback = 'Une erreur est survenue.'): string {
    if (!err) return fallback;
    if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        return 'Impossible de joindre le serveur. Vérifiez que le backend est démarré (dossier backend : npm run start:dev) et que l\'URL est correcte (http://localhost:3000 par défaut).';
    }
    const msg = err.response?.data?.message ?? err.response?.data?.error ?? err.message;
    if (Array.isArray(msg)) return msg[0] ?? fallback;
    return msg || fallback;
}

export default api;

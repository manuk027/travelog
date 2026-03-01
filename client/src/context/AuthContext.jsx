import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    // Axios instance with interceptors
    const api = axios.create({
        baseURL: '/api/v1',
    });

    api.interceptors.request.use(
        (config) => {
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
                logout();
                toast.error('Session expired. Please log in again.');
            }
            return Promise.reject(error);
        }
    );

    useEffect(() => {
        const fetchUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const res = await api.get('/auth/me');
                setUser(res.data.data.user);
            } catch (error) {
                console.error('Error fetching user:', error);
                logout();
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [token]);

    const login = async (credentials, isGoogle = false) => {
        try {
            const endpoint = isGoogle ? '/auth/google-login' : '/auth/login';
            const res = await api.post(endpoint, credentials);

            const { token: newToken, data } = res.data;
            setToken(newToken);
            localStorage.setItem('token', newToken);
            setUser(data.user);
            toast.success('Logged in successfully!');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
            return { success: false, error: error.response?.data?.message };
        }
    };

    const register = async (userData) => {
        try {
            const res = await api.post('/auth/register', userData);

            const { token: newToken, data } = res.data;
            setToken(newToken);
            localStorage.setItem('token', newToken);
            setUser(data.user);
            toast.success('Registered successfully!');
            return { success: true };
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
            return { success: false, error: error.response?.data?.message };
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, api }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

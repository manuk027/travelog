import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const { user, api } = useAuth();

    useEffect(() => {
        const fetchInitialCount = async () => {
            if (user && user.role === 'admin') {
                try {
                    const res = await api.get('/admin/notifications');
                    const unread = res.data.data.notifications.filter(n => !n.isRead).length;
                    setUnreadCount(unread);
                } catch (error) {
                    console.error('Failed to fetch initial notification count:', error);
                }
            }
        };

        // Only connect socket for admin users
        if (user && user.role === 'admin') {
            fetchInitialCount();

            const newSocket = io(window.location.origin, {
                path: '/socket.io',
            });

            newSocket.on('connect', () => {
                console.log('Socket connected');
            });

            newSocket.on('admin-notification', (notification) => {
                toast.info(notification.message, {
                    icon: '🔔',
                    autoClose: 10000,
                });
                setUnreadCount(prev => prev + 1);
            });

            setSocket(newSocket);

            return () => newSocket.close();
        } else {
            setUnreadCount(0);
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [user]);

    return (
        <SocketContext.Provider value={{ socket, unreadCount, setUnreadCount }}>
            {children}
        </SocketContext.Provider>
    );
};

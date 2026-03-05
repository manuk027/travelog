import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import { Loader2, Bell, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminNotifications = () => {
    const { api } = useAuth();
    const { setUnreadCount } = useSocket();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/admin/notifications');
            const data = res.data.data.notifications;
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.isRead).length);
        } catch (error) {
            toast.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [api]);

    const markAsRead = async (id) => {
        try {
            await api.patch(`/admin/notifications/${id}/read`);
            setNotifications(
                notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n))
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            toast.error('Failed to mark notification as read');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/40 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <Bell className="w-6 h-6" />
                    </div>
                    Notifications
                </h1>
                <p className="mt-2 text-slate-400 dark:text-slate-500 font-medium">Activity alerts and system notifications.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden divide-y divide-slate-50 dark:divide-slate-700">
                {notifications.length === 0 ? (
                    <div className="p-10 text-center flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-sm font-medium">
                        <Bell className="w-8 h-8 text-slate-200 dark:text-slate-600 mb-3" />
                        No notifications at this time.
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`p-4 sm:p-5 flex items-start gap-4 transition-all duration-300 ${notification.isRead
                                ? 'bg-transparent'
                                : 'bg-emerald-50/30 dark:bg-emerald-900/10'
                                }`}
                        >
                            <div className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full ${notification.isRead
                                ? 'bg-transparent border border-slate-200 dark:border-slate-600'
                                : 'bg-emerald-500 shadow-glow shadow-emerald-200'
                                }`} />

                            <div className="flex-1">
                                <p className={`text-sm leading-relaxed max-w-4xl ${notification.isRead
                                    ? 'text-slate-500 dark:text-slate-400'
                                    : 'font-bold text-slate-800 dark:text-slate-100'
                                    }`}>
                                    {notification.message}
                                </p>
                                <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </span>

                                    <div className="flex items-center gap-3">
                                        {notification.type === 'new_place' && (
                                            <Link
                                                to="/admin/approvals"
                                                className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-sm"
                                            >
                                                Review
                                            </Link>
                                        )}

                                        {!notification.isRead && (
                                            <button
                                                onClick={() => markAsRead(notification._id)}
                                                className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 uppercase tracking-wider transition-colors"
                                            >
                                                <CheckCircle2 className="w-3.5 h-3.5" />
                                                Mark read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminNotifications;

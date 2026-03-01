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
                <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
            </div>
        );
    }

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                    <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                        <Bell className="w-6 h-6" />
                    </div>
                    Notifications
                </h1>
                <p className="mt-2 text-slate-400 font-medium">Activity alerts and system notifications.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden divide-y divide-slate-50">
                {notifications.length === 0 ? (
                    <div className="p-20 text-center flex flex-col items-center justify-center text-slate-400 font-medium">
                        <Bell className="w-12 h-12 text-slate-100 mb-4" />
                        No notifications at this time.
                    </div>
                ) : (
                    notifications.map((notification) => (
                        <div
                            key={notification._id}
                            className={`p-6 sm:p-8 flex items-start gap-6 transition-all duration-300 ${notification.isRead ? 'bg-transparent' : 'bg-emerald-50/30'
                                }`}
                        >
                            <div className={`mt-2 flex-shrink-0 w-2.5 h-2.5 rounded-full ${notification.isRead ? 'bg-transparent border border-slate-100' : 'bg-emerald-500 shadow-glow shadow-emerald-200'}`} />

                            <div className="flex-1">
                                <p className={`text-slate-800 leading-relaxed ${notification.isRead ? 'text-slate-500' : 'font-bold text-lg'}`}>
                                    {notification.message}
                                </p>
                                <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </span>

                                    <div className="flex items-center gap-4">
                                        {notification.type === 'new_place' && (
                                            <Link
                                                to="/admin/approvals"
                                                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                                            >
                                                Review
                                            </Link>
                                        )}

                                        {!notification.isRead && (
                                            <button
                                                onClick={() => markAsRead(notification._id)}
                                                className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors"
                                            >
                                                <CheckCircle2 className="w-4 h-4" />
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

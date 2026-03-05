import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import {
    Home, Compass, Plus, MapPin, Star, User,
    LayoutDashboard, Users, CheckSquare, Bell,
    LogIn, UserPlus, LogOut, MoreHorizontal, X
} from 'lucide-react';

const MobileNav = () => {
    const { user, logout } = useAuth();
    const { unreadCount } = useSocket();
    const location = useLocation();
    const navigate = useNavigate();
    const [moreOpen, setMoreOpen] = useState(false);

    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        setMoreOpen(false);
        logout();
        navigate('/login');
    };

    const handleMoreLink = (path) => {
        setMoreOpen(false);
        navigate(path);
    };

    // ─── Build tabs based on role ───────────────────────────────────────────────
    let mainTabs = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Explore', path: '/explore', icon: Compass },
    ];
    let moreItems = [];

    if (user?.role === 'user') {
        mainTabs.push({ name: 'Add', path: '/add-place', icon: Plus });
        moreItems = [
            { name: 'Visited', path: '/visited', icon: MapPin },
            { name: 'Dream Places', path: '/dream-places', icon: Star },
            { name: 'Profile', path: '/profile', icon: User },
        ];
    } else if (user?.role === 'admin') {
        mainTabs.push({ name: 'Add', path: '/add-place', icon: Plus });
        moreItems = [
            { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
            { name: 'Users', path: '/admin/users', icon: Users },
            { name: 'Approvals', path: '/admin/approvals', icon: CheckSquare },
            {
                name: 'Alerts', path: '/admin/notifications', icon: Bell,
                badge: unreadCount > 0 ? unreadCount : null
            },
        ];
    } else {
        // Guests — 4 plain tabs, no More needed
        mainTabs.push({ name: 'Log In', path: '/login', icon: LogIn });
        mainTabs.push({ name: 'Sign Up', path: '/register', icon: UserPlus });
    }

    const isLoggedIn = !!user;

    return (
        <>
            {/* ── Backdrop ────────────────────────────────────────────────── */}
            {moreOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[2px] md:hidden"
                    onClick={() => setMoreOpen(false)}
                />
            )}

            {/* ── More slide-up sheet ─────────────────────────────────────── */}
            {isLoggedIn && (
                <div
                    className={`fixed left-0 right-0 z-50 px-3 md:hidden transition-all duration-300 ease-out ${moreOpen
                            ? 'bottom-[76px] opacity-100 translate-y-0 pointer-events-auto'
                            : 'bottom-[76px] opacity-0 translate-y-3 pointer-events-none'
                        }`}
                >
                    <div className="mx-auto max-w-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/70 dark:border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
                        {/* Sheet header */}
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">More</span>
                            <button
                                onClick={() => setMoreOpen(false)}
                                className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* More links */}
                        <div className="py-1">
                            {moreItems.map((item) => {
                                const Icon = item.icon;
                                const active = isActive(item.path);
                                return (
                                    <button
                                        key={item.path}
                                        onClick={() => handleMoreLink(item.path)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition-colors ${active
                                                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                                                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <span className="relative flex-shrink-0">
                                            <Icon className="w-5 h-5" />
                                            {item.badge && (
                                                <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </span>
                                        <span>{item.name}</span>
                                        {active && (
                                            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Logout row */}
                        <div className="border-t border-slate-100 dark:border-slate-700 py-1">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors"
                            >
                                <LogOut className="w-5 h-5 flex-shrink-0" />
                                <span>Log Out</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Bottom tab bar ──────────────────────────────────────────── */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-2 pb-safe">
                <div className="mx-auto max-w-lg mb-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/70 dark:border-slate-700/60 rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] flex items-stretch overflow-hidden">

                    {/* Main tabs */}
                    {mainTabs.map((tab) => {
                        const Icon = tab.icon;
                        const active = isActive(tab.path);
                        return (
                            <Link
                                key={tab.path}
                                to={tab.path}
                                onClick={() => setMoreOpen(false)}
                                className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-2.5 px-1 text-[10px] font-medium transition-all duration-200 ${active
                                        ? 'text-emerald-600 dark:text-emerald-400'
                                        : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                    }`}
                            >
                                {active && (
                                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-emerald-500" />
                                )}
                                <Icon className={`h-5 w-5 transition-transform duration-200 ${active ? 'scale-110' : ''}`} />
                                <span className="leading-none truncate w-full text-center">{tab.name}</span>
                            </Link>
                        );
                    })}

                    {/* More tab — only for logged-in users */}
                    {isLoggedIn && (
                        <button
                            onClick={() => setMoreOpen(!moreOpen)}
                            className={`relative flex flex-col items-center justify-center gap-0.5 flex-1 min-w-0 py-2.5 px-1 text-[10px] font-medium transition-all duration-200 ${moreOpen
                                    ? 'text-emerald-600 dark:text-emerald-400'
                                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            {moreOpen && (
                                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-emerald-500" />
                            )}
                            <span className="relative">
                                <MoreHorizontal className={`h-5 w-5 transition-transform duration-200 ${moreOpen ? 'scale-110' : ''}`} />
                                {/* Notification badge for admin */}
                                {user?.role === 'admin' && unreadCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </span>
                            <span className="leading-none">More</span>
                        </button>
                    )}
                </div>
            </nav>
        </>
    );
};

export default MobileNav;

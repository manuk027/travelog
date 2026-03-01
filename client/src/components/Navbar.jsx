import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Menu, X, Sparkles, LogIn, Bell, Map } from 'lucide-react';
import { useState } from 'react';
import { useSocket } from '../context/SocketContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { unreadCount } = useSocket();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Explore', path: '/explore' },
    ];

    if (user) {
        navLinks.push({ name: 'Add Place', path: '/add-place' });
        navLinks.push({ name: 'Visited Places', path: '/visited' });
        navLinks.push({ name: 'Profile', path: '/profile' });
        if (user.role === 'admin') {
            navLinks.push({ name: 'Users', path: '/admin/users' });
            navLinks.push({ name: 'Approvals', path: '/admin/approvals' });
            navLinks.push({
                name: 'Alerts',
                path: '/admin/notifications',
                extra: unreadCount > 0 && (
                    <div className="flex items-center gap-1.5 ml-1">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] font-black text-emerald-600">{unreadCount}</span>
                    </div>
                )
            });
        }
    }

    const isActive = (path) => location.pathname === path;

    return (
        <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 pointer-events-none">
            <div className="max-w-6xl mx-auto flex items-center gap-3">

                {/* ═══ LEFT ISLAND — Logo + Nav ═══ */}
                <div className="pointer-events-auto flex-1 flex items-center h-12 px-2 rounded-full
                    bg-white/80 backdrop-blur-xl
                    border border-slate-200/60
                    shadow-[0_2px_20px_rgba(0,0,0,0.06),0_0_40px_rgba(0,0,0,0.03)]
                    transition-all duration-500 ease-out"
                >
                    {/* Logo */}
                    <Link to="/" className="flex items-center pl-3 pr-3 group" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className="font-logo text-xl tracking-tight text-slate-800 select-none">
                            trave<span className="italic text-emerald-600">Log</span>
                        </span>
                    </Link>

                    {/* Separator */}
                    <div className="hidden md:block w-px h-5 bg-slate-200 mx-1" />

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center justify-between flex-1 px-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 flex items-center gap-2 ${isActive(link.path)
                                    ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                    }`}
                            >
                                {link.name}
                                {link.extra}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile controls */}
                    <div className="flex items-center gap-1 ml-auto md:hidden">
                        {unreadCount > 0 && (
                            <Link to="/admin" className="p-2 text-emerald-500">
                                <Bell className="h-4 w-4 animate-bounce" />
                            </Link>
                        )}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                        >
                            {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                        </button>
                    </div>
                </div>

                {/* ═══ RIGHT ISLAND — Auth ═══ */}
                <div className="pointer-events-auto hidden md:flex items-center h-12 px-1.5 rounded-full
                    bg-white/80 backdrop-blur-xl
                    border border-slate-200/60
                    shadow-[0_2px_20px_rgba(0,0,0,0.06),0_0_40px_rgba(0,0,0,0.03)]
                    transition-all duration-500 ease-out"
                >
                    {user ? (
                        <div className="flex items-center gap-1">
                            <Link to="/profile" className="flex items-center gap-2 pl-3 pr-2 hover:bg-slate-50 rounded-full py-1 transition-colors">
                                <div className="w-6 h-6 rounded-full bg-slate-100 overflow-hidden shadow-inner flex items-center justify-center">
                                    <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-[13px] font-medium text-slate-600 max-w-[100px] truncate">{user.displayName}</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="p-2 mr-0.5 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all duration-200"
                                title="Logout"
                            >
                                <LogOut className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1">
                            <Link
                                to="/login"
                                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-all duration-200"
                            >
                                <LogIn className="w-3.5 h-3.5" />
                                Log In
                            </Link>
                            <Link
                                to="/register"
                                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200 shadow-sm"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══ MOBILE DROPDOWN ═══ */}
            {isMobileMenuOpen && (
                <div className="pointer-events-auto mt-2 mx-auto max-w-6xl
                    bg-white/95 backdrop-blur-xl
                    border border-slate-200/60
                    rounded-2xl shadow-[0_8px_40px_rgba(0,0,0,0.08)]
                    animate-slide-down overflow-hidden"
                >
                    <div className="px-3 pt-3 pb-3 space-y-0.5">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(link.path)
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                                    }`}
                            >
                                {link.name}
                                {link.extra}
                            </Link>
                        ))}

                        {user ? (
                            <div className="mt-2 pt-2 border-t border-slate-100">
                                <Link
                                    to="/profile"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex items-center gap-3 px-4 mb-2 hover:bg-slate-50 py-2 rounded-xl transition-all"
                                >
                                    <div className="w-7 h-7 rounded-full bg-slate-100 overflow-hidden shadow-inner flex items-center justify-center">
                                        <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="font-semibold text-slate-700 text-sm">{user.displayName} (Profile)</span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center w-full px-4 py-2.5 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="mt-2 pt-2 border-t border-slate-100 flex gap-2 px-1">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium text-slate-500 border border-slate-200 hover:bg-slate-50 transition-all"
                                >
                                    Log In
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="flex-1 text-center py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;

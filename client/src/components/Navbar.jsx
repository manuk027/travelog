import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useSocket } from '../context/SocketContext';
import { LogOut, Sparkles, LogIn, Bell, Sun, Moon } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { unreadCount } = useSocket();
    const { isDarkMode, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Explore', path: '/explore' },
    ];

    if (user) {
        if (user.role === 'user') {
            navLinks.push({ name: 'Add Place', path: '/add-place' });
            navLinks.push({ name: 'Visited Places', path: '/visited' });
            navLinks.push({ name: 'Dream Places', path: '/dream-places' });
            navLinks.push({ name: 'Profile', path: '/profile' });
        }
        if (user.role === 'admin') {
            navLinks.push({ name: 'Add Place', path: '/add-place' });
            navLinks.push({ name: 'Dashboard', path: '/admin' });
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
        <div className="hidden md:block fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 pt-4 pointer-events-none">
            <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 md:gap-4 pointer-events-none w-full">

                {/* ═══ LEFT ISLAND — Logo + Nav ═══ */}
                <div className="pointer-events-auto flex items-center h-16 w-full max-w-[90%] md:max-w-fit px-2 rounded-full
                    bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
                    border border-slate-200/60 dark:border-slate-700/60
                    shadow-[0_2px_20px_rgba(0,0,0,0.06),0_0_40px_rgba(0,0,0,0.03)]
                    transition-all duration-500 ease-out flex-shrink-0"
                >
                    {/* Logo */}
                    <Link to="/" className="flex items-center pl-3 pr-3 group">
                        <span className="font-logo text-2xl tracking-tight text-slate-800 dark:text-white select-none">
                            trave<span className="italic text-emerald-600">Log</span>
                        </span>
                    </Link>

                    {/* Separator */}
                    <div className="hidden md:block w-px h-6 bg-slate-200 dark:bg-slate-700 mx-2" />

                    {/* Desktop nav links */}
                    <div className="hidden md:flex items-center justify-center gap-1 px-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`px-2.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${isActive(link.path)
                                    ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 shadow-sm'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                {link.name}
                                {link.extra}
                            </Link>
                        ))}
                    </div>

                    {/* Admin bell on mobile (so it's accessible without bottom nav) */}
                    <div className="flex items-center gap-2 ml-auto md:hidden pr-2">
                        {unreadCount > 0 && user?.role === 'admin' && (
                            <Link to="/admin/notifications" className="p-2 text-emerald-500">
                                <Bell className="h-5 w-5 animate-bounce" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* ═══ RIGHT ISLAND — Theme Toggle + Auth (desktop only) ═══ */}
                <div className="pointer-events-auto hidden md:flex items-center h-16 px-1.5 rounded-full
                    bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl
                    border border-slate-200/60 dark:border-slate-700/60
                    shadow-[0_2px_20px_rgba(0,0,0,0.06),0_0_40px_rgba(0,0,0,0.03)]
                    transition-all duration-500 ease-out ml-4"
                >
                    {/* Theme toggle button */}
                    <button
                        onClick={toggleTheme}
                        title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        className="p-2.5 rounded-full text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-200 ml-1"
                    >
                        {isDarkMode
                            ? <Sun className="h-[18px] w-[18px]" />
                            : <Moon className="h-[18px] w-[18px]" />
                        }
                    </button>

                    {/* Separator */}
                    <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

                    {user ? (
                        <div className="flex items-center gap-2">
                            {user.role === 'user' ? (
                                <Link to="/profile" className="flex items-center gap-2.5 px-3 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full py-1.5 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden shadow-inner flex items-center justify-center">
                                        <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-[14px] font-medium text-slate-700 dark:text-slate-200 max-w-[120px] truncate">{user.displayName}</span>
                                </Link>
                            ) : (
                                <div className="flex items-center gap-2.5 px-3 py-1.5">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden shadow-inner flex items-center justify-center">
                                        <img src={user.avatar} alt={user.displayName} className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-[14px] font-bold text-slate-700 dark:text-slate-200 max-w-[120px] truncate">{user.displayName}</span>
                                </div>
                            )}
                            <button
                                onClick={handleLogout}
                                className="p-2.5 mr-1 rounded-full text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all duration-200"
                                title="Logout"
                            >
                                <LogOut className="h-5 w-5" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 px-1">
                            <Link
                                to="/login"
                                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[14px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
                            >
                                <LogIn className="w-4 h-4" />
                                <span>Log In</span>
                            </Link>
                            <Link
                                to="/register"
                                className="flex items-center gap-1.5 px-5 py-2 rounded-full text-[14px] font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-200 shadow-sm"
                            >
                                <Sparkles className="w-4 h-4" />
                                <span>Sign Up</span>
                            </Link>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Navbar;

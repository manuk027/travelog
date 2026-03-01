import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, CheckSquare, Bell } from 'lucide-react';

const AdminSidebar = () => {
    const links = [
        { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, exact: true },
        { name: 'Approvals', path: '/admin/approvals', icon: <CheckSquare className="w-5 h-5" /> },
        { name: 'Users', path: '/admin/users', icon: <Users className="w-5 h-5" /> },
        { name: 'Notifications', path: '/admin/notifications', icon: <Bell className="w-5 h-5" /> },
    ];

    return (
        <div className="w-full md:w-64 bg-white dark:bg-dark-card border-r border-slate-200 dark:border-slate-800 md:min-h-[calc(100vh-4rem)] flex-shrink-0">
            <div className="p-4">
                <h2 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">
                    Admin Panel
                </h2>
                <nav className="space-y-1">
                    {links.map((link) => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            end={link.exact}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors ${isActive
                                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-400'
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200'
                                }`
                            }
                        >
                            {link.icon}
                            {link.name}
                        </NavLink>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default AdminSidebar;

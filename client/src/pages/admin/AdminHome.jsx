import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, MapPin, CheckSquare, Activity, Loader2 } from 'lucide-react';

const AdminHome = () => {
    const { api } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/admin/dashboard');
                setStats(res.data.data.stats);
            } catch (error) {
                console.error('Failed to load dashboard stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [api]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
            </div>
        );
    }

    const statCards = [
        { name: 'Total Users', value: stats?.totalUsers || 0, icon: <Users className="w-8 h-8 text-emerald-600" />, bg: 'bg-emerald-50' },
        { name: 'Total Places', value: stats?.totalPlaces || 0, icon: <MapPin className="w-8 h-8 text-emerald-500" />, bg: 'bg-emerald-50' },
        { name: 'Pending Approvals', value: stats?.pendingApprovals || 0, icon: <CheckSquare className="w-8 h-8 text-amber-500" />, bg: 'bg-amber-50' }
    ];

    return (
        <div className="animate-fade-in space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">Admin Dashboard</h1>
                <p className="mt-2 text-slate-400 font-medium">Welcome back. Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2rem] flex items-center gap-4 border border-slate-100 shadow-sm transition-all hover:shadow-md">
                        <div className={`p-4 rounded-2xl ${stat.bg}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-400">{stat.name}</p>
                            <h3 className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {stats?.uploadsOverTime && stats.uploadsOverTime.length > 0 && (
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-800 pb-6 border-b border-slate-50">
                        <Activity className="w-6 h-6 text-emerald-500" />
                        <h3 className="text-xl font-bold tracking-tight">Upload Activity</h3>
                    </div>

                    <div className="h-64 flex items-end gap-3 pt-8 pb-4">
                        {stats.uploadsOverTime.map((item, index) => {
                            const maxCount = Math.max(...stats.uploadsOverTime.map(i => i.count));
                            const height = maxCount > 0 ? (item.count / maxCount) * 100 : 0;
                            return (
                                <div key={index} className="flex-1 flex flex-col items-center justify-end gap-2 group relative">
                                    <div className="w-full bg-emerald-500/10 rounded-t-xl group-hover:bg-emerald-500 transition-all duration-300" style={{ height: `${height}%`, minHeight: '8px' }}></div>
                                    <span className="text-[10px] text-slate-300 font-bold mt-2 hidden lg:block uppercase tracking-tighter">
                                        {item._id.substring(5)}
                                    </span>
                                    <div className="absolute -top-10 bg-slate-800 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all scale-95 group-hover:scale-100 pointer-events-none z-10 shadow-lg">
                                        {item.count} uploads
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminHome;

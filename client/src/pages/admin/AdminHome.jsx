import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, MapPin, CheckSquare, Activity, Loader2, TrendingUp, AlertCircle, Award } from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from 'recharts';

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
            <div className="flex justify-center items-center h-full min-h-[50vh]">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
            </div>
        );
    }

    const statCards = [
        { name: 'Total Users', value: stats?.totalUsers || 0, icon: <Users className="w-7 h-7 text-emerald-600" />, bg: 'bg-emerald-100 dark:bg-emerald-900/40', text: 'text-emerald-700 dark:text-emerald-400' },
        { name: 'Total Places', value: stats?.totalPlaces || 0, icon: <MapPin className="w-7 h-7 text-blue-600" />, bg: 'bg-blue-100 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-400' },
        { name: 'Pending Approvals', value: stats?.pendingApprovals || 0, icon: <CheckSquare className="w-7 h-7 text-amber-600" />, bg: 'bg-amber-100 dark:bg-amber-900/40', text: 'text-amber-700 dark:text-amber-400' }
    ];

    // Prepare Line Chart Data (Merging Users and Places)
    const combinedDataMap = new Map();

    if (stats?.uploadsOverTime) {
        stats.uploadsOverTime.forEach(item => {
            combinedDataMap.set(item._id, { date: item._id, Places: item.count, Users: 0 });
        });
    }

    if (stats?.usersOverTime) {
        stats.usersOverTime.forEach(item => {
            if (combinedDataMap.has(item._id)) {
                combinedDataMap.get(item._id).Users = item.count;
            } else {
                combinedDataMap.set(item._id, { date: item._id, Places: 0, Users: item.count });
            }
        });
    }

    const chartData = Array.from(combinedDataMap.values()).sort((a, b) => a.date.localeCompare(b.date));

    // Prepare Pie Chart Data
    const STATUS_COLORS = {
        approved: '#10b981',
        pending: '#f59e0b',
        rejected: '#ef4444'
    };

    const pieData = stats?.placesByStatus?.map(item => ({
        name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
        value: item.count,
        color: STATUS_COLORS[item._id] || '#94a3b8'
    })) || [];

    return (
        <div className="animate-fade-in space-y-6 pb-8">
            <div>
                <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">Admin Dashboard</h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 font-medium">Welcome back. Here's your platform overview.</p>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {statCards.map((stat, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-4 border border-slate-100 dark:border-slate-700 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                        <div className={`p-3 rounded-xl ${stat.bg} ${stat.text}`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.name}</p>
                            <h3 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight mt-0.5">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Main Area Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                            <h3 className="text-base font-bold tracking-tight text-slate-800 dark:text-white">Growth (30 Days)</h3>
                        </div>
                    </div>

                    <div className="h-[280px] w-full">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                        <linearGradient id="colorPlaces" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11 }} />
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.4)', fontSize: '12px', backgroundColor: '#1e293b', color: '#f1f5f9' }}
                                    />
                                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                                    <Area type="monotone" dataKey="Users" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                                    <Area type="monotone" dataKey="Places" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorPlaces)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                                <Activity className="w-8 h-8 opacity-20" />
                                <p className="text-sm font-medium">No activity data</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Donut & Top Users */}
                <div className="space-y-6">

                    {/* Donut Chart: Places Status */}
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center gap-2 pb-4 mb-2 border-b border-slate-100 dark:border-slate-700">
                            <div className="p-1.5 bg-amber-50 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-lg">
                                <AlertCircle className="w-4 h-4" />
                            </div>
                            <h3 className="text-base font-bold tracking-tight text-slate-800 dark:text-white">Places Status</h3>
                        </div>

                        <div className="h-[200px] w-full flex items-center justify-center">
                            {pieData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={70}
                                            paddingAngle={4}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            contentStyle={{ borderRadius: '0.75rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.4)', fontSize: '12px', backgroundColor: '#1e293b', color: '#f1f5f9' }}
                                            itemStyle={{ fontWeight: 'bold' }}
                                        />
                                        <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" wrapperStyle={{ fontSize: '12px' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            ) : (
                                <p className="text-slate-400 text-sm font-medium">No places data</p>
                            )}
                        </div>
                    </div>

                    {/* Top Contributors */}
                    <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
                        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-slate-100 dark:border-slate-700">
                            <div className="p-1.5 bg-orange-50 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded-lg">
                                <Award className="w-4 h-4" />
                            </div>
                            <h3 className="text-base font-bold tracking-tight text-slate-800 dark:text-white">Top Contributors</h3>
                        </div>

                        <div className="space-y-4">
                            {stats?.topUsers && stats.topUsers.length > 0 ? (
                                stats.topUsers.map((user, idx) => (
                                    <div key={user._id} className="flex items-center justify-between group">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden ring-2 ring-white dark:ring-slate-800 shadow-sm group-hover:ring-emerald-100 dark:group-hover:ring-emerald-900 transition-all">
                                                    <img
                                                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.username)}&background=random&color=fff&bold=true`}
                                                        alt="Avatar"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                {idx === 0 && (
                                                    <div className="absolute -top-1 -right-1 bg-yellow-400 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-800 shadow-sm text-yellow-900">
                                                        <span className="text-[8px] font-black">1</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 dark:text-slate-100 capitalize truncate max-w-[120px]">{user.name || user.username}</p>
                                                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 truncate max-w-[120px]">{user.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-black text-xs border border-emerald-100 dark:border-emerald-800">
                                                {user.count} <span className="text-[8px] ml-1 font-bold text-emerald-600/70 dark:text-emerald-500/70">PLCS</span>
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-400 text-sm font-medium text-center py-2">No contributors yet.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default AdminHome;

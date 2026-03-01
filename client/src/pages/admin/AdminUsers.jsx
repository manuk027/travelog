import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Shield, UserX, UserCheck, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const AdminUsers = () => {
    const { api, user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data.data.users);
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [api]);

    const handleToggleBlock = async (userId, isBlocked) => {
        try {
            const res = await api.patch(`/admin/users/${userId}/status`, { isBlocked: !isBlocked });
            toast.success(res.data.message);
            setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: !isBlocked } : u));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update user status');
        }
    };

    const handleDelete = async (userId) => {
        if (!window.confirm('Are you sure you want to completely delete this user? This action cannot be undone.')) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            toast.success('User deleted successfully');
            setUsers(users.filter(u => u._id !== userId));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
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
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">User Management</h1>
                <p className="mt-2 text-slate-400 font-medium">View, block, or remove users from the platform.</p>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">User</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Role</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Joined</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {users.map((u) => (
                                <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-black uppercase text-lg">
                                                {u.username.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{u.username}</p>
                                                <p className="text-sm text-slate-400 font-medium">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        {u.role === 'admin' ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                <Shield className="w-3.5 h-3.5" /> ADMIN
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 text-slate-500 border border-slate-100">
                                                MEMBER
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5">
                                        {u.isBlocked ? (
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
                                                BLOCKED
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                ACTIVE
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 text-sm text-slate-400 font-medium">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-5 text-right space-x-2">
                                        <button
                                            onClick={() => handleToggleBlock(u._id, u.isBlocked)}
                                            disabled={u.role === 'admin' || u._id === currentUser._id}
                                            className={`inline-flex items-center justify-center p-2.5 rounded-xl transition-all focus:ring-2 disabled:opacity-20 disabled:cursor-not-allowed ${u.isBlocked
                                                ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                                : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                                }`}
                                            title={u.isBlocked ? 'Unblock User' : 'Block User'}
                                        >
                                            {u.isBlocked ? <UserCheck className="w-5 h-5" /> : <UserX className="w-5 h-5" />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(u._id)}
                                            disabled={u.role === 'admin' || u._id === currentUser._id}
                                            className="inline-flex items-center justify-center p-2.5 rounded-xl bg-rose-100 text-rose-700 hover:bg-rose-200 focus:ring-2 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                                            title="Delete User"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Loader2, Shield, UserX, UserCheck, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import Pagination from '../../components/Pagination';

const PAGE_SIZE = 10;

const AdminUsers = () => {
    const { api, user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

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

    const [deleteModalUser, setDeleteModalUser] = useState(null);

    const handleToggleBlock = async (userId, isBlocked) => {
        try {
            const res = await api.patch(`/admin/users/${userId}/status`, { isBlocked: !isBlocked });
            toast.success(res.data.message);
            setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: !isBlocked } : u));
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update user status');
        }
    };

    const confirmDelete = async () => {
        if (!deleteModalUser) return;
        try {
            await api.delete(`/admin/users/${deleteModalUser._id}`);
            toast.success('User deleted successfully');
            setUsers(users.filter(u => u._id !== deleteModalUser._id));
            setDeleteModalUser(null);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
            setDeleteModalUser(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
            </div>
        );
    }

    const totalPages = Math.ceil(users.length / PAGE_SIZE);
    const paginatedUsers = users.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">User Management</h1>
                    <p className="mt-0.5 text-sm text-slate-400 dark:text-slate-500 font-medium">View, block, or remove users from the platform.</p>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{users.length} total users</span>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-100 dark:border-slate-700">
                                <th className="px-8 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">User</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Role</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Joined</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-700">
                            {paginatedUsers.map((u) => (
                                <tr key={u._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-black uppercase text-lg">
                                                {(u.name || u.username || '?').charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 dark:text-slate-100 capitalize">{u.name || u.username || 'Unknown User'}</p>
                                                <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">{u.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        {u.role === 'admin' ? (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                                                <Shield className="w-3.5 h-3.5" /> ADMIN
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-600">
                                                MEMBER
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5">
                                        {u.isBlocked ? (
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-800">
                                                BLOCKED
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800">
                                                ACTIVE
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5 text-sm text-slate-400 dark:text-slate-500 font-medium">
                                        {new Date(u.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-8 py-5 text-right space-x-2">
                                        <button
                                            onClick={() => handleToggleBlock(u._id, u.isBlocked)}
                                            disabled={u.role === 'admin' || u._id === currentUser._id}
                                            className={`inline-flex items-center justify-center p-2.5 rounded-xl transition-all focus:ring-2 disabled:opacity-20 disabled:cursor-not-allowed ${u.isBlocked
                                                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/60'
                                                : 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-900/60'
                                                }`}
                                            title={u.isBlocked ? 'Unblock User' : 'Block User'}
                                        >
                                            {u.isBlocked ? <UserCheck className="w-5 h-5" /> : <UserX className="w-5 h-5" />}
                                        </button>
                                        <button
                                            onClick={() => setDeleteModalUser(u)}
                                            disabled={u.role === 'admin' || u._id === currentUser._id}
                                            className="inline-flex items-center justify-center p-2.5 rounded-xl bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400 hover:bg-rose-200 dark:hover:bg-rose-900/60 focus:ring-2 disabled:opacity-20 disabled:cursor-not-allowed transition-all"
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
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            {/* Delete Confirmation Modal */}
            {deleteModalUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden animate-slide-up border border-slate-100 dark:border-slate-700">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Trash2 className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Delete User?</h3>
                            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
                                Are you sure you want to completely remove <span className="text-slate-800 dark:text-slate-200 font-bold">{deleteModalUser.name || deleteModalUser.username || 'this user'}</span>? This action cannot be undone and will erase all their data.
                            </p>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setDeleteModalUser(null)}
                                    className="flex-1 py-3.5 px-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDelete}
                                    className="flex-1 py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-lg shadow-rose-200 dark:shadow-rose-900/20 transition-all"
                                >
                                    Yes, Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;

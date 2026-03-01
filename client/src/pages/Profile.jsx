import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { User, Mail, Phone, MapPin, Loader2, Save, Globe, Sparkles } from 'lucide-react';

const Profile = () => {
    const { api, user: authUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        residentialLocation: {
            address: '',
            coordinates: [0, 0]
        }
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/me');
                const profile = res.data.data.user;
                setUserData({
                    name: profile.name || '',
                    email: profile.email || '',
                    phoneNumber: profile.phoneNumber || '',
                    residentialLocation: profile.residentialLocation || { address: '', coordinates: [0, 0] }
                });
            } catch (error) {
                toast.error('Failed to fetch profile details');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [api]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleLocationChange = (e) => {
        setUserData(prev => ({
            ...prev,
            residentialLocation: { ...prev.residentialLocation, address: e.target.value }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch('/users/update-me', {
                name: userData.name,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                residentialLocation: userData.residentialLocation
            });
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
            <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 mb-4">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Account Settings</span>
                </div>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                    Your <span className="text-emerald-600">Profile</span>
                </h1>
                <p className="text-slate-500 font-medium mt-2">Manage your personal details and how you appear to the community.</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                <div className="flex flex-col items-center mb-12">
                    <div className="w-32 h-32 p-1 bg-gradient-to-tr from-emerald-400 to-emerald-600 rounded-[2.5rem] shadow-xl shadow-emerald-200/50 mb-6">
                        <div className="w-full h-full bg-white dark:bg-slate-800 rounded-[2.2rem] flex items-center justify-center overflow-hidden">
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || authUser?.username)}&background=10b981&color=fff&bold=true&size=128`}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 dark:text-white">{userData.name || authUser?.username}</h2>
                    <p className="text-slate-500 font-bold bg-slate-100 dark:bg-slate-800 px-4 py-1 rounded-full mt-2 text-sm uppercase tracking-widest">@{authUser?.username}</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                        <div className="relative group">
                            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                                type="text"
                                name="name"
                                value={userData.name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold"
                            />
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                                type="email"
                                name="email"
                                value={userData.email}
                                onChange={handleChange}
                                placeholder="your@email.com"
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold"
                            />
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                        <div className="relative group">
                            <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={userData.phoneNumber}
                                onChange={handleChange}
                                placeholder="+1 (234) 567 890"
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold"
                            />
                        </div>
                    </div>

                    <div className="space-y-2.5">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Residential Location</label>
                        <div className="relative group">
                            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                            <input
                                type="text"
                                value={userData.residentialLocation.address}
                                onChange={handleLocationChange}
                                placeholder="City, Country"
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all font-semibold"
                            />
                        </div>
                    </div>

                    <div className="md:col-span-2 pt-6">
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-3xl shadow-2xl shadow-emerald-200/50 hover:shadow-emerald-300/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed text-lg"
                        >
                            {saving ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>Update Profile Info</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;

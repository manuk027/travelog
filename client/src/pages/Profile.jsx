import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { User, Mail, Phone, MapPin, Loader2, Save, Lock, Eye, EyeOff, MessageSquare, ShieldCheck } from 'lucide-react';

const Profile = () => {
    const { api, user: authUser, updateUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        residentialLocation: { address: '', coordinates: [0, 0] }
    });
    const [authProvider, setAuthProvider] = useState('local');

    // Change password states
    const [pwStep, setPwStep] = useState(0); // 0=hidden, 1=phone, 2=otp, 3=newpw
    const [pwPhone, setPwPhone] = useState('');
    const [pwOtp, setPwOtp] = useState('');
    const [pwNew, setPwNew] = useState('');
    const [pwConfirm, setPwConfirm] = useState('');
    const [pwSending, setPwSending] = useState(false);
    const [pwChanging, setPwChanging] = useState(false);
    const [showPw, setShowPw] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get('/users/me');
                const profile = res.data.data.user;
                setAuthProvider(profile.authProvider || 'local');
                setPwPhone(profile.phoneNumber || '');
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
            const res = await api.patch('/users/update-me', {
                name: userData.name,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                residentialLocation: userData.residentialLocation
            });
            if (updateUser && res.data?.data?.user) {
                updateUser(res.data.data.user);
            }
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handleSendOTP = async () => {
        if (!pwPhone.trim()) return toast.error('Please enter your WhatsApp number');
        setPwSending(true);
        try {
            await api.post('/auth/send-otp', { phone: pwPhone });
            toast.success('OTP sent to your WhatsApp!');
            setPwStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send OTP');
        } finally {
            setPwSending(false);
        }
    };

    const handleChangePassword = async () => {
        if (!pwOtp || !pwNew || !pwConfirm) return toast.error('All fields are required');
        if (pwNew !== pwConfirm) return toast.error('Passwords do not match');
        if (pwNew.length < 8) return toast.error('Password must be at least 8 characters');
        setPwChanging(true);
        try {
            await api.post('/auth/verify-otp-change-password', {
                otp: pwOtp, newPassword: pwNew, confirmPassword: pwConfirm
            });
            toast.success('Password changed successfully! Please log in again.');
            setPwStep(0); setPwOtp(''); setPwNew(''); setPwConfirm('');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password');
        } finally {
            setPwChanging(false);
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                {/* Minimal Header area */}
                <div className="bg-slate-50 dark:bg-slate-800/50 pt-12 pb-8 px-8 flex flex-col items-center border-b border-slate-100 dark:border-slate-800">
                    <div className="w-28 h-28 rounded-full shadow-inner shadow-slate-200/50 mb-5 relative group">
                        <div className="w-full h-full bg-white dark:bg-slate-800 rounded-full flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800 shadow-sm">
                            <img
                                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || authUser?.name || 'User')}&background=10b981&color=fff&bold=true&size=112`}
                                alt="Avatar"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white capitalize tracking-tight">
                        {userData.name || authUser?.name || 'Complete Your Profile'}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1.5 font-medium">Manage your personal information</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 max-w-lg mx-auto">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="text"
                                    name="name"
                                    value={userData.name}
                                    onChange={handleChange}
                                    placeholder="Enter your full name"
                                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-sm shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="email"
                                    name="email"
                                    value={userData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-sm shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
                            <div className="relative group">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="tel"
                                    name="phoneNumber"
                                    value={userData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="+1 (234) 567 890"
                                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-sm shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Location</label>
                            <div className="relative group">
                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                <input
                                    type="text"
                                    value={userData.residentialLocation.address}
                                    onChange={handleLocationChange}
                                    placeholder="City, Country"
                                    className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium text-sm shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="pt-6 pb-2">
                            <button
                                type="submit"
                                disabled={saving}
                                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                            >
                                {saving ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Save Changes</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;

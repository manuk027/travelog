import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { Loader2, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match');
        }

        setIsSubmitting(true);
        const result = await register({
            name: formData.name,
            email: formData.email,
            password: formData.password
        });
        setIsSubmitting(false);

        if (result.success) {
            navigate('/');
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setIsSubmitting(true);
        try {
            const payload = JSON.parse(atob(credentialResponse.credential.split('.')[1]));
            const result = await login({
                email: payload.email,
                name: payload.name,
                googleId: payload.sub,
            }, true);
            if (result.success) navigate('/');
        } catch (error) {
            console.error('Google registration error:', error);
            toast.error('Failed to process Google registration');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 via-white to-green-50 relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-emerald-100/40 rounded-full blur-[100px] -translate-y-1/2 -translate-x-1/2" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-green-100/30 rounded-full blur-[80px] translate-y-1/2 translate-x-1/2" />

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-8 animate-fade-in">
                    <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
                        <span className="font-logo text-4xl tracking-tight text-slate-800">
                            trave<span className="italic text-emerald-600">Log</span>
                        </span>
                    </Link>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">
                        Create account
                    </h2>
                    <p className="mt-2 text-slate-400 font-light">
                        Already have an account?{' '}
                        <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl border border-slate-200/60 shadow-xl shadow-emerald-900/5 animate-scale-in">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                                Full Name
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <User className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                                Email address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    minLength={8}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="block w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">
                                Confirm Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                                </div>
                                <input
                                    name="confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    required
                                    minLength={8}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="block w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-emerald-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 px-6 mt-2 text-white font-bold bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Account'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-100" />
                        </div>
                        <div className="relative flex justify-center text-xs">
                            <span className="px-4 bg-white text-slate-400 font-medium uppercase tracking-widest text-[10px]">
                                or continue with
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-center flex-col items-center gap-4">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error('Google Sign Up Failed')}
                            useOneTap
                            theme="outline"
                            shape="pill"
                            width="250px"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;

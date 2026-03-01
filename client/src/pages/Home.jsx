import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MapPin, Camera, Shield, Users, ArrowRight, Globe2, Sparkles, Leaf } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Home = () => {
    const { user, api } = useAuth();
    const [stats, setStats] = useState({ users: 0, places: 0, countries: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await api.get('/places/stats');
                if (res.data?.data) setStats(res.data.data);
            } catch (err) {
                console.error('Failed to fetch stats:', err);
            }
        };
        fetchStats();
    }, []);

    const features = [
        {
            icon: <Camera className="w-6 h-6" />,
            title: 'Share Your Travels',
            description: 'Upload photos and videos of stunning locations you have discovered around the world.',
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            title: 'Explore Nearby',
            description: 'Find amazing travel destinations near you using our geolocation-powered discovery.',
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: 'Community Driven',
            description: 'Join a growing community of travelers sharing their favorite hidden gems.',
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: 'Quality Assured',
            description: 'Every submission is reviewed by our admins to ensure quality and accuracy.',
        }
    ];

    return (
        <div className="animate-fade-in">
            {/* ===== HERO SECTION ===== */}
            <section className="relative overflow-hidden min-h-screen flex items-center bg-gradient-to-br from-emerald-50 via-white to-green-50">
                {/* Subtle decorative blobs */}
                <div className="absolute top-20 right-[15%] w-[500px] h-[500px] bg-emerald-100/60 rounded-full blur-[120px]" />
                <div className="absolute bottom-20 left-[10%] w-[400px] h-[400px] bg-green-100/50 rounded-full blur-[100px]" />
                <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] bg-teal-50/40 rounded-full blur-[80px]" />

                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 text-center">
                    {/* Minimal badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 mb-10 animate-scale-in">
                        <Leaf className="w-4 h-4 text-emerald-500" />
                        <span className="text-sm font-medium text-emerald-700 tracking-wide">Your next adventure starts here</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-slate-800 mb-6 leading-[1.1]">
                        Discover & Share
                        <br />
                        <span className="text-emerald-600">
                            Amazing Places
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-xl mx-auto leading-relaxed font-light">
                        A community where travelers share their favorite locations with photos, videos, and map coordinates.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/explore"
                            className="group inline-flex items-center gap-2.5 px-8 py-4 text-base font-bold rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-200 hover:scale-[1.02] transition-all duration-300"
                        >
                            <Globe2 className="w-5 h-5" />
                            Explore Places
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        {!user && (
                            <Link
                                to="/register"
                                className="group inline-flex items-center gap-2.5 px-8 py-4 text-base font-bold rounded-2xl bg-white text-slate-700 border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 hover:scale-[1.02] transition-all duration-300 shadow-sm"
                            >
                                <Sparkles className="w-5 h-5 text-emerald-500" />
                                Get Started Free
                            </Link>
                        )}
                    </div>

                    {/* Dynamic Stats */}
                    <div className="grid grid-cols-3 gap-8 max-w-md mx-auto mt-16">
                        {[
                            { value: stats.users, label: 'Users' },
                            { value: stats.places, label: 'Places Shared' },
                            { value: stats.countries, label: 'Countries' },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <p className="text-2xl sm:text-3xl font-bold text-slate-800">{stat.value}</p>
                                <p className="text-xs text-slate-400 mt-1 font-medium tracking-wide">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FEATURES SECTION ===== */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-800">
                            Why travelers love
                            <span className="font-logo italic text-emerald-600"> traveLog</span>
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto mt-4">
                            Everything you need to discover, share, and connect with fellow travelers around the world.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="group p-6 rounded-2xl bg-white border border-slate-100 hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-50 transition-all duration-300"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-100 transition-all duration-300">
                                    <div className="text-emerald-600">
                                        {feature.icon}
                                    </div>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-slate-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA SECTION ===== */}
            <section className="py-20 bg-emerald-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />

                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                        Ready to share your adventures?
                    </h2>
                    <p className="text-emerald-100 text-lg mb-8 max-w-xl mx-auto">
                        Join travelers sharing their favorite places with the world.
                    </p>
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold rounded-2xl bg-white text-emerald-700 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
                    >
                        <Sparkles className="w-5 h-5" />
                        Start Sharing
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Loader2, Save, ArrowLeft, Pencil } from 'lucide-react';

const FIELD_CONFIG = [
    { name: 'name', label: 'Place Name', type: 'text', required: true, span: 2 },
    { name: 'district', label: 'District', type: 'text', required: true },
    { name: 'state', label: 'State / Province', type: 'text', required: true },
    { name: 'country', label: 'Country', type: 'text', required: true },
    { name: 'pincode', label: 'Pincode / Zipcode', type: 'text' },
    {
        name: 'status', label: 'Status', type: 'select', options: [
            { value: 'approved', label: 'Approved' },
            { value: 'pending', label: 'Pending' },
            { value: 'rejected', label: 'Rejected' },
        ]
    },
    { name: 'description', label: 'Description', type: 'textarea', span: 2 },
];

const EditPlace = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { api, user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({
        name: '', district: '', state: '', country: '', pincode: '', description: '', status: 'approved'
    });

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const res = await api.get(`/places/${id}`);
                const p = res.data.data.place;
                setForm({
                    name: p.name || '',
                    district: p.district || '',
                    state: p.state || '',
                    country: p.country || '',
                    pincode: p.pincode || '',
                    description: p.description || '',
                    status: p.status || 'approved',
                });
            } catch {
                toast.error('Failed to load place details');
            } finally {
                setLoading(false);
            }
        };
        fetchPlace();
    }, [id, api]);

    // Redirect if not admin
    if (user && user.role !== 'admin') {
        navigate('/explore');
        return null;
    }

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.patch(`/places/${id}`, form);
            toast.success('Place updated successfully');
            navigate(`/places/${id}`);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update place');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <button
                    onClick={() => navigate(`/places/${id}`)}
                    className="p-2 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 transition-all"
                >
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <Pencil className="w-3.5 h-3.5 text-emerald-600" />
                        </div>
                        <h1 className="text-xl font-black text-slate-800 tracking-tight">Edit Place</h1>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 ml-9">Admin · All changes are saved immediately</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {FIELD_CONFIG.map(({ name, label, type, required, span, options }) => (
                        <div key={name} className={span === 2 ? 'sm:col-span-2' : ''}>
                            <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wider">
                                {label} {required && <span className="text-rose-400">*</span>}
                            </label>

                            {type === 'textarea' ? (
                                <textarea
                                    name={name}
                                    value={form[name]}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent resize-none font-medium transition-all"
                                />
                            ) : type === 'select' ? (
                                <select
                                    name={name}
                                    value={form[name]}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent font-medium transition-all"
                                >
                                    {options.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={type}
                                    name={name}
                                    value={form[name]}
                                    onChange={handleChange}
                                    required={required}
                                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent font-medium transition-all"
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex gap-3 pt-2 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => navigate(`/places/${id}`)}
                        className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        {saving ? 'Saving…' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditPlace;

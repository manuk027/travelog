import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LocationPicker from '../components/LocationPicker';
import { toast } from 'react-toastify';
import { Loader2, UploadCloud, X, Leaf, Image as ImageIcon, Video } from 'lucide-react';

const AddPlace = () => {
    const { api } = useAuth();
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        district: '',
        state: '',
        country: '',
        pincode: '',
        description: ''
    });
    const [location, setLocation] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [videos, setVideos] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePhotoChange = (e) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);
            const remaining = 4 - photos.length;

            if (remaining <= 0) {
                toast.warning('You can upload a maximum of 4 photos.');
                return;
            }

            const validFiles = [];
            for (const file of selectedFiles) {
                if (file.size > 2 * 1024 * 1024) {
                    toast.error(`"${file.name}" exceeds 2MB limit`);
                    continue;
                }
                if (validFiles.length < remaining) {
                    validFiles.push(file);
                } else {
                    toast.warning('Max 4 photos allowed. Some files were skipped.');
                    break;
                }
            }

            if (validFiles.length > 0) {
                setPhotos((prev) => [...prev, ...validFiles]);
                const newPreviewUrls = validFiles.map(file => URL.createObjectURL(file));
                setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
            }
        }
    };

    const handleVideoChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 10 * 1024 * 1024) {
                toast.error(`Video exceeds 10MB limit`);
                return;
            }
            setVideos([file]);
        }
    };

    const removePhoto = (index) => {
        URL.revokeObjectURL(previewUrls[index]);
        setPhotos(photos.filter((_, i) => i !== index));
        setPreviewUrls(previewUrls.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!location) {
            return toast.error('Please drop a pin or search for the location.');
        }
        if (photos.length === 0) {
            return toast.error('Please upload at least one photo.');
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('district', formData.district);
        data.append('state', formData.state);
        data.append('country', formData.country);
        data.append('pincode', formData.pincode);
        data.append('description', formData.description);
        data.append('lat', location.lat);
        data.append('lng', location.lng);
        if (location.plusCode) {
            data.append('plusCode', location.plusCode);
        }

        photos.forEach(photo => data.append('photos', photo));
        videos.forEach(video => data.append('videos', video));

        setIsSubmitting(true);
        try {
            await api.post('/places', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success('Place submitted successfully! Waiting for admin approval.');
            navigate('/explore');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to submit place');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Shared input classes
    const inputClass = "block w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-2xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium placeholder-slate-400 dark:placeholder-slate-500";

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-12 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                            <Leaf className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight mb-2">
                        Share a <span className="text-emerald-600">Travel Location</span>
                    </h1>
                    <p className="text-slate-400 dark:text-slate-500 font-light max-w-xl mx-auto">
                        Tell the world about your discoveries. Every submission is reviewed by our team to maintain quality and community standards.
                    </p>
                </div>

                <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-700/60 shadow-xl shadow-emerald-900/5 transition-all">
                    <form onSubmit={handleSubmit} className="space-y-8">

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Place Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={inputClass}
                                    placeholder="e.g. Whispering Woods"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">District</label>
                                <input
                                    type="text"
                                    name="district"
                                    required
                                    value={formData.district}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">State / Province</label>
                                <input
                                    type="text"
                                    name="state"
                                    required
                                    value={formData.state}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Country</label>
                                <input
                                    type="text"
                                    name="country"
                                    required
                                    value={formData.country}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Pincode / Zipcode</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    required
                                    value={formData.pincode}
                                    onChange={handleChange}
                                    className={inputClass}
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 ml-1">Description</label>
                                <textarea
                                    name="description"
                                    required
                                    rows="4"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className={`${inputClass} resize-none`}
                                    placeholder="Describe the beauty, history, or your experience at this location..."
                                />
                            </div>
                        </div>

                        {/* Location Picker Section */}
                        <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-6 ml-1">
                                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                                    <Leaf className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Set Location</h3>
                            </div>
                            <LocationPicker onLocationSelect={setLocation} />
                            {location && (
                                <div className="mt-4 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl flex items-center justify-between">
                                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Coordinates Locked</span>
                                    <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                                        {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Media Section */}
                        <div className="pt-8 border-t border-slate-100 dark:border-slate-700">
                            <div className="flex items-center gap-2 mb-6 ml-1">
                                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                                    <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Media Upload</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                {/* Photos */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                                        Photos <span className="text-slate-400 dark:text-slate-500 font-normal">({photos.length}/4, max 2MB each)</span>
                                    </label>
                                    <div
                                        onClick={() => photos.length < 4 && document.getElementById('photo-upload').click()}
                                        className={`h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl transition-all ${photos.length >= 4
                                            ? 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed opacity-50'
                                            : 'border-slate-200 dark:border-slate-600 group hover:border-emerald-500 hover:bg-emerald-50/10 dark:hover:bg-emerald-900/10 cursor-pointer'
                                            }`}
                                    >
                                        <UploadCloud className="h-10 w-10 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 group-hover:scale-110 transition-all" />
                                        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-medium">
                                            {photos.length >= 4 ? 'Max 4 photos reached' : 'Click to upload images'}
                                        </p>
                                        <input
                                            id="photo-upload"
                                            type="file"
                                            accept="image/jpeg, image/png, image/webp"
                                            multiple
                                            onChange={handlePhotoChange}
                                            className="sr-only"
                                        />
                                    </div>

                                    {previewUrls.length > 0 && (
                                        <div className="grid grid-cols-4 gap-2">
                                            {previewUrls.map((url, index) => (
                                                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-100 dark:border-slate-700">
                                                    <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removePhoto(index)}
                                                        className="absolute top-1 right-1 p-1 bg-white/90 dark:bg-slate-800/90 text-rose-500 rounded-md shadow-sm backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Video */}
                                <div className="space-y-4">
                                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">
                                        Video <span className="text-slate-400 dark:text-slate-500 font-normal">(1 file, max 10MB)</span>
                                    </label>
                                    <div
                                        onClick={() => !videos.length && document.getElementById('video-upload').click()}
                                        className={`h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl transition-all ${videos.length
                                            ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 cursor-default'
                                            : 'border-slate-200 dark:border-slate-600 group hover:border-emerald-500 hover:bg-emerald-50/10 dark:hover:bg-emerald-900/10 cursor-pointer'
                                            }`}
                                    >
                                        <Video className="h-10 w-10 text-slate-300 dark:text-slate-600 group-hover:text-emerald-500 group-hover:scale-110 transition-all" />
                                        <p className="mt-2 text-sm text-slate-400 dark:text-slate-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 font-medium">
                                            {videos.length ? `✓ ${videos[0].name}` : 'Click to upload video'}
                                        </p>
                                        <input
                                            id="video-upload"
                                            type="file"
                                            accept="video/mp4,video/quicktime"
                                            onChange={handleVideoChange}
                                            className="sr-only"
                                        />
                                    </div>
                                    {videos.length > 0 && (
                                        <button
                                            type="button"
                                            onClick={() => setVideos([])}
                                            className="flex items-center gap-1.5 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
                                        >
                                            <X className="w-3 h-3" /> Remove video
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-8">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 px-6 text-white font-bold bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 hover:bg-emerald-700 hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span>Publishing...</span>
                                    </>
                                ) : (
                                    <span>Submit for Approval</span>
                                )}
                            </button>
                            <p className="text-center mt-4 text-xs text-slate-400 dark:text-slate-500">
                                By submitting, you agree to our community guidelines and terms of service.
                            </p>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPlace;

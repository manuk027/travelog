import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Explore from './pages/Explore';
import AddPlace from './pages/AddPlace';
import PlaceDetails from './pages/PlaceDetails';
import AdminDashboard from './pages/AdminDashboard';
import Profile from './pages/Profile';
import VisitedPlaces from './pages/VisitedPlaces';
import DreamPlaces from './pages/DreamPlaces';
import EditPlace from './pages/EditPlace';

// Replace with your actual client ID in production (e.g., from Vite env)
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id';

function App() {
    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <ThemeProvider>
                <AuthProvider>
                    <SocketProvider>
                        <Router>
                            <div className="min-h-screen flex flex-col bg-slate-50 transition-colors duration-200">
                                <Navbar />

                                <main className="flex-grow pt-20 sm:pt-24">
                                    <Routes>
                                        {/* Public Routes */}
                                        <Route path="/" element={<div className="-mt-20 sm:-mt-24"><Home /></div>} />
                                        <Route path="/explore" element={<Explore />} />
                                        <Route path="/places/:id" element={<PlaceDetails />} />

                                        {/* Auth Routes - Wrapped in PublicRoute to redirect if logged in */}
                                        <Route element={<PublicRoute />}>
                                            <Route path="/login" element={<Login />} />
                                            <Route path="/register" element={<Register />} />
                                        </Route>

                                        {/* Protected User Routes */}
                                        <Route element={<ProtectedRoute />}>
                                            <Route path="/add-place" element={<AddPlace />} />
                                            <Route path="/visited" element={<VisitedPlaces />} />
                                            <Route path="/dream-places" element={<DreamPlaces />} />
                                            <Route path="/profile" element={<Profile />} />
                                        </Route>

                                        {/* Protected Admin Routes */}
                                        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                                            <Route path="/admin/*" element={<AdminDashboard />} />
                                            <Route path="/places/:id/edit" element={<EditPlace />} />
                                        </Route>

                                        {/* Fallback */}
                                        <Route path="*" element={<Home />} />
                                    </Routes>
                                </main>

                                {/* Global Toast Notifications */}
                                <ToastContainer
                                    position="bottom-right"
                                    autoClose={3000}
                                    hideProgressBar={false}
                                    newestOnTop
                                    closeOnClick
                                    rtl={false}
                                    pauseOnFocusLoss
                                    draggable
                                    pauseOnHover
                                    theme="colored"
                                />
                            </div>
                        </Router>
                    </SocketProvider>
                </AuthProvider>
            </ThemeProvider>
        </GoogleOAuthProvider>
    );
}

export default App;

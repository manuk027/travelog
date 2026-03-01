import { Routes, Route } from 'react-router-dom';

// Admin Sub-pages
import AdminHome from './admin/AdminHome';
import AdminApprovals from './admin/AdminApprovals';
import AdminUsers from './admin/AdminUsers';
import AdminNotifications from './admin/AdminNotifications';

const AdminDashboard = () => {
    return (
        <div className="bg-slate-50 min-h-[calc(100vh-5rem)] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Routes>
                    <Route path="/" element={<AdminHome />} />
                    <Route path="/approvals" element={<AdminApprovals />} />
                    <Route path="/users" element={<AdminUsers />} />
                    <Route path="/notifications" element={<AdminNotifications />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminDashboard;

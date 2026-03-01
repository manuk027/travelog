const express = require('express');
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// All admin routes must be protected and restricted to 'admin'
router.use(authMiddleware.protect);
router.use(authMiddleware.restrictTo('admin'));

// Dashboard Stats
router.get('/dashboard', adminController.getDashboardStats);

// User Management
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserDetails);
router.patch('/users/:id/status', adminController.updateUserStatus); // unblock/block
router.delete('/users/:id', adminController.deleteUser); // delete

// Notifications
router.get('/notifications', adminController.getNotifications);
router.patch('/notifications/:id/read', adminController.markNotificationRead);

module.exports = router;

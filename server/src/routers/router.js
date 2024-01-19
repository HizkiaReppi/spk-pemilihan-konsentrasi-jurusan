import express from 'express';
import {
  login,
  register,
  getAllUsers,
  getUserById,
  updateUserById,
  logout,
  deleteUserById,
} from '../controllers/UserController.js';
import authMiddleware, { adminMiddleware, userMiddleware } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.use('/api/v1', router);
router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', authMiddleware, logout);

router.get('/users', authMiddleware, getAllUsers);
router.get('/users/:id', authMiddleware, getUserById);
router.put('/users/:id', authMiddleware, userMiddleware, updateUserById);
router.delete('/users/:id', authMiddleware, adminMiddleware, deleteUserById);

export default router;

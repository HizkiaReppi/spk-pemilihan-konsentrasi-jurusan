import express from 'express';
import { login, register, getAllUsers } from '../controllers/UserController.js';
import authMiddleware from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.use('/api/v1', router);
router.post('/auth/register', register);
router.post('/auth/login', login);

router.get('/users', authMiddleware, getAllUsers);

export default router;

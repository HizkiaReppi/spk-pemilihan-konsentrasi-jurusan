import express from 'express';
import { login, register } from '../controllers/UserController.js';

const router = express.Router();

router.use('/api/v1', router);
router.post('/auth/register', register);
router.post('/auth/login', login);

export default router;

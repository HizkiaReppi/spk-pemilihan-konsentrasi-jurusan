import express from 'express';
import { register } from '../controllers/UserController.js';

const router = express.Router();

router.use('/api/v1', router);
router.post('/auth/register', register);

export default router;

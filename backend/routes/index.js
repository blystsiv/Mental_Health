import express from 'express';

import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import journalRoutes from './journalRoutes.js';
import chatRoutes from './chatRoutes.js';
import moodRoutes from './moodRoutes.js';
import anonymousRoutes from './anonymousRoutes.js';

const router = express.Router();

router.use(express.json());

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/journal', journalRoutes);
router.use('/chat', chatRoutes);
router.use('/moods', moodRoutes);
router.use('/anonymous', anonymousRoutes);

export default router;

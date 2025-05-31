import express from 'express';
import { createMood, getMoods } from '../controller/mood-controller.js';

const router = express.Router();

router.get('/:username', getMoods);
router.post('/:username', createMood);

export default router;

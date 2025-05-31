import express from 'express';
import { createMessage, getMessages } from '../controller/ai-controller.js';

const router = express.Router();

router.get('/:username', getMessages);
router.post('/:username', createMessage);

export default router;

import express from 'express';
import {
  getAnonymousPosts,
  createAnonymousPost,
} from '../controller/anonymous-controller.js';

const router = express.Router();

router.get('/', getAnonymousPosts);
router.post('/', createAnonymousPost);

export default router;

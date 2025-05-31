import express from 'express';
import { userSignup, userLogin } from '../controller/user-controller.js';
import upload from '../multer/multerConfig.js';

const router = express.Router();

router.post('/signup', upload.single('profilePicture'), userSignup);
router.post('/login', userLogin);

export default router;

import express from 'express';
import {
  userSignup,
  userLogin,
  getUsers,
  deleteUser,
  updateUser,
  getUserDetails,
} from '../controller/user-controller.js';
import upload from '../multer/multerConfig.js';

const router = express.Router();

router.get('/', getUsers);
router.get('/:username', getUserDetails);
router.delete('/:username', deleteUser);
router.patch('/:username', updateUser);

export default router;

import express from 'express';
import {
  createJournal,
  getPostsByUsername,
  updateJournal,
  deleteJournal,
  getJournalById,
} from '../controller/journal-controller.js';
import coverPictures from '../multer/multerConfigCover.js';

const router = express.Router();

router.post(
  '/:username/posts',
  coverPictures.single('coverPicture'),
  createJournal,
);
router.get('/:username/posts', getPostsByUsername);
router.get('/:username/posts/:id', getJournalById);
router.put('/:username/posts/:id', updateJournal);
router.delete('/:username/posts/:id', deleteJournal);

export default router;

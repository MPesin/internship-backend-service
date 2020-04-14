import express from 'express';

import {
  getInternships,
  getInternship,
  createInternship,
  updateInternship,
  deleteInternship
} from '../controllers/internships.js';

const router = express.Router();

router
  .route('/')
  .get(getInternships)
  .post(createInternship);

router
  .route('/:id')
  .get(getInternship)
  .put(updateInternship)
  .delete(deleteInternship);

export default router;
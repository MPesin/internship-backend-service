import express from 'express';

import asyncMiddleware from "../middleware/asyncMiddleware.js";

import {
  getInternships,
  getInternship,
  createInternship,
  updateInternship,
  deleteInternship
} from '../controllers/internshipsController.js';

const router = express.Router();

router
  .route('/')
  .get(asyncMiddleware(getInternships))
  .post(asyncMiddleware(createInternship));

router
  .route('/:id')
  .get(asyncMiddleware(getInternship))
  .put(asyncMiddleware(updateInternship))
  .delete(asyncMiddleware(deleteInternship));

export default router;
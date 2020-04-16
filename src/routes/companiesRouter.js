import express from 'express';
import asyncMiddleware from "../middleware/asyncMiddleware.js";

import {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany
} from '../controllers/companiesController.js';

const router = express.Router();

router
  .route('/')
  .get(asyncMiddleware(getCompanies))
  .post(asyncMiddleware(createCompany));

router
  .route('/:id')
  .get(asyncMiddleware(getCompany))
  .put(asyncMiddleware(updateCompany))
  .delete(asyncMiddleware(deleteCompany));

export default router;
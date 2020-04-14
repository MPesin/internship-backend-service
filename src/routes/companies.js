import express from 'express';

import {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany
} from '../controllers/companies.js';

const router = express.Router();

router
  .route('/')
  .get(getCompanies)
  .post(createCompany);

router
  .route('/:id')
  .get(getCompany)
  .put(updateCompany)
  .delete(deleteCompany);

export default router;
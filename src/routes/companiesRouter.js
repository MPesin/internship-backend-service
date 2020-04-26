import express from 'express';
import asyncMiddleware from "../middleware/asyncMiddleware.js";
import * as controller from '../controllers/companiesController.js';
import {
  getInternships
} from '../controllers/internshipsController.js';

const router = express.Router();

router
  .route('/')
  .get(asyncMiddleware(controller.getCompanies))
  .post(asyncMiddleware(controller.createCompany));

router
  .route('/:id')
  .get(asyncMiddleware(controller.getCompany))
  .put(asyncMiddleware(controller.updateCompany))
  .delete(asyncMiddleware(controller.deleteCompany));

router
  .route('/:companyId/internships')
  .get(asyncMiddleware(getInternships));

export default router;
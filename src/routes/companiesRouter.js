import express from 'express';
import asyncMW from '../middleware/asyncMiddleware.js';
import * as controller from '../controllers/companiesController.js';
import handleRequestMW from '../middleware/handleRequestMiddleware.js';
import CompanyModel from '../models/companyModel.js';
import internshipsRouter from '../routes/internshipsRouter.js';
import {
  protect,
  authorize
} from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(asyncMW(handleRequestMW(CompanyModel, 'internships')), asyncMW(controller.getCompanies))
  .post(asyncMW(protect), authorize('admin', 'recruiter'), asyncMW(controller.createCompany));

router
  .route('/:id')
  .get(asyncMW(controller.getCompany))
  .put(asyncMW(protect), authorize('admin', 'recruiter'), asyncMW(controller.updateCompany))
  .delete(asyncMW(protect), authorize('admin', 'recruiter'), asyncMW(controller.deleteCompany));

// route photo upload
router
  .route('/:id/uploads/photo')
  .put(asyncMW(protect), authorize('admin', 'recruiter'), asyncMW(controller.uploadPhotoCompany));

// re-route into resource routers
router.use('/:companyId/internships', internshipsRouter);

export default router;
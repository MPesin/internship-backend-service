import express from 'express';
import asyncMW from '../middleware/asyncMiddleware.js';
import * as controller from '../controllers/companiesController.js';
import handleRequestMW from '../middleware/handleRequestMiddleware.js';
import CompanyModel from '../models/companyModel.js';
import internshipsRouter from '../routes/internshipsRouter.js';
import usersRouter from './usersRouter.js';
import {
  protect,
  authorize
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(asyncMW(protect));

router
  .route('/')
  .get(
    asyncMW(handleRequestMW(CompanyModel, 'internships')),
    asyncMW(controller.getCompanies))
  .post(
    authorize('companyAdmin'),
    asyncMW(controller.createCompany));

router
  .route('/:id')
  .get(
    asyncMW(controller.getCompany))
  .put(
    authorize('companyAdmin'),
    asyncMW(controller.updateCompany))
  .delete(
    authorize('companyAdmin'),
    asyncMW(controller.deleteCompany));

// route photo upload
router
  .route('/:id/uploads/photo')
  .put(
    authorize('companyAdmin'),
    asyncMW(controller.uploadPhotoCompany));

// re-route into resource routers
router.use('/:companyId/internships', internshipsRouter);
router.use('/:companyId/users', usersRouter);

export default router;
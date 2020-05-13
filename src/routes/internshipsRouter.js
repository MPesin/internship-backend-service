import express from 'express';
import asyncMW from '../middleware/asyncMiddleware.js';
import InternshipModel from '../models/internshipModel.js';
import handleRequestMW from '../middleware/handleRequestMiddleware.js';
import * as controller from '../controllers/internshipsController.js';
import {
  protect,
  authorize
} from '../middleware/authMiddleware.js';

const router = express.Router({
  mergeParams: true
});

router.use(asyncMW(protect));

router
  .route('/')
  .get(
    handleRequestMW(InternshipModel, {
      path: 'company',
      select: 'name'
    }),
    asyncMW(controller.getInternships))
  .post(
    authorize('companyAdmin', 'recruiter'),
    asyncMW(controller.createInternship));

router
  .route('/:id')
  .get(
    asyncMW(controller.getInternship))
  .put(
    authorize('companyAdmin', 'recruiter'),
    asyncMW(controller.updateInternship))
  .delete(
    authorize('companyAdmin', 'recruiter'),
    asyncMW(controller.deleteInternship));

router
  .route('/radius/:address/:distance/:unit')
  .get(
    asyncMW(controller.getInternshipsInRadius));

export default router;
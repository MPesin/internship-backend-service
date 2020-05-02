import express from 'express';
import asyncMW from "../middleware/asyncMiddleware.js";
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

router
  .route('/')
  .get(handleRequestMW(InternshipModel, {
    path: 'company',
    select: 'name'
  }), asyncMW(controller.getInternships))
  .post(asyncMW(protect), authorize('admin', 'recruiter'), asyncMW(controller.createInternship));

router
  .route('/:id')
  .get(asyncMW(controller.getInternship))
  .put(asyncMW(protect), authorize('admin', 'recruiter'), asyncMW(controller.updateInternship))
  .delete(asyncMW(protect), authorize('admin', 'recruiter'), asyncMW(controller.deleteInternship));

router
  .route('/radius/:address/:distance/:unit')
  .get(asyncMW(controller.getInternshipsInRadius));

export default router;
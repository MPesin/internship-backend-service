import express from 'express';
import asyncMW from "../middleware/asyncMiddleware.js";
import InternshipModel from '../models/internshipModel.js';
import handleRequestMW from '../middleware/handleRequestMiddleware.js';
import * as controller from '../controllers/internshipsController.js';
import protect from '../middleware/protectMiddleware.js';

const router = express.Router({
  mergeParams: true
});

router
  .route('/')
  .get(handleRequestMW(InternshipModel, {
    path: 'company',
    select: 'name'
  }), asyncMW(controller.getInternships))
  .post(asyncMW(protect), asyncMW(controller.createInternship));

router
  .route('/:id')
  .get(asyncMW(controller.getInternship))
  .put(asyncMW(protect), asyncMW(controller.updateInternship))
  .delete(asyncMW(protect), asyncMW(controller.deleteInternship));

router
  .route('/radius/:address/:distance/:unit')
  .get(asyncMW(controller.getInternshipsInRadius));

export default router;
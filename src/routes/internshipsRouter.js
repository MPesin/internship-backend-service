import express from 'express';
import asyncMiddleware from "../middleware/asyncMiddleware.js";
import * as controller from '../controllers/internshipsController.js';

const router = express.Router();

router
  .route('/')
  .get(asyncMiddleware(controller.getInternships))
  .post(asyncMiddleware(controller.createInternship));

router
  .route('/:id')
  .get(asyncMiddleware(controller.getInternship))
  .put(asyncMiddleware(controller.updateInternship))
  .delete(asyncMiddleware(controller.deleteInternship));

router
  .route('/radius/:address/:distance')
  .get(asyncMiddleware(controller.getInternshipsInRadius));

export default router;
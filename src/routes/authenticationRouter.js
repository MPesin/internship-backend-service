import express from 'express';
import asyncMW from '../middleware/asyncMiddleware.js';
import * as controller from '../controllers/authenticationController.js';

const router = express.Router();

router
  .route('/register')
  .post(asyncMW(controller.registerUser));

router
  .route('/login')
  .post(asyncMW(controller.loginUser));

export default router;
import express from 'express';
import asyncMW from '../middleware/asyncMiddleware.js';
import * as controller from '../controllers/authenticationController.js';
import {
  protect
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', asyncMW(controller.registerUser));

router.post('/login', asyncMW(controller.loginUser));

router.get('/current', asyncMW(protect), asyncMW(controller.getCurrentUser));

export default router;
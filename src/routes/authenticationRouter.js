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

router.put('/updateuserinfo', asyncMW(protect), asyncMW(controller.updateUserInfo));

router.put('/updateuserpassword', asyncMW(protect), asyncMW(controller.updateUserPassword));

router.post('/forgotpassword', asyncMW(controller.forgotPassword));

router.put('/resetpassword/:resettoken', asyncMW(controller.resetPassword));

router.delete('/', asyncMW(controller.deleteUser))

export default router;
import express from 'express';
import asyncMW from '../middleware/asyncMiddleware.js';
import UserModel from '../models/userModel.js';
import handleRequestMW from '../middleware/handleRequestMiddleware.js';
import * as controller from '../controllers/usersController.js';
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
    handleRequestMW(UserModel),
    authorize('recruiter', 'companyAdmin', 'admin'),
    asyncMW(controller.getUsers))
  .post(
    authorize('companyAdmin', 'admin'),
    asyncMW(controller.createUser));

router
  .route('/:id')
  .get(
    authorize('recruiter', 'companyAdmin', 'admin'),
    asyncMW(controller.getUser)
  )
  .delete(
    authorize('companyAdmin', 'admin'),
    asyncMW(controller.deleteUser)
  )

export default router;
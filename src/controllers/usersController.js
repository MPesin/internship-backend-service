import userModel from '../models/userModel.js';
import companyModel from '../models/companyModel.js';
import ErrorResponse from '../utils/ErrorResponse.js';

/**
 * Get all users
 * @route   GET /api/v1/auth/users/
 * @route   GET /api/v1/companies/:companyId/users/
 * @access  Private
 */
export async function getUsers(req, res, next) {
  const role = req.user.role;
  let data;

  if (!req.params.companyId) {
    if (role === 'admin') {
      data = req.handleRequest;
    } else {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
  } else {
    const company = await companyModel.findById(req.params.companyId);

    // check if 'admin' or if the user is associated to the company
    if (role !== 'admin' &&
      company.admin !== req.user.id &&
      (!company.recruiters.includes(req.user.id))) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
    const admin = await userModel.findById(company.admin);
    const recruiters = [];
    if (company.recruiters.length !== 0) {
      for (const idIndex in company.recruiters) {
        recruiters.push(await userModel.findById(company.recruiters[idIndex]));
      }
    }
    data = {
      success: true,
      companyName: company.name,
      recruiters,
      admin
    }
  }
  res.status(200).json(data);
}

/**
 * Get single user
 * @route   GET /api/v1/auth/users/:id
 * @access  Private
 */
export async function getUser(req, res, next) {

  // if user is company admin, he can only query users associated with his company
  if (req.user.role === 'companyAdmin' &&
    req.user.id !== req.params.id) // check the company admin isn't querying himself
  {
    const company = await companyModel.findOne({
      admin: req.user.id
    });
    if (!company.recruiters.includes(req.params.id)) {
      return next(new ErrorResponse('Company Admin can only query company associated users', 401));
    }
  }

  const user = await userModel.findById(req.params.id);

  if (!user) {
    return next(new ErrorResponse(`user id ${req.params.id} doesn't exist`, 404));
  }

  res.status(200).json({
    success: true,
    user
  });
}

/**
 * Create a user
 * @route   POST /api/v1/auth/users
 * @route   POST /api/v1/companies/:companyId/users
 * @access  Private
 */
export async function createUser(req, res, next) {
  const user = userModel.create(req.body);

  res.status(201).json({
    success: true,
    user
  });
}
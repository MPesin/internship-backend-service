import userModel from '../models/userModel.js';
import companyModel from '../models/companyModel.js';
import ErrorResponse from '../utils/ErrorResponse.js';

/**
 * Get all users
 * @route   GET /api/v1/users/
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
    if (!isUserInCompanyOrAdmin(req.user, company)) {
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
 * @route   GET /api/v1/users/:id
 * @route   GET /api/v1/companies/:companyId/users/:id
 * @access  Private
 */
export async function getUser(req, res, next) {
  const queriedUser = await userModel.findById(req.params.id);

  if (!queriedUser) {
    return next(new ErrorResponse(`user id ${req.params.id} doesn't exist`, 404));
  }

  if (req.params.companyId) {
    const company = await companyModel.findById(req.params.companyId);

    // check if current user belongs to the company (if he's not an admin)
    if (!isUserInCompanyOrAdmin(req.user, company)) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }

    // check if queried user id belongs to the company
    if (!isUserInCompany(queriedUser, company)) {
      return next(new ErrorResponse(`The id ${queriedUser.id} was not found in company \'${company.name}\'`, 404));
    }
  } else {
    // only admin can use this route
    if (req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
  }

  res.status(200).json({
    success: true,
    user: queriedUser
  });
}

/**
 * Create a user
 * @route   POST /api/v1/users
 * @route   POST /api/v1/companies/:companyId/users
 * @access  Private
 */
export async function createUser(req, res, next) {
  let company;
  if (!req.params.companyId) {
    if (req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
  } else {
    company = await companyModel.findById(req.params.companyId);
    // check if current user belongs to the company (if he's not an admin)
    if (!isUserInCompanyOrAdmin(req.user, company)) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
  }

  const user = await userModel.create(req.body);

  if (company) {
    user.role = 'recruiter';
    await user.save();

    if (company.recruiters) {
      company.recruiters.push(user);
    } else {
      company.recruiters = [user];
    }
    await company.save();
  }

  res.status(201).json({
    success: true,
    user
  });
}

/**
 * Delete a user
 * @route   DELETE /api/v1/users/:id
 * @route   DELETE /api/v1/companies/:companyId/users/:id
 * @access  Private
 */
export async function deleteUser(req, res, next) {
  if (!req.params.companyId) {
    if (req.user.role === 'companyAdmin') {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
  } else {
    const company = await companyModel.findById(req.params.companyId);
    // check if current user belongs to the company (if he's not an admin)
    if (!isUserInCompanyOrAdmin(req.user, company)) {
      return next(new ErrorResponse('Not authorized to access this route', 401));
    }
  }

  // User can't delete himself
  if (req.user.id == req.params.id) {
    return next(new ErrorResponse('User can\'t delete himself', 404));
  }

  const user = await userModel.findById(req.params.id);
  if (!user) {
    return next(new ErrorResponse(`user id ${req.params.id} doesn't exist`, 404));
  } else {
    await user.remove();

    res.status(200).json({
      success: true,
      user
    });
  }
}

/**
 * Check if `user` is a `company admin` or a `recruiter` in the `company`
 * @param {Object} user user to check
 * @param {Document} company company to check in
 */
function isUserInCompany(user, company) {
  let inCompany = false;
  if (company.admin == user.id ||
    (company.recruiters && company.recruiters.includes(user.id))) {
    inCompany = true;
  }
  return inCompany;
}


/**
 * Check if `user` is a `company admin` or a `recruiter` in the `company`, or if he's an `admin`
 * @param {Object} user user to check
 * @param {Document} company company to check in
 */
function isUserInCompanyOrAdmin(user, company) {
  let inCompany = false;
  if (user.role === 'admin' ||
    isUserInCompany(user, company)) {
    inCompany = true;
  }
  return inCompany;
}
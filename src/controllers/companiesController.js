import CompanyModel from "../models/companyModel.js";
import ErrorResponse from '../utils/ErrorResponse.js';
import path from 'path';

/**
 * Get all Companies
 * @route   GET /api/v1/companies/
 * @access  Public
 */
export function getCompanies(req, res, next) {
  res.status(200).json(req.handleRequest);
}

/**
 * Get a single Company
 * @route   GET /api/v1/companies/:id
 * @access  Public
 */
export async function getCompany(req, res, next) {

  const company = await CompanyModel.findById(req.params.id);

  if (!company) {
    return next(new ErrorResponse(`company id ${req.params.id} doesn't exist`, 404));
  }

  res.status(200).json({
    success: true,
    data: company
  });
}

/**
 * Create a Company
 * @route   POST /api/v1/companies/
 * @access  Private
 */
export async function createCompany(req, res, next) {

  const currentUser = req.user;

  // set the user in the body
  req.body.admin = currentUser.id

  const publishedCompany = CompanyModel.findOne({
    user: currentUser.id
  });

  if (publishedCompany && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${currentUser.fullName}, ID ${currentUser.id}, already listed company ${publishedCompany.name}`), 400);
  }

  const company = await CompanyModel.create(req.body);

  res.status(201).json({
    success: true,
    data: company
  });
}

/**
 * Update a single Company
 * @route   PUT /api/v1/companies/:id
 * @access  Private
 */
export async function updateCompany(req, res, next) {
  let company = await CompanyModel.findById(req.params.id);

  if (!company) {
    return next(new ErrorResponse(`company id ${req.params.id} doesn't exist`, 404));
  }

  if (company.admin.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(new ErrorResponse(`User ${req.user.fullName} ID ${req.user.id} is not authorized to change this company`, 401));
  }

  company = await CompanyModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: company
  });
}

/**
 * Delete a single Company
 * @route   DELETE /api/v1/companies/:id
 * @access  Private
 */
export async function deleteCompany(req, res, next) {

  const company = await CompanyModel.findById(req.params.id);

  if (!company) {
    return next(new ErrorResponse(`company id ${req.params.id} doesn't exist`, 404));
  }
  // seperate remove from find to trigger 'remove' middleware
  company.remove();

  res.status(200).json({
    success: true,
    data: company
  });
}

/**
 * Upload a photo for the company
 * @route   PUT /api/v1/companies/:id/upload/photo
 * @access  Private
 */
export async function uploadPhotoCompany(req, res, next) {

  const company = await CompanyModel.findById(req.params.id);

  if (!company) {
    return next(new ErrorResponse(`company id ${req.params.id} doesn't exist`, 404));
  }

  if (!req.files) {
    return next(new ErrorResponse('Please upload a file', 400));
  }

  const file = req.files.file;

  // validate file type
  if (!file.mimetype.startsWith('image')) {
    return next(new ErrorResponse('Please upload an image file', 400));
  }

  // validate file size
  const maxSize = process.env.MAX_IMAGE_FILE_SIZE;
  if (file.size > maxSize) {
    return next(new ErrorResponse(`File size is too large, it must be smaller than ${maxSize}`, 400));
  }

  // rename file
  file.name = generateFileName('photo', company._id, path.parse(file.name).ext);

  file.mv(`${process.env.PUBLIC_IMAGES_PATH}/${file.name}`, async err => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse('Error while uploading the file', 500));
    }

    await CompanyModel.findByIdAndUpdate(req.params.id, {
      photo: file.name
    });

    res.status(200).json({
      success: true,
      data: file.name
    });
  });
}

function generateFileName(type, companyId, extension) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() < 10 ? `0${now.getMonth()}` : now.getMonth();
  const day = now.getDate() < 10 ? `0${now.getDate()}` : now.getDate();
  const hours = now.getHours() < 10 ? `0${now.getHours()}` : now.getHours();
  const minutes = now.getMinutes() < 10 ? `0${now.getMinutes()}` : now.getMinutes();
  const seconds = now.getSeconds() < 10 ? `0${now.getSeconds()}` : now.getSeconds();

  return `${type}_${companyId}_${year}${month}${day}_${hours}${minutes}${seconds}${extension}`;
}
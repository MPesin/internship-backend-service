import CompanyModel from "../models/companyModel.js";
import ErrorResponse from '../utils/ErrorResponse.js';

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
  } else {
    res.status(200).json({
      success: true,
      data: company
    });
  }
}

/**
 * Create a Company
 * @route   POST /api/v1/companies/
 * @access  Private
 */
export async function createCompany(req, res, next) {
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
  const company = await CompanyModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!company) {
    return next(new ErrorResponse(`company id ${req.params.id} doesn't exist`, 404));
  } else {
    res.status(200).json({
      success: true,
      data: company
    });
  }
}

/**
 * Delete a single Company
 * @route   DELETE /api/v1/companies/:id
 * @access  Private
 */
export async function deleteCompany(req, res, next) {
  const company = await CompanyModel.findByIdAndDelete(req.params.id);
  if (!company) {
    return next(new ErrorResponse(`company id ${req.params.id} doesn't exist`, 404));
  } else {
    res.status(200).json({
      success: true,
      data: company
    });
  }
}
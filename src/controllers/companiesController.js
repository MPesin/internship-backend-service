import CompanyDB from "../models/companyModel.js";
import ErrorResponse from '../utils/ErrorResponse.js';
import {
  filterQuery
} from '../utils/filters.js';


/**
 * Get all Companies
 * @route   GET /api/v1/companies/
 * @access  Public
 */
export async function getCompanies(req, res, next) {

  const queryFiltered = filterQuery(req.query);

  const query = CompanyDB.find(queryFiltered.query);

  if (queryFiltered !== '') {
    query.select(queryFiltered.select);
  }

  query.sort(queryFiltered.sort);

  // pagination
  const limit = queryFiltered.limit;
  const page = queryFiltered.page;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await CompanyDB.countDocuments();

  const pagination = {};

  query.skip(startIndex).limit(limit);

  const companies = await query;

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  res.status(200).json({
    success: true,
    count: companies.length,
    pagination,
    data: companies
  });
}

/**
 * Get a single Company
 * @route   GET /api/v1/companies/:id
 * @access  Public
 */
export async function getCompany(req, res, next) {
  const company = await CompanyDB.findById(req.params.id);
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
  const company = await CompanyDB.create(req.body);
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
  const company = await CompanyDB.findByIdAndUpdate(req.params.id, req.body, {
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
  const company = await CompanyDB.findByIdAndDelete(req.params.id);
  if (!company) {
    return next(new ErrorResponse(`company id ${req.params.id} doesn't exist`, 404));
  } else {
    res.status(200).json({
      success: true,
      data: company
    });
  }
}
import CompanyDB from "../models/company.js";

// @desc    Get all Companies
// @route   GET /api/v1/Companies
// @access  Public
export async function getCompanies(req, res, next) {
  try {
    const Companies = await CompanyDB.find();
    res.status(200).json({
      success: true,
      data: Companies
    });
  } catch (error) {
    onFail(res, error);
  }
}

// @desc    Get specific Companies
// @route   GET /api/v1/Companies/:id
// @access  Public
export function getCompany(req, res, next) {

  res.status(200).json({
    success: true,
    data: `get Company ${req.params.id}`
  });
}

// @desc    Create Companies
// @route   POST /api/v1/Companies/
// @access  Private
export async function createCompany(req, res, next) {
  try {
    const intrenship = await CompanyDB.create(req.body);
    res.status(201).json({
      success: true,
      data: intrenship
    });
  } catch (error) {
    onFail(res, error);
  }
}

// @desc    Update Companies
// @route   PUT /api/v1/Companies/:id
// @access  Private
export function updateCompany(req, res, next) {
  res.status(200).json({
    success: true,
    data: `update Company ${req.params.id}`
  });
}

// @desc    Delete Companies
// @route   DELETE /api/v1/Companies/:id
// @access  Private
export function deleteCompany(req, res, next) {
  res.status(200).json({
    success: true,
    data: `delete Company ${req.params.id}`
  });
}

function onFail(res, error) {
  console.log(error.message);
  res.status(400).json({
    success: false,
    error: error.message
  });
}
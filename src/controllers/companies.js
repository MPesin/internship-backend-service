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
export async function getCompany(req, res, next) {
  try {
    const company = await CompanyDB.findById(req.params.id);
    if (!company) {
      onFailCompany(res);
    } else {
      res.status(200).json({
        success: true,
        data: company
      });
    }
  } catch (error) {
    onFail(res, error);
  }
}

// @desc    Create Companies
// @route   POST /api/v1/Companies/
// @access  Private
export async function createCompany(req, res, next) {
  try {
    const company = await CompanyDB.create(req.body);
    res.status(201).json({
      success: true,
      data: company
    });
  } catch (error) {
    onFail(res, error);
  }
}

// @desc    Update Companies
// @route   PUT /api/v1/Companies/:id
// @access  Private
export async function updateCompany(req, res, next) {
  try {
    const company = await CompanyDB.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!company) {
      onFailCompany(res);
    } else {
      res.status(200).json({
        success: true,
        data: company
      });
    }
  } catch (error) {
    onFail(res, error);
  }
}

// @desc    Delete Companies
// @route   DELETE /api/v1/Companies/:id
// @access  Private
export async function deleteCompany(req, res, next) {
  try {
    const company = await CompanyDB.findByIdAndDelete(req.params.id);
    if (!company) {
      onFailCompany(res);
    } else {
      res.status(200).json({
        success: true,
        data: company
      });
    }
  } catch (error) {
    onFail(res, error);
  }
}

export function onFail(res, error) {
  console.log(error.message);
  res.status(400).json({
    success: false,
    error: error.message
  });
}

export function onFailCompany(res) {
  onFail(res, {
    message: 'company doesn\'t exist'
  });
}
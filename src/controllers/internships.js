import CompanyDB from "../models/company.js";
import {
  onFail,
} from './companies.js';

// @desc    Get all Internships
// @route   GET /api/v1/internships
// @access  Public
export async function getInternships(req, res, next) {
  try {
    const dataForRespond = [];
    await CompanyDB.find({}, (err, doc) => {
      if (!err) {
        doc.forEach(company => {
          dataForRespond.push({
            companyName: company.companyName,
            internships: company.internships
          });
        });
      }
    });
    res.status(200).json({
      success: true,
      data: dataForRespond
    });
  } catch (error) {
    onFail(res, error);
  }
}

// @desc    Get single Internship
// @route   GET /api/v1/internships/:id
// @access  Public
export async function getInternship(req, res, next) {
  try {
    const internship = (await findInternshipInDB(req.params.id)).internship;
    if (!internship) {
      onFailInternship(res);
    } else {
      res.status(200).json({
        success: true,
        data: internship
      });
    }
  } catch (error) {
    onFail(res, error);
  }
}


// @desc    Create single Internship
// @route   POST /api/v1/internships/
// @access  Private
export async function createInternship(req, res, next) {
  try {
    const companyName = req.body.companyName;
    const company = await CompanyDB.findOne({
      companyName: `${companyName}`
    });

    if (company) {
      const jobIdToAdd = req.body.internship.jobId;
      const queryJodIdResult = company.internships.filter(doc => doc.jobId === jobIdToAdd);

      if (!queryJodIdResult || queryJodIdResult.length === 0) {
        // push the new intrenship to the company.
        company.internships.push(req.body.internship);
        await company.save();
        res.status(201).json({
          success: true,
          data: company.internships.filter(internship => internship.jobId == jobIdToAdd)
        });
      } else {
        res.status(403).json({
          success: false,
          error: 'The jobId of the internship already exists in the database'
        });
      }
    } else {
      res.status(403).json({
        success: false,
        error: 'Company doesn\'t exist'
      });
    }
  } catch (error) {
    onFail(res, error);
  }
}

// @desc    Update single Internship
// @route   PUT /api/v1/internships/:id
// @access  Private
export async function updateInternship(req, res, next) {
  try {
    const result = await findInternshipInDB(req.params.id);
    const internship = result.internship;
    const company = result.company;
    if (internship && company) {
      internship.set(req.body);
      await company.save();
      res.status(200).json({
        success: true,
        data: company.internships.id(internship.id)
      });
    } else {
      onFailInternship(res);
    }
  } catch (error) {
    onFail(res, error);
  }
}

// @desc    Delete single Internship
// @route   DELETE /api/v1/internships/:id
// @access  Private
export async function deleteInternship(req, res, next) {
  try {
    const result = await findInternshipInDB(req.params.id);
    const internship = result.internship;
    const company = result.company;
    if (internship && company) {
      internship.remove();
      await company.save();
      res.status(200).json({
        success: true,
      });
    } else {
      onFailInternship(res);
    }
  } catch (error) {
    onFail(res, error);
  }
}

export function onFailInternship(res) {
  onFail(res, {
    message: 'internship doesn\'t exist'
  });
}

async function findInternshipInDB(id) {
  const companies = await CompanyDB.find();
  let internship = null;
  let company = null;
  companies.forEach(companyElement => {
    if (!internship) {
      internship = companyElement.internships.id(id);
      company = companyElement;
    }
  });
  return {
    company,
    internship
  };
}
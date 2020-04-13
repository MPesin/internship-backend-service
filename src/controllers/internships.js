import CompanyDB from "../models/company.js";

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
export function getInternship(req, res, next) {

  res.status(200).json({
    success: true,
    data: `get internship ${req.params.id}`
  });
}

// @desc    Create single Internship
// @route   POST /api/v1/internships/
// @access  Private
export async function createInternship(req, res, next) {
  try {
    const companyName = req.body.companyName;
    const company = await CompanyDB.find({
      companyName: `${companyName}`
    });

    if (company && company.length > 0) {
      const jobIdToAdd = req.body.internship.jobId;
      const queryJodIdResult = company[0].internships.filter(doc => doc.jobId === jobIdToAdd);
      console.log('queryJodIdResult', queryJodIdResult);
      console.log(!queryJodIdResult, queryJodIdResult.length === 0);

      if (!queryJodIdResult || queryJodIdResult.length === 0) {
        // push the new intrenship to the company.

        // res.status(201).json({
        //   success: true,
        //   data: intrenship
        // });
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
    console.log(error);

    onFail(res, error);
  }
}

// @desc    Update single Internship
// @route   PUT /api/v1/internships/:id
// @access  Private
export function updateInternship(req, res, next) {
  res.status(200).json({
    success: true,
    data: `update internship ${req.params.id}`
  });
}

// @desc    Delete single Internship
// @route   DELETE /api/v1/internships/:id
// @access  Private
export function deleteInternship(req, res, next) {
  res.status(200).json({
    success: true,
    data: `delete internship ${req.params.id}`
  });
}

function onFail(res, error) {
  console.log(error.message);
  res.status(400).json({
    success: false,
    error: error.message
  });
}
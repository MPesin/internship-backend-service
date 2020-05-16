import InternshipModel from '../models/internshipModel.js';
import CompanyModel from '../models/companyModel.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import geocoder from '../utils/geocoder.js';

/**
 * Get all Internships
 * @route   GET /api/v1/internships
 * @route   GET /api/v1/companies/:companyId/internships/
 * @access  Public
 */
export async function getInternships(req, res, next) {
  if (req.params.companyId) {
    const company = await CompanyModel.findById(req.params.companyId);

    if (!company) {
      return next(new ErrorResponse(`The company ${req.params.companyId} doesn't exist.`));
    }

    const result = await InternshipModel.find({
      company: req.params.companyId
    });

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });

  } else {
    res.status(200).json(req.handleRequest);
  }
}

/**
 * Get single Internship
 * @route   GET /api/v1/internships/:id
 * @access  Public
 */
export async function getInternship(req, res, next) {
  const internship = await InternshipModel.findById(req.params.id).populate({
    path: 'company',
    select: 'name'
  });

  if (!internship) {
    return next(
      new ErrorResponse(`internship id ${req.params.id} doesn\'t exist`, 404)
    );
  } else {
    res.status(200).json({
      success: true,
      data: internship
    });
  }
}

/**
 * Create single Internship
 * @route   POST /api/v1/companies/:companyId/internships/
 * @access  Private
 */
export async function createInternship(req, res, next) {

  const valid = await validateRequest(req, req.params.companyId);

  if (!valid.success) {
    return next(new ErrorResponse(valid.message, valid.status));
  }

  // set the company property of the internship
  req.body.company = req.params.companyId;

  const internship = await InternshipModel.create(req.body);

  res.status(201).json({
    success: true,
    data: internship
  });
}

/**
 * Update single Internship
 * @route   PUT /api/v1/internships/:id
 * @access  Private
 */
export async function updateInternship(req, res, next) {

  let internship = await InternshipModel.findById(req.params.id);
  const valid = await validateRequest(req, internship.company);

  if (!valid.success) {
    return next(new ErrorResponse(valid.message, valid.status));
  }

  internship = await InternshipModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!internship) {
    return next(new ErrorResponse(`internship id ${req.params.id} doesn't exist`, 404));
  } else {
    res.status(200).json({
      success: true,
      data: internship
    });
  }
}

/**
 * Delete single Internship
 * @route   DELETE /api/v1/internships/:id
 * @access  Private
 */
export async function deleteInternship(req, res, next) {

  let internship = await InternshipModel.findById(req.params.id);
  const valid = await validateRequest(req, internship.company);

  if (!valid.success) {
    return next(new ErrorResponse(valid.message, valid.status));
  }

  internship = await InternshipModel.findByIdAndDelete(req.params.id);

  if (!internship) {
    return next(new ErrorResponse(`internship id ${req.params.id} doesn't exist`, 404));
  } else {
    res.status(200).json({
      success: true,
      data: internship
    });
  }
}

/**
 * Get internships inside a radius. 
 * Radius can be in kilometers (`km`) or miles (`mi`).
 * @route   GET /api/v1/internships/raduis/:address/:distance/:unit
 * @access  Private
 */
export async function getInternshipsInRadius(req, res, next) {
  const {
    address,
    distance,
    unit
  } = req.params;

  // get longtitude and lantitude 
  const geoDetails = await geocoder.geocode(address);

  const lat = geoDetails[0].latitude;
  const long = geoDetails[0].longitude;

  // calculate radius in RAD 
  const unitLowerCase = unit.toLowerCase();
  let radius;
  if (unitLowerCase === 'mi') { // if unit is `mi` use miles
    radius = distance / process.env.EARTH_RADIUS_MI;
  } else if (unitLowerCase === 'km') {
    radius = distance / process.env.EARTH_RADIUS_KM; // default is KM
  } else {
    return next(new ErrorResponse('unit is not legal', 400));
  }

  const nearbyInternships = await InternshipModel.find({
    'geoPosition': {
      $geoWithin: {
        $centerSphere: [
          [long, lat], radius
        ]
      }
    }
  });

  res.status(200).json({
    success: true,
    count: nearbyInternships.length,
    data: nearbyInternships
  });
}


async function validateRequest(req, companyId) {
  const response = {
    success: true,
    message: '',
    status: 200
  };
  const company = await CompanyModel.findById(companyId);

  if (company == undefined) {
    response.success = false;
    response.message = `The company ${req.params.companyId} doesn't exist.`;
    response.status = 404;
  } else {
    const recruiters = company.recruiters;
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userId != company.admin &&
      (recruiters.length !== 0 && !recruiters.includes(userId)) &&
      userRole !== 'admin') {
      response.success = false;
      response.message = `Not authorized to access this route.`;
      response.status = 401;
    }
  }

  return response;
}
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
  let query;
  if (req.params.companyId) {
    if (!companyExists(req.params.companyId)) {
      return next(new ErrorResponse(`The company ${req.params.companyId} doesn't exist.`));
    }
    query = InternshipModel.find({
      company: req.params.companyId
    });
  } else {
    query = InternshipModel.find();
  }
  query.populate({
    path: 'company',
    select: 'name website phone email'
  });
  const result = await query;

  res.status(200).json({
    success: true,
    count: result.length,
    data: result
  });
  // res.status(200).json(req.handleRequest);
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
  console.log(req.params.companyId);

  if (!companyExists(req.params.companyId)) {
    return next(new ErrorResponse(`The company ${req.params.companyId} doesn't exist.`));
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
  const internship = await InternshipModel.findByIdAndUpdate(req.params.id, req.body, {
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
  const internship = await InternshipModel.findByIdAndDelete(req.params.id);
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


function companyExists(id) {
  const company = CompanyModel.findById(id);
  return (company != undefined);
}
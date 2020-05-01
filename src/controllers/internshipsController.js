import InternshipModel from '../models/internshipModel.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import geocoder from '../utils/geocoder.js';

/**
 * Get all Internships
 * @route   GET /api/v1/internships
 * @access  Public
 */
export async function getInternships(req, res, next) {

  let query;
  if (req.params.companyId) {
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
  const result = await findInternshipInDB(req.params.id);
  if (!result) {
    return next(
      new ErrorResponse(`internship id ${req.params.id} doesn\'t exist`, 404)
    );
  } else {
    res.status(200).json({
      success: true,
      data: result.internship
    });
  }
}

/**
 * Create single Internship
 * @route   POST /api/v1/internships/
 * @access  Private
 */
export async function createInternship(req, res, next) {
  const internship = req.body;
  const company = await InternshipModel.findOne({
    name: `${internship.name}`
  });

  if (company) {
    const jobIdToAdd = internship.jobId;
    company.internships.push(req.body.internship);
    await company.save();
    res.status(201).json({
      success: true,
      data: company.internships.filter(internship => internship.jobId == jobIdToAdd)
    });
  } else {
    return next(new ErrorResponse('Company doesn\'t exist', 403));
  }
}

/**
 * Update single Internship
 * @route   PUT /api/v1/internships/:id
 * @access  Private
 */
export async function updateInternship(req, res, next) {
  const result = await findInternshipInDB(req.params.id);
  if (result) {
    const internship = result.internship;
    const company = result.company;
    internship.set(req.body);
    await company.save();
    res.status(200).json({
      success: true,
      data: company.internships.id(internship.id)
    });
  } else {
    return next(new ErrorResponse(`internship id ${req.params.id} doesn\'t exist`, 404));
  }
}

/**
 * Delete single Internship
 * @route   DELETE /api/v1/internships/:id
 * @access  Private
 */
export async function deleteInternship(req, res, next) {
  const result = await findInternshipInDB(req.params.id);
  if (result) {
    const internship = result.internship;
    const company = result.company;
    internship.remove();
    await company.save();
    res.status(200).json({
      success: true
    });
  } else {
    return next(new ErrorResponse('internship doesn\'t exist', 400));
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
  let raduis;
  if (unitLowerCase === 'mi') { // if unit is `mi` use miles
    raduis = distance / process.env.EARTH_RADIUS_MI;
  } else if (unitLowerCase === 'km') {
    raduis = distance / process.env.EARTH_RADIUS_KM; // default is KM
  } else {
    return next(new ErrorResponse('unit is not legal', 400));
  }

  const nearbyInternships = await InternshipModel.find({
    'internships.geoPosition': {
      $geoWithin: {
        $centerSphere: [
          [long, lat], raduis
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
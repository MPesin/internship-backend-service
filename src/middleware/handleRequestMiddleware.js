export default function handleRequestMiddleware(model, populate) {
  return async (req, res, next) => {

    const queryFiltered = filterQuery(req.query);

    const query = model.find(queryFiltered.query);

    if (queryFiltered !== '') {
      query.select(queryFiltered.select);
    }

    query.sort(queryFiltered.sort);

    // pagination
    const limit = queryFiltered.limit;
    const page = queryFiltered.page;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    const pagination = {};

    query.skip(startIndex).limit(limit);

    if (populate) {
      query.populate(populate);
    }

    const results = await query;

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

    req.handleRequest = {
      success: true,
      count: results.length,
      pagination,
      data: results
    }

    next();
  };
}

/**
 * Filter the query from the request to the server.
 * @param {object} query the query property of the request sent to the server.
 * @returns { { query: object, select: string, sort: string, page: int, limit: int } } an object with all the properties of the 'query'.
 */
function filterQuery(query) {
  // fields to remove from the query before filtering with regex
  const removeFields = ['select', 'sort', 'page', 'limit'];

  // get query and make a copy
  let reqQuery = {
    ...query
  };

  // remove properties that shouldn't be filtered
  removeFields.forEach(field => delete reqQuery[field]);

  // filter query
  let queryString = JSON.stringify(reqQuery);

  // add `$` before gt, gte, lt, lte or in
  queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  // parse the query back to an object
  const queryFiltered = JSON.parse(queryString);

  // if `select` exists parse it and create a string for the query
  const querySelect = query.select;
  let selected = [];
  if (querySelect) {
    selected = querySelect.split(',');
  }

  const selectedString = selected.join(' ');

  // handle sorting
  let sort = '';
  if (query.sort) {
    sort = query.sort.split(',').join(' ');
  } else {
    sort = '-createdAt';
  }

  const page = parseInt(query.page || process.env.DEFAULT_PAGE, 10);
  const limit = parseInt(query.limit || process.env.DEFAULT_LIMIT, 10);

  return {
    query: queryFiltered,
    select: selectedString,
    sort,
    page,
    limit
  }
}
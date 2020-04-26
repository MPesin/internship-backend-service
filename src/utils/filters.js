/**
 * Filter the query from the request to the server.
 * @param {object} query the query property of the request sent to the server.
 * @param {string} [subdocument=''] to return a query for a specific subdocument.
 * @returns { { query: object, select: string } } an object with the properties 'query' - which is the query object, and 'selected' which is a string of the fields to select from the query seperated by `space`.
 */
export function filterQuery(query, subdocument = '') {
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

  // if the prefix isn't empty add it to the query fields 
  if (subdocument !== '') {
    queryString = queryString.replace(/(?<=(^{|,)")\b(\w+)\b/g, match => `${subdocument}.${match}`);
  }

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

  // if prefix exists add it to the selected
  if (subdocument !== '') {
    if (selected.length > 0) {
      selected.forEach((field, index) => selected[index] = `${subdocument}.${field}`);
    } else {
      selected.push(subdocument);
    }
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
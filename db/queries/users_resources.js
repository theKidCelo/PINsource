//---------------USERS--------------------//
//Get a single user from the database given their email
const getUserWithEmail = function(db, email) {
  let queryString = ``;
  let queryParams = [];
  queryParams.push(email);
  return db
    .query(queryString, queryParams)
    .then(res => {
      return res.rows[0];
    })
    .catch(err => {
      console.error("query error", err.stack);
    });
};
exports.getUserWithEmail = getUserWithEmail;
//Get a single user from the database given their id
const getUserWithId = function(db, userId) {
  let queryString = `
    SELECT *
    FROM users
    WHERE users.id = $1; `;
  let queryParams = [];
  queryParams.push(userId);
  return db
    .query(queryString, queryParams)
    .then(res => {
      console.log(res.rows[0]);
      return res.rows[0];
    })
    .catch(err => {
      console.error("query error", err.stack);
    });
};
exports.getUserWithId = getUserWithId;

//edit current user profile
const updateUserWithId = function(db, newUserParams) {
  let queryParams = [];
  let queryString = `
    UPDATE users `;
  if (newUserParams.username) {
    queryParams.push(`${newUserParams.username}`);
    queryString += `SET username = $${queryParams.length} `;
  }
  if (newUserParams.email) {
    queryParams.push(`${newUserParams.email}`);
    if (queryParams.length > 1) {
      queryString += `, email = $${queryParams.length} `;
    } else {
      queryString += `SET email = $${queryParams.length} `;
    }
  }
  if (newUserParams.password) {
    queryParams.push(`${newUserParams.password}`);
    if (queryParams.length > 1) {
      queryString += `, password = $${queryParams.length} `;
    } else {
      queryString += `SET password = $${queryParams.length} `;
    }
  }
  if (newUserParams.profile_pic) {
    queryParams.push(`${newUserParams.profile_pic}`);
    if (queryParams.length > 1) {
      queryString += `, profile_pic = $${queryParams.length} `;
    } else {
      queryString += `SET profile_pic = $${queryParams.length} `;
    }
  }
  queryParams.push(newUserParams.userId);
  queryString += `WHERE users.id = $${queryParams.length} RETURNING *`;
  console.log(queryString);
  console.log(queryParams);
  return db
    .query(queryString, queryParams)
    .then(res => {
      console.log(res);
      return res.rows[0];
    })
    .catch(err => {
      console.error("query error", err.stack);
    });
};
exports.updateUserWithId = updateUserWithId;

//Add a new user to the database
const addUser = function(db, newUserParams) {
  let queryParams = [
    newUserParams.username,
    newUserParams.email,
    newUserParams.password
  ];

  let queryString = `
    INSERT INTO users
    (username, email, password, profile_pic)
    VALUES ($1, $2, $3, $4)
    RETURNING *`;

  if (newUserParams.profile_pic) {
    queryParams.push(newUserParams.profile_pic);
  } else {
    queryParams.push(null);
  }

  return db
    .query(queryString, queryParams)
    .then(res => {
      return res.rows[0];
    })
    .catch(err => {
      console.error("query error", err.stack);
    });
};
exports.addUser = addUser;

///--------------------------resources-----------------------------------//
//get all resources depending on the options
const getAllResources = function(db, options, limit = 20) {
  console.log(options);
  const queryParams = [];
  let queryString = `
    SELECT DISTINCT *
    FROM resources
    LEFT OUTER JOIN resource_ratings ON ratings.resource_id = resources.id
    LEFT OUTER JOIN liked_resources ON liked_resources.resource_id = resources.id `;

  if (options.category_id) {
    queryParams.push(options.category_id);
    queryString += `WHERE resources.category_id = $${queryParams.length} `;
  }

  if (options.keyword) {
    queryParams.push(`%${options.keyword.toUpperCase()}%`);

    if (queryParams.length > 1) {
      queryString += `AND upper(title) LIKE $${queryParams.length} `;
    } else {
      queryString += `WHERE upper(title) LIKE $${queryParams.length} `;
    }
  }

  queryString += `
    GROUP BY resources.id, resource_ratings.id, liked_resources.id
  `;
  if (options.ratings) {
    queryParams.push(`${options.ratings}`);
    queryString += `HAVING avg(resource_ratings.rating) >= $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += `LIMIT $${queryParams.length}`;
  console.log(queryString, queryParams);

  return db
    .query(queryString, queryParams)
    .then(res => res.rows)
    .catch(err => {
      console.error("query error", err.stack);
    });
};
exports.getAllResources = getAllResources;

//add new resource
const addResource = function(db, resources) {
  let queryString = `
  SELECT DISTINCT *
    FROM resources
    LEFT OUTER JOIN ratings ON ratings.resource_id = resources.id
    LEFT OUTER JOIN likes ON likes.resource_id = resources.id `;
  const queryParams = [];

  return db
    .query(queryString, queryParams)
    .then(res => res.rows[0])
    .catch(err => {
      console.error("query error", err.stack);
    });
};
exports.addResource = addResource;

//delete resource
const deleteResource = function(db, resourceId) {
  let queryParams = [resourceId];
  let queryString = `
    UPDATE resources
    SET is_active = false
    WHERE resources.id = $1
    RETURNING * `;
  // console.log(queryString, queryParams);
  return db
    .query(queryString, queryParams)
    .then(res => res.rows[0])
    .catch(err => {
      console.error("query error", err.stack);
    });
};
exports.deleteResource = deleteResource;

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
    SELECT DISTINCT resources.*, COUNT(liked_resources.resource_id) as number_of_likes, ROUND(AVG(ratings.rating),2) as average_rating
    FROM resources
    LEFT OUTER JOIN liked_resources ON liked_resources.resource_id = resources.id
    LEFT OUTER JOIN resource_ratings ON resource_ratings.resource_id = resources.id `;

  if (options.userId) {
    queryParams.push(options.userId);
    queryString += `WHERE (liked_resources.user_id = $${queryParams.length} OR resources.user_id = $${queryParams.length}) `;
  }

  if (options.category_id) {
    queryParams.push(`${options.category_id}`);

    if (queryParams.length > 1) {
      queryString += `AND resources.category_id = $${queryParams.length} `;
    } else {
      queryString += `WHERE resources.category_id = $${queryParams.length} `;
    }
  }

  if (options.keyword) {
    queryParams.push(`%${options.keyword.toUpperCase()}%`);

    if (queryParams.length > 1) {
      queryString += `AND (upper(resources.title) LIKE $${queryParams.length} OR upper(resources.description) LIKE $${queryParams.length}) `;
    } else {
      queryString += `WHERE (upper(resources.title) LIKE $${queryParams.length} OR upper(resources.description) LIKE $${queryParams.length}) `;
    }
  }

  queryString += `
    GROUP BY resources.id
  `;

  if (options.rating) {
    queryParams.push(`${options.rating}`);
    queryString += `HAVING avg(resource_ratings.rating) >= $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += `
    ORDER BY number_of_likes DESC, resources.id
    LIMIT $${queryParams.length};
  `;

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

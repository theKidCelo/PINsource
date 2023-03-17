const bcrypt = require("bcrypt");

//---------------USERS--------------------//
//Get a single user from the database given their email
const getUserWithEmail = function(db, loginInput) {
  let queryParams = [loginInput.email];
  let queryString = `
    SELECT *
    FROM users
    WHERE users.email = $1 `;

  return db
    .query(queryString, queryParams)
    .then(res => {
      if (bcrypt.compareSync(loginInput.password, res.rows[0].password)) {
        return res.rows[0];
      } else {
        console.log("goes here");
        return ""; //wrong password
      }
    })
    .catch(err => {
      console.error("query error", err.stack);
    });
};
exports.getUserWithEmail = getUserWithEmail;

//Get a single user from the database given their id
const getUserWithId = function(db, userId) {
  let queryParams = [userId];
  let queryString = `
    SELECT *
    FROM users
    WHERE users.id = $1; `;
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
    bcrypt.hashSync(newUserParams.password, 10)
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
  const queryParams = [];
  let queryString = `
    SELECT resources.*, users.username as username, users.profile_pic as user_profile_pic, count(liked_resources.resource_id) as number_of_likes, average_rating
    FROM resources
    LEFT OUTER JOIN liked_resources ON liked_resources.resource_id = resources.id
    LEFT OUTER JOIN users ON resources.user_id = users.id
    LEFT OUTER JOIN categories ON resources.category_id = categories.id
    LEFT OUTER JOIN (SELECT resource_id, round(avg(resource_ratings.rating), 2) as average_rating
              FROM resource_ratings
              GROUP BY resource_id
              ORDER BY resource_id) as average_ratings ON resources.id = average_ratings.resource_id
`;

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
    GROUP BY resources.id, average_ratings.average_rating, users.username, users.profile_pic
  `;

  if (options.rating) {
    queryParams.push(`${options.rating}`);
    queryString += `HAVING average_rating >= $${queryParams.length}`;
  }

  queryParams.push(limit);
  queryString += `
    ORDER BY number_of_likes DESC, resources.id
    LIMIT $${queryParams.length};
  `;

  return db
    .query(queryString, queryParams)
    .then(res => res.rows)
    .catch(err => {
      console.error("query error", err.stack);
    });
};
exports.getAllResources = getAllResources;

const getAverageRatings = function(db) {
  const queryParams = [];
  let queryString = `
  `;
};
exports.getAverageRatings = getAverageRatings;

////get resource from resource_id
const getResourceFromId = function(db, resource_id) {
  const queryParams = [resource_id];
  let queryString = `
    SELECT resources.*, users.username as username, users.profile_pic as user_profile_pic, count(liked_resources.resource_id) as number_of_likes, average_rating
    FROM resources
    LEFT OUTER JOIN liked_resources ON liked_resources.resource_id = resources.id
    LEFT OUTER JOIN ratings ON resource_ratings.resource_id = resources.id
    LEFT OUTER JOIN users ON resources.user_id = users.id
    LEFT OUTER JOIN (SELECT resource_id, round(avg(resource_ratings.rating), 2) as average_rating
                FROM resource_ratings
                GROUP BY resource_id
                ORDER BY resource_id) as average_ratings ON resources.id = average_ratings.resource_id
    WHERE resources.id = $${queryParams.length}
    GROUP BY resources.id, average_ratings.average_rating, users.username, users.profile_pic;
  `;

  return db
    .query(queryString, queryParams)
    .then(res => res.rows)
    .catch(err => {
      console.error("query error", err.stack);
    });
};
exports.getResourceFromId = getResourceFromId;

//add new resource
const addResource = function(db, newResourceParams) {
  const queryParams = [
    newResourceParams.user_id,
    newResourceParams.category_id,
    newResourceParams.title,
    newResourceParams.url,
  ];
  let queryString = `
    INSERT INTO resources
      (user_id, category_id, title, url, description)
    VALUES($1, $2, $3, $4, $5) `;

  if (newResourceParams.description) {
    queryParams.push(newResourceParams.description);
  } else {
    queryParams.push(null);
  }

  queryString += `RETURNING *`;

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

//add a new like
const addLike = function(db, likeParams) {
  const queryParams = [likeParams.user_id, likeParams.resource_id];
  // let queryString = `
  //   INSERT INTO liked_resources (user_id, resource_id)
  //   VALUES ($1, $2)
  //   RETURNING (SELECT count(liked_resources.resource_id)
  //         FROM liked_resources
  //         GROUP BY resource_id
  //         HAVING resource_id = $2)`;

  let queryString = `
    INSERT INTO liked_resources (user_id, resource_id)
    VALUES ($1, $2)
    `;

  return db
    .query(queryString, queryParams)
    .then(res => res.rows[0])
    .catch(err => {
      console.error("query error", err.stack);
    });
};
exports.addLike = addLike;

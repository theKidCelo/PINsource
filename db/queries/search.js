const db = require('../connection');

const getData = ({ rows }) => rows;
// const getFirstRecord = (result) => getData(result)[0];

const searchResources = (user_id, query) => {
  const value = [user_id, "%" + query + "%"];
  // return db.query('SELECT * FROM resources WHERE title OR description OR URL ILIKE ', [`%${req.query.q}%`], (err1, result))
  //   .then(data => {
  //     console.log('data is back!', data.rows);
  //     return data.rows;
  //   });

  const queryString = `
    SELECT *
    FROM resources
    JOIN categories ON categories.id = category_id
    JOIN users ON users.id = resources.user_id
    LEFT JOIN comments ON resources.id = comments.resource_id
    LEFT JOIN resource_ratings ON resource_ratings.resource_id = resources.id
    GROUP BY resources.id, categories.id
    `;
  try {
    const result = db.query(queryString, value);
    const data = getData(result);

    return data;
  } catch (err) {
    console.log(err);
  }
};

module.exports = { searchResources };

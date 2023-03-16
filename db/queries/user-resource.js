const db = require('../connection');

const getResources = () => {
  return db.query('SELECT * FROM resources')
    .then(data => {
      console.log('data is back!', data.rows);
      return data.rows;
    });
};

module.exports = { getResources };

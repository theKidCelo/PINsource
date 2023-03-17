const db = require('../connection');

const getUsers = (req,res) => {
  return db.query('SELECT * FROM users;')
    .then(data => {
      return data.rows;
    });
};


const getUserByEmail = (email) => {
  console.log('email', email);


  return db.query('SELECT * FROM users WHERE email = $1;', [email])
    .then(data => {
      return data.rows[0];
    });
};

const addUser = (user) => {
  // Your implementation for adding a new user.
  return db.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [user.email, user.password]);
}

module.exports = { getUsers, getUserByEmail, addUser };

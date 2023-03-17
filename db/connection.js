// PG database client/connection setup
const { Pool } = require('pg');

const dbParams = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};

const db = new Pool(dbParams);

db.query(" CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, creation_date DATE NOT NULL DEFAULT CURRENT_DATE)",(err,res)=>{
  console.log(err,res)
  // db.end()
})

db.connect();

module.exports = db;
 
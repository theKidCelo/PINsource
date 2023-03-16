// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const dbHelperFunctions = require("./db/queries/users_resources");
const auth = require("./middleware/auth");


const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(
  '/styles',
  sassMiddleware({
    source: __dirname + '/styles',
    destination: __dirname + '/public/styles',
    isSass: false, // false => scss, true => sass
  })
);
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['key1'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

const { Pool } = require("pg");
const dbParams = require("./db/connection");
const db = new Pool(dbParams);
db.connect();

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require('./routes/users');
const resourceRoutes = require('./routes/resources');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', usersRoutes(db));
app.use('/api/resources', resourceRoutes(db));

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', auth, (req, res) => {
  // const userId = req.session.userId;
  // if (!userId) {
  //   res.redirect("/login");
  // }
  // const options = {};

//   dbHelperFunctions.getAllResources(db, options, 60).then(data => {
//     res.render("index", { data });
//     res.status(200);
//   });
// });

  dbHelperFunctions.getAllResources(db, 60).then(data => {
    data.push(res.locals.user);
    res.render("index", { data });
    res.status(200);
  });
});

app.listen(PORT, () => {
  console.log(`PINsource listening on port ${PORT}`);
});

// load .env data into process.env
require('dotenv').config();

// Web server config
const sassMiddleware = require('./lib/sass-middleware');
const express = require('express');
const morgan = require('morgan');
const userQueries = require('./db/queries/users');

//Client
// const db = require('.db/connection.js')


const bcrypt = require('bcrypt');
const saltRounds = 10;

//Body Parser
const bodyParser = require('body-parser')

const PORT = process.env.PORT || 8080;
// const PORT = 8080;

const app = express();

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(bodyParser.json());
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

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require('./routes/users-api');
const widgetApiRoutes = require('./routes/widgets-api');
const usersRoutes = require('./routes/users');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
app.use('/api/widgets', widgetApiRoutes);
app.use('/users', usersRoutes);


// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.render('index');
});

// Login get route
app.get('/login', (req, res) => {
  res.render('login');
});

//Login post route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)

  userQueries.getUserbyEmail(email)
    .then(user => {

      console.log(user)
      if (!user) {
        return res.status(403).json({ error: 'Invalid email or password' });
      }

      // if (user.password !== password) {
      //   return res.status(403).json({ error: 'Invalid email or password' });
      // }

      bcrypt.compare(password, user.password).then(validPass => {
        if(validPass==true)
        {
          // res.send("Is a user")
          res.redirect("/register")
        }else{
          res.send("Is not a user")
        }
          }).catch(err => console.log('error: ' + err));

      // // res.json({ user });
      // req.session.userID = currentAccount.id;
      // res.redirect("/");
    })
    .catch(err => {
      res
        .status(500)
        .json({ error: err.message });
    });


});

app.get('/register', (req, res) => {
  res.render('register');
});


app.post('/register', (req, res) => {
  const { email, password } = req.body;
  console.log(req.body)

  userQueries.getUserByEmail(email)
    .then(user => {
      if (user) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Debugging: check password and saltRounds values
      console.log('Password:', password);
      console.log('Salt Rounds:', saltRounds);

      // Hash the password
      bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }

        // Save the new user
        userQueries.addUser({
          email,
          password: hashedPassword

        })
          .then(user => {
            res.render('index')
            // res.json({ user });
          })
          .catch(err => {
            res.status(500).json({ error: err.message });
          });
      });
    })
    .catch(err => {
      res.status(500).json({ error: err.message });
    });
});



// edit route
app.get('/edit', (req, res) => {
  res.render('edit');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

const { Pool } = require("pg");
const dbParams = require("../lib/dbParams.js");
const db = new Pool(dbParams);
db.connect();
const dbHelperFunctions = require("../db/queries/users_resources");

module.exports = (req, res, next) => {
  dbHelperFunctions
    .getUserWithId(db, req.session.userId)
    .then(user => {
      console.log("user_is: ", user);
      if (!user) {
        res.render("login");
      }
      console.log(user);
      res.locals.user = {};
      res.locals.user.id = user.id;
      res.locals.user.name = user.name;
      // res.locals.user = user.id;
      // res.locals.userName = user.username;
      res.locals.user = user.id;
      next();
    })
    .catch(next);
};

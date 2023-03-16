const { Pool } = require("pg");
const dbParams = require("../lib/dbParams.js");
const db = new Pool(dbParams);
db.connect();
const dbHelperFunctions = require("../db/queries/users_resources");

module.exports = (req, res, next) => {
  dbHelperFunctions
    .getUserWithId(db, req.session.userId)
    .then(user => {
      if (!user) {
        res.render("login");
      }
      console.log(user);
      res.locals.user = user.id;
      next();
    })
    .catch(next);
};

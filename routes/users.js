/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
const express = require("express");
const router = express.Router();
const dbHelperFunctions = require("../db/queries/users_resources");
const moment = require("moment");
const auth = require("../lib/auth-middleware");

module.exports = db => {

//----------------------login----------------------------//

  router.get("/api/users/login", (req, res) => {
    //if they are already signed in
    if (req.session.userId) {
      res.redirect("/");
      return;
    }
    res.render("login");
  });

  router.get("api/users/logout", (req, res) => {
    req.session.userId = null;
    res.redirect("login");
  });

  router.post("/api/users/login", (req, res) => {
    const loginInput = req.body;
    dbHelperFunctions
      .getUserWithEmail(db, loginInput)
      .then(userInfo => {
        if (userInfo) {
          req.session.userId = userInfo.id;
          res.redirect("/");
        } else {
          res.status(404).render("register");
        }
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });

  //---------------------user profile-------------------------//

  router.get("/me", auth, (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      res.redirect("/api/users/login");
      return;
    }

    dbHelperFunctions.getUserWithId(db, userId).then(user => {
      user.created_at = moment(user.created_at).format(
        "dddd, MMMM Do YYYY, h:mm:ss a"
      );
      res.render("usersProfile", { user });
    });
  });

  router.post("/me", auth, (req, res) => {
    if (!req.body.name && !req.body.email && !req.body.password) {
      res.redirect("me");
    } else {
      const { ...newUserParams } = req.body;
      newUserParams.userId = req.session.userId;

      dbHelperFunctions.updateUserWithId(db, newUserParams).then(user => {
        res.render("usersProfile", { user });
      });
    }
  });

  //---------------------new user-------------------------//

  router.get("/api/users/register", (req, res) => {
    if (req.session.userId) {
      res.redirect("/");
    }
    res.render("register");
  });

  router.post("/api/users/register", (req, res) => {
    const newUserParams = req.body;
    dbHelperFunctions.addUser(db, newUserParams).then(user => {
      req.session.userId = user.id;
      res.redirect("/");
    });
  });

  return router;
};

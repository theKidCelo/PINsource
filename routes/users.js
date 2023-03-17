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

module.exports = db => {
  // router.get("/", (req, res) => {
  //   db.query(`SELECT * FROM users;`)
  //     .then(data => {
  //       const users = data.rows;
  //       res.json({ users });
  //     })
  //     .catch(err => {
  //       res.status(500).json({ error: err.message });
  //     });
  // });
  router.get("/login", (req, res) => {
    //if user already logged in
    if (req.session.userId) {
      res.redirect("/");
      return;
    }
    res.render("login");
  });

  router.post("/login", (req, res) => {
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

  router.get("/logout", (req, res) => {
    req.session.userId = null;
    res.redirect("/login");
  });

  //-------------User Profile page------------------//
  router.get("/me", (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      res.redirect("/login");
      return;
    }

    dbHelperFunctions.getUserWithId(db, userId).then(user => {
      user.creationDate = moment(user.creation_date).format(
        "dddd, MMMM Do YYYY, h:mm:ss a"
      );
      res.render("usersProfile", { user });
    });
  });

  router.post("/me", (req, res) => {
    if (!req.body.username && !req.body.email && !req.body.password) {
      res.redirect("me");
    } else {
      const { ...newUserParams } = req.body;
      newUserParams.userId = req.session.userId;

      dbHelperFunctions.updateUserWithId(db, newUserParams).then(user => {
        res.render("usersProfile", {user});
      });
    }
  });

  //-------------New User---------------------//
  router.get("/create-account", (req, res) => {
    if (req.session.userId) {
      res.redirect("/");
    }

    res.render("register");
  });

  router.post("/new", (req, res) => {
    const newUserParams = req.body;

    dbHelperFunctions.addUser(db, newUserParams).then(user => {
      req.session.userId = user.id;
      res.redirect("/");
    });
  });
  return router;
};

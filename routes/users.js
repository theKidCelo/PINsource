/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */
const express = require("express");
const router = express.Router();

const dbHelperFunctions = require("../db/queries/users_resources");

module.exports = db => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
      .then(data => {
        const users = data.rows;
        res.json({ users });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  router.get("/login/:id", (req, res) => {
    req.session.userId = req.params.id;
    res.redirect("/");
  });
  router.get("/logout", (req, res) => {
    req.session.userId = null;
    res.redirect("/");
  });

  //-------------User Profile page------------------//
  router.get("/me", (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      res.send({ message: "not logged in" });
      return;
    }

    dbHelperFunctions.getUserWithId(db, userId).then(user => {
      console.log(user);
      res.render("usersProfile", user);
    });
  });

  router.post("/me", (req, res) => {
    const { ...newParams } = req.body;
    newParams.userId = req.session.userId;

    dbHelperFunctions.updateUserWithId(db, newUserParams).then(user => {
      res.json(user);
      console.log(user);
      // res.render("usersProfile", user);
    });

    // res.status(200);
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

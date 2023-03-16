/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into /users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = db => {
  router.get("/", (req, res) => {
    console.log(req);
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

  router.get("/me", (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      res.send({ message: "not logged in" });
      return;
    }

    //function to query database to get user info
    res.json(userId);
  });

  router.post("/new", (req, res) => {
    const user = req.body;
    //function to insert user into database
  });

  return router;
};

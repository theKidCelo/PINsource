const dbHelperFunctions = require("../db/queries/users_resources");

const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get("/", (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
      res.redirect("/");
    }
    const options = req.body;
    dbHelperFunctions.getAllResources(db, options, 20).then(data => {
      console.log(data);
      res.render("index", { data });
      res.status(200);
    });
  });
  return router;
};

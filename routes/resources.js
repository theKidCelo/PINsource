const dbHelperFunctions = require("../db/queries/users_resources");

const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get("/", (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
      res.redirect("/");
    }
    // const options = req.body;
    // console.log(options);
    dbHelperFunctions.getAllResources(db, null, 2).then(data => {
      console.log("show me the data! ", data);
      res.render("index", { data });
      res.status(200);
    });
  });
  return router;
};

const dbHelperFunctions = require("../db/queries/users_resources");

const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get("/", (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
      res.redirect("/");
    }
    const options = req.query;
    console.log(options);
    dbHelperFunctions.getAllResources(db, options).then(data => {
      console.log("show me the data!", data);
      res.render("index", { data });
      res.status(200);
    });
  });

  router.post("/add-resource", (req, res) => {
    // console.log(req.body);

    const { ...newResourceParams } = req.body;
    newResourceParams.user_id = req.session.userId;
    dbHelperFunctions.addResource(db, newResourceParams).then(data => {
      console.log("show me the data!", data);
      res.redirect("index", { data });
      res.status(200);
    });
  });

  router.post("/delete/:id", (req, res) => {
    dbHelperFunctions.deleteResource(db, req.params.id).then(data => {
      console.log("show me data! ", data);
      res.redirect("index", { data });
      res.status(200);
    });
  });
  return router;
};

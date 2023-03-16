const dbHelperFunctions = require("../db/queries/users_resources");

const express = require("express");
const router = express.Router();

module.exports = db => {
  router.get("/", (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
      res.redirect("/login");
    }
    let options = req.query;

    dbHelperFunctions.getAllResources(db, options, 60).then(data => {
      const userId = res.locals.user;
      res.render("index", { data, userId });
      // res.render("index", { data });
      res.status(200);
    });
  });

  //// Getting to the creation page
  router.get("/add-resource", (req, res) => {
    if (req.session.userId) {
      res.render("resource_new");
    }
  });

  router.get("/my-resources", (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
      res.redirect("/login");
    }

    let options = {};
    options.userId = userId;

    dbHelperFunctions.getAllResources(db, options, 60).then(data => {
      const userId = res.locals.user;
      res.render("index", { data, userId });
      // res.render("index", { data });
      res.status(200);
    });
  });

  //add new resource
  router.get("/add-resource", (req, res) => {
    if (req.session.userId) {
      res.render("resource_new");
    }
  });

  router.post("/add-resource", (req, res) => {
    console.log(req.body);

    const { ...newResourceParams } = req.body;
    newResourceParams.user_id = req.session.userId;
    dbHelperFunctions.addResource(db, newResourceParams).then(data => {
      console.log("show me the data!", data);
      res.redirect("/");
      res.status(200);
    });
  });

  router.post("/delete/:id", (req, res) => {
    dbHelperFunctions.deleteResource(db, req.params.id).then(data => {
      console.log("show me data! ", data);
      res.redirect("/");
      res.status(200);
    });
  });
  return router;
};

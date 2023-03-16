const dbHelperFunctions = require("../db/queries/users_resources");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

module.exports = db => {
  router.get("/", auth, (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
      res.redirect("/api/users/login");
    }
    let options = req.query;

    dbHelperFunctions.getAllResources(db, options, 60).then(data => {
      data.push(res.locals.user);
      console.log(data);
      res.render("index", { data });
      res.status(200);
    });
  });

  router.get("/my-resources", auth, (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
      res.redirect("/api/users/login");
    }
    let options = {};
    options.userId = userId;

    dbHelperFunctions.getAllResources(db, options, 60).then(data => {
      data.push(res.locals.user);
      res.render("index", { data });
      res.status(200);
    });
  });

  //// Getting to the creation page
  router.get("/add-resource", auth, (req, res) => {
    if (req.session.userId) {
      res.render("resource_new");
    } else {
      res.redirect("/api/users/login");
    }
  });

  //// Submit a new resource
  router.post("/add-resource", auth, (req, res) => {
    console.log(req.body);
    // if (req.session.userId) then allow else send 403

    const { ...newResourceParams } = req.body;
    newResourceParams.user_id = req.session.userId;
    dbHelperFunctions.addResource(db, newResourceParams).then(data => {
      console.log("im the data ", data);
      // res.redirect("index", { data });         ///this redirect is not working
      res.redirect("/api/resources");
      res.status(200);
    });
  });

  //// 'Delete' an existing resource
  router.post("/delete/:id", auth, (req, res) => {
    //this alongside some other endpoints needs to be changed using method override to satisfy the RESTful convention

    // if req.session.userId !== user_id then send back 403
    dbHelperFunctions.deleteResource(db, req.params.id).then(data => {
      console.log("im the data ", data);
      res.redirect("/");
      res.status(200);
    });
  });
  return router;
};

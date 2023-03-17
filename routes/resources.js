const dbHelperFunctions = require("../db/queries/users_resources");
const express = require("express");
const router = express.Router();
const auth = require("../lib/auth-middleware");

module.exports = db => {
  router.get("/", auth, (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
      res.redirect("/api/users/login");
    }
    let options = req.query;

    dbHelperFunctions.getAllResources(db, options, 60).then(data => {
      const user = res.locals.user;
      res.render("index", { data, user });
      // res.render("index", { data });
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
      const user = res.locals.user;
      res.render("index", { data, user });
      // res.render("index", { data });
      res.status(200);
    });
  });

  //// Getting to the creation page
  router.get("/add-resource", auth, (req, res) => {
    const user = res.locals.user;
    console.log(user);
    if (req.session.userId) {
      res.render("resource_new", {user});
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

  //liking resources
  router.post("/:id/likes", auth, (req, res) => {
    const likeParams = {};
    likeParams.resource_id = req.params.id;
    likeParams.user_id = res.locals.user.id;

    dbHelperFunctions.addLike(db, likeParams).then(resource_id => {
      dbHelperFunctions.countLikes(db, resource_id).then(data => {
        const number_of_likes = data[0].count;
        res.json({ number_of_likes });
      });
    });
  });

  // get the individual resource page
  router.get("/:id", auth, (req, res) => {
    const resource_id = req.params.id;

    dbHelperFunctions.getResourceFromId(db, resource_id).then(data => {
      const user = res.locals.user;
      console.log(
        "here: ",
        data.created_at = moment(data.created_at).format(
          "dddd, MMMM Do YYYY, h:mm:ss a"
        )
      );
      res.render("expandedResource", { data, user });
    });
  });

  // get the comments for resource
  router.get("/:id/comments", auth, (req, res) => {
    const resource_id = req.params.id;

    dbHelperFunctions.fetchComments(db, resource_id).then(console.log);
  });

  // post a new comment to resource
  router.post("/:id/comments", auth, (req, res) => {
    const { ...newCommentParams } = req.body;
    newCommentParams.user_id = res.locals.user.id;

    dbHelperFunctions.addNewComment(db, newCommentParams).then(resource_id => {
      dbHelperFunctions.fetchComments(db, resource_id).then(comments => {
        res.send(comments);
      });
    });
  });
  return router;
};

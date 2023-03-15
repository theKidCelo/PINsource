//search function

const express = require('express');
const router  = express.Router();
const searchQueries = require('../db/queries/search');

router.get('/search/:id', function(req, res) {
  const { id } = req.params;
  try {
    const allResources = searchQueries.searchResources(id);
    res.json({
      status: "success",
      allResources,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

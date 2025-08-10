const router = require('express').Router();
let Component = require('../models/component.model');

router.route('/:category/compatible').get(async (req, res) => {
  try {
    const categoryName = new RegExp('^' + req.params.category + '$', 'i');
    
    const query = {
      category: categoryName
    };

    if (req.query.socket) {
      query['specs.Socket'] = req.query.socket;
    }
    
    if (req.query.ram_type) {
      query['specs.Type'] = req.query.ram_type;
    }
    
    if (req.query.min_wattage) {
      query['specs.Wattage'] = { $gte: Number(req.query.min_wattage) };
    }

    console.log("Running compatibility query:", query);

    const components = await Component.find(query);
    res.json(components);

  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});


router.route('/:category').get(async (req, res) => {
  try {
    const categoryName = new RegExp('^' + req.params.category + '$', 'i');
    const components = await Component.find({ category: categoryName });
    res.json(components);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router;
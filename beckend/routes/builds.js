const router = require('express').Router();
let Build = require('../models/build.model');

router.route('/add').post(async (req, res) => {
    try {
        const { buildName, components } = req.body;
        const newBuildData = {
            buildName,
            components: { ...components, pcCase: components.case }
        };
        delete newBuildData.components.case;

        const newBuild = new Build(newBuildData);
        const savedBuild = await newBuild.save();
        res.status(201).json({ message: 'Build saved successfully!', uid: savedBuild.uid });
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

router.route('/').get(async (req, res) => {
    try {
        const builds = await Build.find()
            .sort({ createdAt: -1 })
            .populate('components.cpu components.motherboard components.cooler components.ram components.gpu components.storage components.psu components.pcCase');
        res.json(builds);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

router.route('/search/:uid').get(async (req, res) => {
    try {
        const build = await Build.findOne({ uid: req.params.uid })
            .populate('components.cpu components.motherboard components.cooler components.ram components.gpu components.storage components.psu components.pcCase');
        if (!build) {
            return res.status(404).json({ message: 'Build not found with that UID.' });
        }
        res.json(build);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

router.route('/:id').delete(async (req, res) => {
    try {
        await Build.findByIdAndDelete(req.params.id);
        res.json('Build deleted successfully.');
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

module.exports = router;
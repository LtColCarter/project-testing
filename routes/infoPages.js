const {InfoPage, validate} = require('../models/infoPage');
const validator = require('../middleware/validateBody');
const validateParam = require('../middleware/validateParam');
const express = require('express');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/:pageType', async (req, res) => {

    const {pageType} = req.params;

    if (pageType !== 'volunteer' && pageType !== 'donation') {
        return res.status(400).send('Invalid type given')
    }

    const infoPage = await InfoPage.findOne({
        pageType: pageType
    });

    if (!infoPage) return res.status(404).send('The page of that type was not found.');

    res.send(infoPage);

});

router.patch('/:pageType', [auth], async (req, res) => {

    const {link, text, title} = req.body;
    const {pageType} = req.params;

    if (pageType !== 'donation' && pageType !== 'volunteer') return res.status(400).send("Invalid pageType given");

    const {_id} = await InfoPage.findOne({
        pageType
    });

    const page = await InfoPage.findByIdAndUpdate(_id, {
        link,
        text,
        title
    });

    if (page) {
        return res.send(page)
    }

    return res.status(400).send("Could not find the page by using this pageType")
});

module.exports = router;



const {Story, validate} = require('../models/story');
const validator = require('../middleware/validateBody');
const validateParam = require('../middleware/validateParam');
const auth = require('../middleware/auth');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/:id', async (req, res) => {
    const {id: storyId} = req.params;
    if (!mongoose.Types.ObjectId.isValid(storyId)) return res.status(400).send('Given Id not valid');
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).send('The story with the given ID was not found.');

    res.send(story);
});

router.get('/', async (req,res) => {
    const stories = await Story.find();
    res.send(stories);
});


router.post('/', [auth, validator(validate)], async (req, res) => {

    const {title, author, image, audio, video, text, xCoordinate, yCoordinate} = req.body;

    try {
        const story = await new Story({
            title,
            author,
            image,
            audio,
            video,
            text,
            xCoordinate,
            yCoordinate
        }).save();

        if (!story) {
            return res.status(500).send('Failed to add a new story.')
        }

        return res.send(story)

    } catch (ex) {
        return res.status(500).send('Failed to add a new story.')
    }
});

router.patch('/:id', [auth, validateParam], async (req, res) => {
    const {title, author, image, audio, video, text, xCoordinate, yCoordinate} = req.body;
    const {id} = req.params;

    const story = await Story.findByIdAndUpdate(id, {
        title,
        author,
        image,
        audio,
        video,
        text,
        xCoordinate,
        yCoordinate
    });

    if (story) {
        return res.send(story)
    }

    return res.status(400).send("Could not find story with given id")
});

router.delete('/:id', [auth, validateParam], async (req, res) => {

    const {id} = req.params;
    const story = await Story.findByIdAndDelete(id);

    if (story) {
        return res.send(story._id)
    }
    return res.status(400).send("Could not find story with given id")
});

module.exports = router;
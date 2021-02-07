const Joi = require('joi');
const mongoose = require('mongoose');

const StoryLocation = mongoose.model( 'StoryLocation', new mongoose.Schema({
    storyId: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 255
    },
    xCoordinate: {
        type: String,
        maxLength: 4
    },
    yCoordinate: {
        type: String,
        maxLength: 4
    }
}));

function validateStoryLocation(storyLocation) {
    const schema = {
        storyId: Joi.string().min(3).max(255).required(),
        xCoordinate: Joi.string().max(4),
        yCoordinate: Joi.string().max(4)
    };
    return Joi.validate(storyLocation,schema);
}

exports.StoryLocation = StoryLocation;
exports.validate = validateStoryLocation;
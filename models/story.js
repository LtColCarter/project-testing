const Joi = require('joi');
const mongoose = require('mongoose');

const Story = mongoose.model('Story', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    image: {
        type: String,
        minlength: 10,
        maxlength: 255
    },
    audio: {
        type: String,
        minlength: 10,
        maxlength: 255
    },
    video: {
        type: String,
        minlength: 10,
        maxlength: 255
    },
    text: {
        type: Array,
        maxlength: 5000
    },
    author: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    xCoordinate: {
        type: String,
        maxLength: 4
    },
    yCoordinate: {
        type: String,
        maxLength: 4
    },
}));

function validateStory(story) {
    const schema = {
        title: Joi.string().min(3).max(50).required(),
        image: Joi.string().min(10).max(255),
        audio: Joi.string().min(10).max(255),
        video: Joi.string().min(10).max(255),
        text: Joi.array().max(5000),
        author: Joi.string().min(3).max(50).required(),
        xCoordinate: Joi.string().max(4).required(),
        yCoordinate: Joi.string().max(4).required(),
    };

    return Joi.validate(story, schema);
}

exports.Story = Story;
exports.validate = validateStory;
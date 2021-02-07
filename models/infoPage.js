const Joi = require('joi');

const mongoose = require('mongoose');

const InfoPage = mongoose.model('infoPage', new mongoose.Schema({
    link: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 255
    },

    text: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 1000
    },

    title: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 255
    },
    
    pageType: {
        type: String,
        required: true,
        enum: ['volunteer', 'donation']
    }
}));

function validatePage(infoPage) {

    const schema = {

        link: Joi.string().min(10).max(255).required(),
        text: Joi.string().min(10).max(1000).required(),
        title: Joi.string().min(10).max(255).required(),
        pageType: Joi.string().valid(['volunteer', 'donation']).required()

    };

    return Joi.validate(infoPage, schema);
}

exports.InfoPage = InfoPage;
exports.validate = validatePage;
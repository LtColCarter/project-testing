const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('config');
const sendmail = require('sendmail')({
    silent: true,
});
const router = express.Router();

router.post('/', async (req, res) => {
    const {error} = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    res.send(token);
});


router.get('/validate/:token', async (req, res) => {
    const {token} = req.params;

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

        if (decoded) {
            return res.send({
                valid: true
            })

        } else {
            return res.send({
                valid: false
            })
        }
    } catch (e) {
        return res.send({
            valid: false
        })
    }
});

router.get('/:token', async (req, res) => {
    const {token} = req.params;

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

        if (decoded && decoded.passwordReset) {
            return res.send({
                valid: true
            })

        } else {
            return res.send({
                valid: false
            })
        }
    } catch {
        return res.send({
            valid: false
        })
    }


});

router.post('/send-reset', async (req, res) => {

    const user = await User.findOne();

    if (!user)
        return res.status(400).send('No admin account exists');

    const {email} = user;

    const cms = config.get('cms');

    const token = jwt.sign({passwordReset: true}, config.get('jwtPrivateKey'));

    const resetLink = cms + '/resetPassword/' + token;

    sendmail({
            from: 'blubirdurham@gmail.com',
            to: email,
            subject: 'Password Reset',
            html: `<a href="${resetLink}">Please follow this link to reset your password</a>`
        },

        function (err) {
            if (err) {
                return res.status(500).send(err)
            }
            return res.status(200).send('Successfully sent email')
        }
    )
});

router.patch('/update-password', async (req, res) => {

    const user = await User.findOne();

    if (!user)
        return res.status(400).send('No admin account exists');

    let {password, token} = req.body;

    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));

        if (decoded && decoded.passwordReset) {
            if (!password) {
                res.status(400).send('No password given')
            }

            const salt = await bcrypt.genSalt(10);
            password = await bcrypt.hash(password, salt);

            const updated = await User.findByIdAndUpdate(user._id, {
                password
            });

            if (!updated) {
                res.status(500).send('Failed to update password')
            }

            res.send()

        } else {
            return res.send({
                valid: false
            })
        }
    } catch {
        return res.send({
            valid: false
        })
    }


});

function validate(req) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(255).required()
    };

    return Joi.validate(req, schema);
}

module.exports = router;

const request = require('supertest');
const {User} = require('../../../models/user');
const {Story} = require('../../../models/story');
const bcrypt = require('bcrypt')
const mongoose = require('mongoose');

let server;
let token;

describe('/api/stories', () => {
    beforeEach(() => {
        server = require('../../../index');
        token = new User().generateAuthToken();
    });
    afterEach(async () => {
        await User.deleteMany({});
    });

    const addUser = async () => {
        let password = 'password';

        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);

        await new User({
            name: 'admin',
            email: 'tully@utclubsxu.com',
            password
        }).save();
    }


    describe('POST /send-reset', () => {

        const exec = async () => {
            return await request(server).post('/api/auth/send-reset')
                .send({});
        };

        it('should return 200 status and the message info for the email', async () => {

            await addUser()
            const res = await exec();
            expect(res.status).toBe(200)
        });

    });


});
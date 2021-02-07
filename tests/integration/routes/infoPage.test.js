const request = require('supertest');
const {InfoPage} = require('../../../models/infoPage');
const {User} = require('../../../models/user');

const mongoose = require('mongoose');

let server;

describe('/api/infoPages', () => {

    beforeEach(async () => {
        server = require('../../../index');
        token = new User().generateAuthToken();
    });

    afterEach(async () => {
        await server.close();
        await InfoPage.deleteMany({});
    });

    const exec = async () => {
        await new InfoPage({
            link: 'example link 1',
            text: 'example text 1',
            title: 'example title',
            pageType: 'volunteer'
        }).save();

        await new InfoPage({
            link: 'example link 2',
            text: 'example text 2',
            title: 'example title',
            pageType: 'donation'
        }).save();
    };

    describe('GET /:pageType', () => {
        it('should return a volunteer page if /volunteer is passed', async () => {
            await exec()
            const res = await request(server).get('/api/infoPages/' + 'volunteer')
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('pageType', 'volunteer')
        });

        it('should return a donation page if valid /donation is passed', async () => {
            await exec()
            const res = await request(server).get('/api/infoPages/' + 'donation');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('pageType', 'donation')
        });

        it('should return 400 if invalid pagetype is passed', async () => {
            await exec()
            const res = await request(server).get('/api/infoPages/' + 'invalid');
            expect(res.status).toBe(400);
        });

        it('should return 404 if a valid volunteer parameter is passed but does not exist', async () => {
            const res = await request(server).get('/api/infoPages/volunteer/' + 'volunteer');
            expect(res.status).toBe(404);
        });

        it('should return 404 if a valid donation parameter is passed but does not exist', async () => {
            const res = await request(server).get('/api/infoPages/donation/' + 'donation');
            expect(res.status).toBe(404);
        });
    });

    describe('PATCH /', () => {

        let pageType;
        let link;
        let text;
        let title;

        const execPost = async () => {

            return await new InfoPage({
                link, text, pageType, title
                }).save();
        };

        const execPatch = async () => {

            return await request(server).patch(`/api/infoPages/${pageType}`)
                .set('authorization', token)
                .send({link, text, title});
        };

        beforeEach(() => {
            link = 'a valid link';
            text = 'some valid text';
            title = 'a title that is of good length'
            });


        it('should return 200 and update the infoPage if a valid pageType is passed', async () => {

            pageType = 'donation';
            await execPost();


            text = 'Updated text';
            const res = await execPatch();

            expect(res.status).toBe(200);
            // expect(story).toHaveProperty('text', text);
        });

        it('should return status 400 if an invalid pageType is passed', async () => {

            pageType = 'Invalid';

            const res = await execPatch();

            expect(res.status).toBe(400);
        });


        it('should return status 400 if a valid id is passed that does not exist', async () => {
            id = new mongoose.Types.ObjectId;

            const res = await execPatch();

            expect(res.status).toBe(400);
        });

    });

});
const {User} = require('../../../models/user');
const {Story} = require('../../../models/story');
const {StoryLocation} = require('../../../models/storyLocation');
const request = require('supertest');

describe('auth middleware', () => {
    beforeEach(() => {
        server = require('../../../index');
    });
    afterEach(async () => {
        await Story.deleteMany({});
        await StoryLocation.deleteMany({});
        await server.close();
    });

    let token;

    const exec = () => {
        return request(server)
            .post('/api/stories')
            .set('authorization', token)
            .send({author: 'author1', title: 'title1'});
    };

    beforeEach(() => {
        token = new User().generateAuthToken();
    });

    it('should return 401 if no token is provided', async () => {
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if token is invalid', async () => {
        token = 'a';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if token is valid', async () => {
        const res = await exec();

        expect(res.status).toBe(200);
    });
});
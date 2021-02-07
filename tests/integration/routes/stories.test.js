const request = require('supertest');
const {User} = require('../../../models/user')
const {Story} = require('../../../models/story');
const mongoose = require('mongoose');

let server;
let token;

describe('/api/stories', () => {
    beforeEach(() => {
        server = require('../../../index');
        token = new User().generateAuthToken();
    });
    afterEach(async () => {
        await server.close();
        await Story.deleteMany({});
    });

    describe('GET /', () => {
        it('should return a 200 status and list of stories', async () => {
            await new Story({name: 'story1', title: 'storyTitle', author: 'John Smith'}).save();
            await new Story({name: 'story2', title: 'storyTitle', author: 'John Smith'}).save();

            const res = await request(server).get('/api/stories/');

            expect(res.status).toBe(200);
            expect(res.body).toHaveLength(2);
        });
    });

    describe('GET /:id', () => {
        it('should return a story if valid id is passed', async () => {
            const story = new Story({name: 'story1', title: 'storyTitle', author: 'John Smith'});
            await story.save();

            const res = await request(server).get('/api/stories/' + story._id);

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', story.name);
        });

        it('should return 400 if invalid id is passed', async () => {
            const story = new Story({name: 'story1', title: 'storyTitle', author: 'John Smith'});
            await story.save();

            const res = await request(server).get('/api/stories/' + 'invalid');

            expect(res.status).toBe(400);
        });

        it('should return 404 if a valid id is passed that does not exist', async () => {

            const story = new Story({name: 'story1', title: 'storyTitle', author: 'John Smith'});

            await story.save();
            const id = new mongoose.Types.ObjectId();
            const res = await request(server).get('/api/stories/' + id);
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {

        let title;
        let author;
        let text;
        let image;
        let video;
        let audio;
        let xCoordinate;
        let yCoordinate;

        const exec = async () => {
            return await request(server).post('/api/stories')
                .set('authorization', token)
                .send({title, author, text, image, video, audio, xCoordinate, yCoordinate});
        };

        beforeEach(() => {
            title = 'a valid title';
            author = 'a valid author';
            text = ['some valid text'];
            xCoordinate = '500';
            yCoordinate = '500';
        });

        it('should return 200 and create a text story and storyLocation document when valid data is passed', async () => {

            const res = await exec();


            expect(res.status).toBe(200);

            const story = await Story.findById(res.body._id);


            expect(story).toHaveProperty('title', title);
        });

        it('should return status 400 if an invalid title is passed', async () => {

            title = '';
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('should return status 400 if an invalid author is passed', async () => {

            author = '';
            const res = await exec();

            expect(res.status).toBe(400);
        });
    })

    describe('PATCH /', () => {

        let id;
        let title;
        let author;
        let text;
        let image;
        let video;
        let audio;

        const execPost = async () => {
            return await new Story({
                title, author, text, image, video, audio
            }).save();
        };

        const execPatch = async () => {
            return await request(server).patch(`/api/stories/${id}`)
                .set('authorization', token)
                .send({title, author, text, image, video, audio});
        };

        beforeEach(() => {
            title = 'a valid title';
            author = 'a valid author';
            text = 'some valid text';
        });

        it('should return 200 and update the story if a valid storyId is passed', async () => {

            const {_id: storyId} = await execPost();

            id = storyId;

            title = 'Updated title';
            const res = await execPatch();

            const story = await Story.findById(storyId);

            expect(res.status).toBe(200);
            expect(story).toHaveProperty('title', title);
        });

        it('should return status 400 if an invalid id is passed', async () => {
            id = 'Invalid';

            const res = await execPatch();

            expect(res.status).toBe(400);
        });

        it('should return status 400 if a valid id is passed that does not exist', async () => {
            id = new mongoose.Types.ObjectId;

            const res = await execPatch();

            expect(res.status).toBe(400);
        });
    })

    describe('DELETE /', () => {

        let title;
        let author;
        let text;
        let image;
        let video;
        let audio;

        const execPost = async () => {
            return await new Story({
                title, author, text, image, video, audio
            }).save();
        };

        const execDelete = async (storyId) => {
            return await request(server).delete(`/api/stories/${storyId}`)
                .set('authorization', token)
                .send();
        };

        beforeEach(() => {
            title = 'a valid title';
            author = 'a valid author';
            text = 'some valid text';
        });

        it('should return 200 delete the added story and storyLocation if a valid ID is passed', async () => {

            const {_id: storyId} = await execPost();
            const res = await execDelete(storyId)

            expect(res.status).toBe(200)

            const story = await Story.findById(storyId)

            expect(story).toBeNull()

        });

        it('should return 400 if an invalid ID is passed', async () => {

            const storyId = 'invalid'
            const res = await execDelete(storyId)

            expect(res.status).toBe(400)
        });

        it('should return 400 if a valid ID is passed that does not exist', async () => {

            const storyId = new mongoose.Types.ObjectId()
            const res = await execDelete(storyId)

            expect(res.status).toBe(400)
        });

    })

});
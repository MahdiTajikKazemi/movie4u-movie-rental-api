const request = require('supertest');

describe('/api/returns', () => {

    let server;

    beforeEach(() => { server = require('../../../index'); });
    afterEach(async () => { await server.close(); });

    describe('POST /', () => {
        it('Should return 401 if client is not logged in', async () => {
            const res = await request(server).post('/api/returns');

            expect(res.status).toBe(401);
        });
    });
});
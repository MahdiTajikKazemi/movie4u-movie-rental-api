const request = require('supertest');
const { Rental } = require('../../../models/rental');
const { User } = require('../../../models/user');
const mongoose = require('mongoose');


describe('/api/returns', () => {

    let server;
    let rental;
    let customerId;
    let movieId;

    beforeEach(async () => { 
        server = require('../../../index');

        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();

        rental = new Rental({
            customer: {
                _id: customerId,
                name: "12345",
                phone: "12345"
            },
            movie: {
                _id: movieId,
                title: "test title",
                dailyRentalRate: 2
            }
        });
        await rental.save();
    });
    afterEach(async () => { 
        await server.close();
        await Rental.deleteMany({});
    });

    describe('POST /', () => {
        it('Should return 401 if client is not logged in', async () => {
            const res = await request(server)
            .post('/api/returns')
            .send({ customerId, movieId });

            expect(res.status).toBe(401);
        });

        it('Should return 400 if customerId is not provided', async () => {
            const token = new User().generateAuthToken();

            const res = await request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ movieId });
                

            expect(res.status).toBe(400);
        });
    });
});
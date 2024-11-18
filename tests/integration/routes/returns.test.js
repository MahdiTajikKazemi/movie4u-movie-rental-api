const request = require('supertest');
const { Rental } = require('../../../models/rental');
const { Movie } = require('../../../models/movie');
const { User } = require('../../../models/user');
const mongoose = require('mongoose');
const moment = require('moment');



describe('/api/returns', () => {

    let server;
    let rental;
    let customerId;
    let movieId;
    let token;
    let movie;

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId });
    };

    beforeEach(async () => { 
        server = require('../../../index');

        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();
        token = new User().generateAuthToken();

        movie = new Movie({
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: { name: '12345' },
            numberInStock: 10 
          });
          await movie.save();

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
        await Movie.deleteMany({});
    });

    describe('POST /', () => {
        it('Should return 401 if client is not logged in.', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('Should return 400 if customerId is not provided.', async () => {
            customerId = '';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('Should return 400 if movieId is not provided.', async () => {
            movieId = '';

            const res = await exec();
            
            expect(res.status).toBe(400);
        });

        it('Should return 404 if no rental round for this customer/movie combo.', async () => {
            await Rental.deleteMany({});

            const res = await exec();
            
            expect(res.status).toBe(404);
        });

        it('Should return 400 if rental is already processed.', async () => {
            rental.dateReturned = new Date();
            await rental.save();

            const res = await exec();
            
            expect(res.status).toBe(400);
        });

        it('Should return 200 if request is valid.', async () => {
            const res = await exec();
            
            expect(res.status).toBe(200);
        });

        it('Should set the returnDate if input is valid.', async () => {
            const res = await exec();

            const rentalInDb = await Rental.findById(rental._id);
            const diff = new Date() - rentalInDb.dateReturned;

            expect(diff).toBeLessThan(10 * 1000);
        });

        it('should set the rentalFee if input is valid', async () => {
            rental.dateOut = moment().add(-7, 'days').toDate();
            await rental.save();
        
            const res = await exec();
        
            const rentalInDb = await Rental.findById(rental._id);
            expect(rentalInDb.rentalFee).toBe(14);
        });

        it('Should increase the movie stock if input is valid', async () => {
            const res = await exec();
        
            const movieInDb = await Movie.findById(movieId);
            expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
        });
        
        it('Should return the rental if input is valid', async () => {
        const res = await exec();
    
        const rentalInDb = await Rental.findById(rental._id);
    
        expect(Object.keys(res.body)).toEqual(
            expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee',
            'customer', 'movie']));
        });
    });
});
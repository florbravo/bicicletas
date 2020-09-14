const request = require('request');
const server = require('../../bin/www');
const mongoose = require('mongoose');

const Bicicleta = require('../../models/bicicleta');
const Usuario = require('../../models/usuario');
const Reserva = require('../../models/reserva');

const baseUrl = 'http://localhost:5000/api/';
mongoose.connection.close();

describe('Bicicleta API', () => {
    beforeAll(function (done) {
        mongoose.connection.close().then(() => {
            const mongoDB = 'mongodb://localhost/test_db';
            mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
            mongoose.set('useCreateIndex', true);
            const db = mongoose.connection;
            db.on('error', console.error.bind(console, 'MongoDB connection error: '));
            db.once('open', function () {
                console.log('We are connected to test database!');
                done();
            });
        });
    });

    afterEach(function(done) {
        Reserva.deleteMany({}, (err, success) => {
            Usuario.deleteMany({}, (err, success) => {
                Bicicleta.deleteMany({}, (err, success) => {
                    done();
                });
            });
        });
    });

    it('GET Bicicletas /', () => {
        let a = new Bicicleta({code: 1, color: 'rojo', modelo: 'urbana', ubicacion: [-34.5664837, -58.4521725]});
        Bicicleta.add(a);

        request.get(baseUrl + 'bicicletas', function (error, response, body) {
            expect(response.statusCode).toBe(200);
        });
    });

    it('POST Bicicletas /create', (done) => {
        const headers = {'content-type': 'application/json'};
        let aBici = '{ "code": 10,"color":"lila","modelo":"urbana","lat":"-34","lng":"-58" }';

        request.post({
            headers: headers,
            url: baseUrl + 'bicicletas/create',
            body: aBici
        }, function (error, response, body) {
            expect(response.statusCode).toBe(200);
            Bicicleta.findByCode(10, function (err, bici) {
                expect(bici.color).toBe('lila');
                done();
            });
        });
    });

    it('DELETE Bicicletas /delete', (done) => {
        let a = new Bicicleta({code: 20, color: 'rojo', modelo: 'urbana', ubicacion: [-34.5664837, -58.4521725]});
        Bicicleta.add(a);

        const aBici = '{ "code": 20 }';
        const headers = {'content-type': 'application/json'};

        request.delete({
            headers: headers,
            url: baseUrl + 'bicicletas/delete',
            body: aBici
        }, function (error, response, body) {
            expect(response.statusCode).toBe(200);
            Bicicleta.allBicis(function (err, bicis) {
                expect(bicis.length).toBe(0);
                done();
            });
        });

    });
});

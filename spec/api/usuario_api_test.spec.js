const mongoose = require('mongoose');
const request = require('request');
const server = require('../../bin/www');

const Usuario = require('../../models/usuario');
const Reserva = require('../../models/reserva');
const Bicicleta = require('../../models/bicicleta');

const baseUrl = 'http://localhost:5000/api/';
mongoose.connection.close();

describe('Testing Usuarios API', () => {
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

    afterEach((done) => {
        Reserva.deleteMany({}, {}, (err, success) => {
            if (err) console.log(err);
            Usuario.deleteMany({}, {}, (err, success) => {
                if (err) console.log(err);
                Bicicleta.deleteMany({}, {}, (err, success) => {
                    if (err) console.log(err);
                    done();
                });
            });
        });
    });

    describe('cuando creamos un usuario', () => {
        it('devuelva status 200', (done) => {
            const headers = {'content-type': 'application/json'};
            let anUser = '{ "nombre": "Maria Florencia" }';

            request.post({
                headers: headers,
                url: baseUrl + 'usuarios/create',
                body: anUser
            }, function (error, response, body) {
                expect(response.statusCode).toBe(200);
                Usuario.find({}, function (err, usuarios) {
                    expect(usuarios.length).toBe(1);
                    expect(usuarios[0].nombre).toBe("Maria Florencia");
                    done();
                });
            });
        });
    });

    describe('cuando listamos usuarios', () => {
        it('devuelva status 200', (done) => {
            const usuario1 = new Usuario({nombre: "Juan Diego"});
            Usuario.add(usuario1);
            const usuario2 = new Usuario({nombre: "Marcos Polo"});
            Usuario.add(usuario2);

            request.get(baseUrl + 'usuarios', function (error, response, body) {
                expect(response.statusCode).toBe(200);
                Usuario.find({}, function (err, usuarios) {
                    expect(usuarios.length).toBe(2);
                    expect(usuarios[0].nombre).toBe("Juan Diego");
                    done();
                });
            });
        });
    });


    describe('cuando hacemos una reserva', () => {
        it('devuelva status 200', (done) => {
            const usuario = new Usuario({ nombre: 'Juan Marcos' });
            usuario.save();
            const bicicleta = new Bicicleta({code:1, color: 'verde', modelo: 'urbana', ubicacion:[-34.5,-54.1]});
            bicicleta.save();

            const headers = {'content-type': 'application/json'};
            let reserva = { id: usuario._id, bici_id:bicicleta._id, desde: '2020-01-01', hasta:'2020-01-02' };
            request.post({
                headers: headers,
                url: baseUrl + 'usuarios/reservar',
                body:  JSON.stringify(reserva)
            }, function (error, response, body) {
                expect(response.statusCode).toBe(200);

                Reserva.find({}).populate('usuario').populate('bicicleta').exec(function (err, reservas) {
                    expect(reservas.length).toBe(1);
                    expect(reservas[0].diasDeReserva()).toBe(2);
                    expect(reservas[0].bicicleta.code).toBe(1);
                    expect(reservas[0].usuario.nombre).toBe(usuario.nombre);

                    done();
                });

            });
        });
    });
});

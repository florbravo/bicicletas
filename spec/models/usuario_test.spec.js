const mongoose = require('mongoose');
const Usuario = require('../../models/usuario');
const Reserva = require('../../models/reserva');
const Bicicleta = require('../../models/bicicleta');

describe('Testing Usuarios', () => {
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

    describe('Cuando un usuario reserva una bici', () => {
        it('debe existir la reserva', (done) => {
            const usuario = new Usuario({ nombre: 'Juan' });
            usuario.save();
            const bicicleta = new Bicicleta({code:1, color: 'verde', modelo: 'urbana', ubicacion:[-34.5,-54.1]});
            bicicleta.save();

            let hoy = new Date();
            let manana = new Date();
            manana.setDate(hoy.getDate() + 1);
            usuario.reservar(bicicleta._id, hoy, manana, function (err, reserva) {
                if (err) console.log(err);

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

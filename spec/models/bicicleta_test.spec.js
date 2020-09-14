const mongoose = require('mongoose');
const Bicicleta = require('../../models/bicicleta');

describe('Testing bicicletas', () => {
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
        Bicicleta.deleteMany({}, {}, (err, success) => {
            if (err) console.log(err);
            done();
        });
    });

    describe('Bicicleta.createInstance', () => {
        it('crea una instancia de bicicleta', () => {
            let bici = Bicicleta.createInstance(1, 'verde', 'urbana', [-34.5, -54.1]);

            expect(bici.code).toBe(1);
            expect(bici.color).toBe('verde');
            expect(bici.modelo).toBe('urbana');
            expect(bici.ubicacion[0]).toBe(-34.5);
            expect(bici.ubicacion[1]).toBe(-54.1);
        });
    });

    describe('Bicicleta.allBicis', () => {
        it('comienza vacía', (done) => {
            Bicicleta.allBicis(function (err, bicis) {
                expect(bicis.length).toBe(0);
                done();
            });
        })
    });

    describe('Bicicleta.add', () => {
        it('agrega solo una bici', (done) => {
            let aBici = new Bicicleta({code: 1, color: 'verde', modelo: 'urbana', ubicacion: [-34.5, -54.1]});
            Bicicleta.add(aBici, function (err, newBici) {
                if (err) console.log(err);
                Bicicleta.allBicis(function (err, bicis) {
                    expect(bicis.length).toBe(1);
                    expect(bicis[0].code).toBe(aBici.code);

                    done();
                })
            });
        });
    });

    describe('Bicicleta.findByCode', () => {
        it('debe devolver la bici con codigo 1', (done) => {
            Bicicleta.allBicis(function (err, bicis) {
                expect(bicis.length).toBe(0);

                let aBici = new Bicicleta({code: 1, color: 'verde', modelo: 'urbana', ubicacion: [-34.5, -54.1]});
                Bicicleta.add(aBici, function (err, newBici) {
                    if (err) console.log(err);

                    let aBici2 = new Bicicleta({code: 2, color: 'roja', modelo: 'urbana', ubicacion: [-34.5, -54.1]});
                    Bicicleta.add(aBici2, function (err, newBici2) {
                        if (err) console.log(err);

                        Bicicleta.findByCode(1, function (error, targetBici) {
                            expect(targetBici.code).toBe(aBici.code);
                            expect(targetBici.color).toBe(aBici.color);
                            expect(targetBici.modelo).toBe(aBici.modelo);

                            done();
                        })
                    });

                });
            });
        });
    });

    describe('Bicicleta.removeByCode', () => {
        it('debe borrar bici con codigo 2', (done) => {
            Bicicleta.allBicis(function (err, bicis) {
                expect(bicis.length).toBe(0);

                let aBici = new Bicicleta({code: 1, color: 'verde', modelo: 'urbana', ubicacion: [-34.5, -54.1]});
                Bicicleta.add(aBici, function (err, newBici) {
                    if (err) console.log(err);

                    let aBici2 = new Bicicleta({code: 2, color: 'roja', modelo: 'urbana', ubicacion: [-34.5, -54.1]});
                    Bicicleta.add(aBici2, function (err, newBici2) {
                        if (err) console.log(err);

                        Bicicleta.removeByCode(2, function (error, targetBici) {
                            Bicicleta.allBicis(function (err, bicis) {
                                expect(bicis.length).toBe(1);

                                done();
                            })
                        })
                    });

                });
            });
        });
    });
});

const Bicicleta = require('../../models/bicicleta');
const request = require('request');
const server = require('../../bin/www');

beforeEach(() => {
    Bicicleta.allBicis = [];
});

describe('Bicicleta API', () => {
    describe('GET Bicicletas /', () => {
        it('status 200', () => {
            expect(Bicicleta.allBicis.length).toBe(0);
            let a = new Bicicleta(1, 'rojo', 'urbana', [-34.5664837,-58.4521725]);
            Bicicleta.add(a);

            request.get('http://localhost:5000/api/bicicletas', function(error, response, body) {
                expect(response.statusCode).toBe(200);
            });
        });
    });
});


describe('POST Bicicletas /create', () => {
    it('status 200', (done) => {
        const headers = {'content-type': 'application/json'};
        let aBici = '{ "id":"10","color":"lila","modelo":"urbana","lat":"-34","lng":"-58" }';

        request.post({
            headers: headers,
            url: 'http://localhost:5000/api/bicicletas/create',
            body: aBici
        }, function(error, response, body) {
            expect(response.statusCode).toBe(200);
            expect(Bicicleta.findById(10).color).toBe('lila');
            done();
        });
    });
});

describe('DELETE Bicicletas /delete', () => {
    it('status 200', (done) => {
        const headers = {'content-type': 'application/json'};

        expect(Bicicleta.allBicis.length).toBe(0);
        let a = new Bicicleta(20, 'rojo', 'urbana', [-34.5664837,-58.4521725]);
        Bicicleta.add(a);

        let aBici = '{ "id":"20" }';

        request.delete({
            headers: headers,
            url: 'http://localhost:5000/api/bicicletas/delete',
            body: aBici
        }, function(error, response, body) {
            expect(response.statusCode).toBe(200);
            expect(Bicicleta.allBicis.length).toBe(0);
            done();
        });
    });
});

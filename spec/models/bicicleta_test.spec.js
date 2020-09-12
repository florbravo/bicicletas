const Bicicleta = require('../../models/bicicleta');

beforeEach(() => {
    Bicicleta.allBicis = [];
});

describe('Bicicleta.allBicis', () => {
    it('comienza vacía', () => {
        expect(Bicicleta.allBicis.length).toBe(0);
    })
});

describe('Bicicleta.add', () => {
    it('agregamos una', () => {
        expect(Bicicleta.allBicis.length).toBe(0);

        let a = new Bicicleta(1, 'rojo', 'urbana', [-34.5664837,-58.4521725]);
        Bicicleta.add(a);

        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0]).toBe(a);
    });
});

describe('Bicicleta.findById', () => {
    it('debe devolver la bici con id 1', () => {
        expect(Bicicleta.allBicis.length).toBe(0);

        let a = new Bicicleta(1, 'verde', 'urbana', [-34.5664837,-58.4521725]);
        let b = new Bicicleta(2, 'blanca', 'mountain', [-34.5852918,-58.4233439]);

        Bicicleta.add(a);
        Bicicleta.add(b);

        let targetBici = Bicicleta.findById(1);

        expect(targetBici.id).toBe(1);
        expect(targetBici.color).toBe(a.color);
        expect(targetBici.modelo).toBe(a.modelo);
    });
});

describe('Bicicleta.removeById', () => {
    it('debe eliminar la bici 1', () => {
        expect(Bicicleta.allBicis.length).toBe(0);

        let a = new Bicicleta(1, 'verde', 'urbana', [-34.5664837,-58.4521725]);
        let b = new Bicicleta(2, 'blanca', 'mountain', [-34.5852918,-58.4233439]);

        Bicicleta.add(a);
        Bicicleta.add(b);

        expect(Bicicleta.allBicis.length).toBe(2);

        Bicicleta.removeById(1);
        expect(Bicicleta.allBicis.length).toBe(1);
        expect(Bicicleta.allBicis[0]).toBe(b);
    });
});
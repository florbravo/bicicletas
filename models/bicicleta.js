const Bicicleta = function (id, color, modelo, ubicacion) {
    this.id = id;
    this.color = color;
    this.modelo = modelo;
    this.ubicacion = ubicacion;
}

Bicicleta.prototype.toString = function() {
    return 'id: ' + this.id + ' | color: ' + this.color;
}

Bicicleta.allBicis = [];
Bicicleta.add = function (aBici) {
    Bicicleta.allBicis.push(aBici);
}
Bicicleta.findById = function (aBiciId) {
    let aBici = Bicicleta.allBicis.find(x => x.id =- aBiciId);
    if (aBici) {
        return aBici;
    }

    throw new Error(`Not found! ${aBiciId}`);
}
Bicicleta.removeById= function (aBiciId) {
    for(let i = 0;i < Bicicleta.allBicis.length; i++) {
        if (Bicicleta.allBicis[i].id == aBiciId) {
            Bicicleta.allBicis.splice(i, 1);
            break;
        }
    }
}

let a = new Bicicleta(1, 'rojo', 'urbana', [-34.5664837,-58.4521725]);
let b = new Bicicleta(2, 'blanca', 'urbana', [-34.5852918,-58.4233439]);

Bicicleta.add(a);
Bicicleta.add(b);

module.exports = Bicicleta;
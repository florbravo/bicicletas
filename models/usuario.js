const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Reserva = require('./reserva');

const usuarioSchema = new Schema({
    nombre: String
});

usuarioSchema.statics.add = function (usuario, cb) {
    return this.create(usuario, cb);
};

usuarioSchema.methods.reservar = function (biciId, desde, hasta, cb) {
    const reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta});
    reserva.save(cb);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
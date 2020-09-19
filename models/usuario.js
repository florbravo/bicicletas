const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Reserva = require('./reserva');
const uniqueValidator = require('mongoose-unique-validator');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const validateEmail = function (email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

const usuarioSchema = new Schema({
    nombre: {
        type: String,
        trim: true,
        required: [true, 'El nombre es obligatorio']
    },
    email: {
        type: String,
        trim: true,
        required: [true, 'El email es obligatorio'],
        lowercase: true,
        unique: true,
        validate: [validateEmail, 'Por favor, ingrese un email valido'],
        match: [/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/]
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatorio'],
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
    verificado: {
        type: Boolean,
        default: false,
    }
});

usuarioSchema.plugin(uniqueValidator, { message: 'El {PATH} ya existe con otro usuario.'})

usuarioSchema.pre('save', function (next) {
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, saltRounds);
    }
    next();
});

usuarioSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

usuarioSchema.statics.add = function (usuario, cb) {
    return this.create(usuario, cb);
};

usuarioSchema.methods.reservar = function (biciId, desde, hasta, cb) {
    const reserva = new Reserva({usuario: this._id, bicicleta: biciId, desde: desde, hasta: hasta});
    reserva.save(cb);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
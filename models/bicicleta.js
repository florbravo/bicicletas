const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const biciletaSchema = new Schema({
    code: Number,
    color: String,
    modelo: String,
    ubicacion: {
        type: [Number], index: { type: '2dsphere', sparse: true}
    }
});

biciletaSchema.statics.createInstance = function(code, color, modelo, ubicacion) {
    return new this({
        code: code,
        color: color,
        modelo: modelo,
        ubicacion: ubicacion
    });
};
biciletaSchema.methods.toString = () => {
    return 'id: ' + this.code + ' | color: ' + this.color;
};
biciletaSchema.statics.allBicis = function(cb) {
    return this.find({}, cb);
};
biciletaSchema.statics.add = function(aBici, cb) {
    return this.create(aBici, cb);
};
biciletaSchema.statics.findByCode = function(aCode, cb) {
    return this.findOne({ code: aCode }, cb);
};
biciletaSchema.statics.removeByCode = function(aCode, cb) {
    return this.deleteOne({ code: aCode }, cb);
};
biciletaSchema.statics.removeById = function(biciId, cb) {
    return this.deleteOne({ _id: biciId }, cb);
};

module.exports = mongoose.model('Bicicleta', biciletaSchema);

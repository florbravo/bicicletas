var Bicicleta = require('../models/bicicleta');

exports.bicicleta_list = function (req, res){
    Bicicleta.allBicis(function (err, bicis) {
        res.render('bicicletas/index', { bicis: bicis });
    });
}

exports.bicicleta_create_get = function (req, res) {
    res.render('bicicletas/create');
}
exports.bicicleta_create_post = function (req, res) {
    let bici = Bicicleta.createInstance(req.body.code, req.body.color, req.body.modelo, [req.body.lat, req.body.lng]);
    Bicicleta.add(bici, function (err) {
        res.redirect('/bicicletas');
    });
}

exports.bicicleta_delete_post = function (req, res) {
    Bicicleta.removeById(req.body.id, function (err) {
        res.redirect('/bicicletas');
    });
}

exports.bicicleta_edit_get = function (req, res) {
    Bicicleta.findById(req.params.id, function (err, bici) {
        res.render('bicicletas/edit', {bici});
    });
}
exports.bicicleta_edit_post = function (req, res) {
    let bici = Bicicleta.findById(req.params.id);
    bici.id = req.body.id;
    bici.modelo = req.body.modelo;
    bici.color = req.body.color;
    bici.ubicacion = [req.body.lat, req.body.lng];

    res.redirect('/bicicletas');
}
let Bicicleta = require('../../models/bicicleta');

exports.bicicleta_list = function (req, res) {
    Bicicleta.allBicis(function (err, bicis) {
        res.status(200).json({
            bicicletas: bicis
        });
    });
}

exports.bicicleta_create = function (req, res) {
    let bici = new Bicicleta({
        code: req.body.code,
        color: req.body.color,
        modelo: req.body.modelo,
        ubicacion: [req.body.lat, req.body.lng]
    });

    Bicicleta.add(bici, function (err) {
        if (err) console.log(err);

        res.status(200).json(bici);
    });
}

exports.bicicleta_delete = function (req, res) {
    Bicicleta.removeByCode(req.body.code, function (err) {
        if (err) console.log(err);
        res.status(200).send();
    });
}


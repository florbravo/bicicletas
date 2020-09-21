const Usuario = require('../../models/usuario');
const bcryt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
    authenticate: function (req, res, next) {
        Usuario.findOne({email: req.body.email}, function (err, userInfo) {
            if (err) {
                next(err);
            } else {
                if (userInfo === null) {
                    return res.status(401).json({
                        status: 'error',
                        message: 'Invalid email/password',
                        data: null
                    });
                }

                if (userInfo != null && bcryt.compareSync(req.body.password, userInfo.password)) {
                    console.log({id: userInfo._id});
                    console.log(req.app.get('secretKey'));
                    const token = jwt.sign({id: userInfo._id}, req.app.get('secretKey'), {expiresIn: '7d'});
                    res.status(200).json({
                        message: 'usuario encontrado!',
                        data: {usuario: userInfo, token: token},
                    })
                } else {
                    return res.status(401).json({
                        status: 'error',
                        message: 'Invalid email / password',
                        data: null
                    });
                }
            }
        });
    },
    forgotPassword: function (req, res, next) {
        Usuario.findOne({email: req.body.email}, function (err, usuario) {
            if (usuario === null) {
                return res.status(401).json({
                    message: 'No existe el usuario'
                });
            }

            usuario.resetPassword(function (err) {
                if (err) {
                    return next(err);
                }
                res.status(200).json({
                    message: 'Se envio un email para reestablecer la contraseña'
                });
            });
        });
    },
}
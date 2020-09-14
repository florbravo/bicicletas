let express = require('express');
let router = express.Router();
let usuarioController = require('../../controllers/api/usuarioControllerAPI');

router.get('/', usuarioController.usuarios_list);
router.post('/create', usuarioController.usuarios_create);
router.post('/reservar', usuarioController.usuario_reservar)

module.exports = router;
let express = require('express');
let router = express.Router();
let bicicletaController = require('../controllers/bicicleta');

router.get('/', bicicletaController.bicicleta_list);
router.get('/create', bicicletaController.bicicleta_create_get);
router.post('/create', bicicletaController.bicicleta_create_post);
router.post('/:id/delete', bicicletaController.bicicleta_delete_post);
router.get('/:id/edit', bicicletaController.bicicleta_edit_get);
router.post('/:id/edit', bicicletaController.bicicleta_edit_post);

module.exports = router;
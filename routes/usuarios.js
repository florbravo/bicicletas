let express = require('express');
let router = express.Router();
let usuarioController = require('../controllers/usuario');

router.get('/', usuarioController.list);
router.get('/create', usuarioController.create_get);
router.post('/create', usuarioController.create_post);
router.get('/:id/update', usuarioController.update_get);
router.post('/:id/update', usuarioController.update_post);
router.post('/:id/delete', usuarioController.delete);

module.exports = router;
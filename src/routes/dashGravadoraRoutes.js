var express = require("express");
var router = express.Router();

var dashGravadoraController = require("../controllers/dashGravadoraController");

router.get("/obterDiferencaClipe", dashGravadoraController.obterDiferencaClipe);
router.get("/obterMelhorGenero", dashGravadoraController.obterMelhorGenero);
router.get("/obterMelhorPlataforma", dashGravadoraController.obterMelhorPlataforma);
router.get("/obterFeatSolo", dashGravadoraController.obterFeatSolo);
router.get("/obterTipoAlbum", dashGravadoraController.obterTipoAlbum);

module.exports = router;
var express = require("express");
var router = express.Router();

var dashGravadoraController = require("../controllers/dashGravadoraController");

router.get("/obterDiferencaClipe", dashGravadoraController.obterDiferencaClipe);

module.exports = router;
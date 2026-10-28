var express = require("express");
var router = express.Router();
var primeiroAcessoController = require("../controllers/primeiroAcessoController");

router.post("/definir-senha", primeiroAcessoController.definirSenha);

module.exports = router;

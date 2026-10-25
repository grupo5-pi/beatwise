var express = require("express");
var router = express.Router();
var cadastroFuncionarioController = require("../controllers/cadastroFuncionarioController");

router.post("/cadastrar", cadastroFuncionarioController.cadastrarFuncionario);

module.exports = router;

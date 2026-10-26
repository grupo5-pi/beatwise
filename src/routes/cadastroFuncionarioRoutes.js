var express = require("express");
var router = express.Router();
var cadastroFuncionarioController = require("../controllers/cadastroFuncionarioController");

router.post("/cadastrar", cadastroFuncionarioController.cadastrarFuncionario);
router.get("/listar/:idAdmin", cadastroFuncionarioController.listarFuncionarios);
router.put("/atualizar/:id", cadastroFuncionarioController.atualizarFuncionario);
router.delete("/excluir/:id", cadastroFuncionarioController.excluirFuncionario);

module.exports = router;
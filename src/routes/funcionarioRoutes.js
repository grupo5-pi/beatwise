var express = require("express");
var router = express.Router();
var controller = require("../controllers/funcionarioController");

router.get("/perfil/:id", controller.obterPerfil);
router.put("/perfil/:id/nome", controller.atualizarNome);
router.put("/perfil/:id/senha", controller.alterarSenha);
router.put("/perfil/:id/foto", controller.atualizarFoto);
router.delete("/perfil/:id", controller.excluirConta);

module.exports = router;
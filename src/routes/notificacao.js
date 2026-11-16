var express = require("express");
var router = express.Router();

var notificacaoController = require("../controllers/notificacaoController");

router.post("/salvarNotificacao", function (req, res) {
    notificacaoController.salvarNotificacao(req, res);
})

router.get("/buscarConfiguracao/:fkFuncionario", function (req, res) {
    notificacaoController.buscarConfiguracao(req, res);
})

router.delete("/excluirTema/:fkFuncionario/:tema", function (req, res) {
    notificacaoController.excluirTema(req, res);
})

module.exports = router;
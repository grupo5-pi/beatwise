var express = require("express");
var router = express.Router();

var notificacaoController = require("../controllers/notificacaoController");

//Recebendo os dados do html e direcionando para a função salvarNotificacao de notificacaoController.js
router.post("/salvarNotificacao", function (req, res) {
    notificacaoController.salvarNotificacao(req, res);
})


module.exports = router;
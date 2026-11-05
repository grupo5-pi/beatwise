var express = require("express");
var router = express.Router();

var notificacaoController = require("../controllers/notificacaoController");

router.post("/salvarNotificacao", function (req, res) {
    notificacaoController.salvarNotificacao(req, res);
})

module.exports = router;
var express = require("express");
var router = express.Router();

var { Usuario, LogSite } = require("../logs/logSite");

// Recebe do sidebar.js: "o usuário X abriu a página Y"
router.post("/pagina", function (req, res) {
    var b = req.body;

    if (!b.pagina) {
        return res.status(400).send("Faltou a página");
    }

    var usuario = new Usuario(b.id, b.nome, b.email, b.fkCargo);
    new LogSite("INFO", "Acessou a página", usuario, b.pagina).registrarLog();

    res.sendStatus(200);
});

// Recebe do sidebar.js: "o usuário X fez a ação Y"
router.post("/acao", function (req, res) {
    var b = req.body;

    if (!b.pagina || !b.mensagem) {
        return res.status(400).send("Faltou a página ou a mensagem");
    }

    var usuario = new Usuario(b.id, b.nome, b.email, b.fkCargo);
    new LogSite(b.nivel || "INFO", b.mensagem, usuario, b.pagina).registrarLog();

    res.sendStatus(200);
});

module.exports = router;

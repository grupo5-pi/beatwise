var express = require("express");
var router = express.Router();

var controller = require("../controllersMusicaController");

router.get("/musica", controller.obterMusicas);

module.exports = router;
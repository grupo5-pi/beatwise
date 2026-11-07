var express = require("express");
var router = express.Router();
var controller = require("../controllers/artistaController");

router.get("/:id", controller.buscar);

module.exports = router;

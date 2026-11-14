var express = require("express");
var router = express.Router();
var controller = require("../controllers/dashboardProdutorController");

router.get("/alertas", controller.alertas);
router.get("/fatorDecisivo", controller.fatorDecisivo);
router.get("/generos", controller.generos);
router.get("/viewsPorBpm", controller.viewsPorBpm);   // ?genero=Pop

module.exports = router;
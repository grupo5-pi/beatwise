var express = require("express");
var router = express.Router();
var controller = require("../controllers/metricaController");

router.get("/caracteristicas", controller.listarCaracteristicas);
router.get("/generos", controller.listarGeneros);
router.post("/contagem", controller.contagem);
router.get("/funcionario/:idFuncionario", controller.listar);
router.get("/:id", controller.buscar);
router.get("/:id/dashboard", controller.dashboard);
router.post("/", controller.cadastrar);
router.put("/:id", controller.atualizar);
router.delete("/:id", controller.excluir);

module.exports = router;
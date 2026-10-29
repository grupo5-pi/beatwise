var express = require("express");
var router = express.Router();
var controller = require("../controllers/metricaController");

router.get("/caracteristicas", controller.listarCaracteristicas);
router.get("/contagem", controller.contagem);
router.get("/funcionario/:idFuncionario", controller.listar);
router.get("/:id", controller.buscar);
router.post("/", controller.cadastrar);
router.put("/:id", controller.atualizar);
router.delete("/:id", controller.excluir);

module.exports = router;

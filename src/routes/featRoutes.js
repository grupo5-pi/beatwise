var express = require("express");
var router = express.Router();
var controller = require("../controllers/featController");

router.post("/recomendar", controller.recomendar);
router.get("/generos", controller.listarGeneros);
router.get("/funcionario/:idFuncionario", controller.listar);
router.post("/", controller.cadastrar);
router.put("/:id", controller.atualizar);
router.delete("/:id", controller.excluir);

module.exports = router;
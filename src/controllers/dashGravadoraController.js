var musicaModel = require("../models/dashGravadoraModel");

function obterDiferencaClipe(req, res) {
  musicaModel.obterDiferencaClipe().then((resultado) => {
    res.status(200).json(resultado);
  }).catch(erro => {
        console.error(erro);
        res.status(500).json(erro);
    });
}

module.exports = {
  obterDiferencaClipe
};
var musicaModel = require("../models/dashGravadoraModel");

function obterDiferencaClipe(req, res) {
  musicaModel.obterDiferencaClipe().then((resultado) => {
    res.status(200).json(resultado);
  }).catch(erro => {
        console.error(erro);
        res.status(500).json(erro);
    });
}

function obterMelhorGenero(req, res) {
  musicaModel.obterMelhorGenero().then((resultado) => {
    res.status(200).json(resultado);
  }).catch(erro => {
    console.error(erro);
    res.status(500).json(erro);
  });
}

function obterMelhorPlataforma(req, res) {
  musicaModel.obterMelhorPlataforma().then((resultado) => {
    res.status(200).json(resultado);
  }).catch(erro => {
    console.error(erro);
    res.status(500).json(erro);
  });
}

function obterFeatSolo(req, res) {
  musicaModel.obterFeatSolo().then((resultado) => {
    res.status(200).json(resultado);
  }).catch(erro => {
    console.error(erro);
    res.status(500).json(erro);
  });
}

function obterTipoAlbum(req, res) {
  musicaModel.obterTipoAlbum().then((resultado) => {
    res.status(200).json(resultado);
  }).catch(erro => {
    console.error(erro);
    res.status(500).json(erro);
  });
}

function obterDiferencaTipoAlbum(req, res) {
  musicaModel.obterDiferencaTipoAlbum().then((resultado) => {
    res.status(200).json(resultado);
  }).catch(erro => {
    console.error(erro);
    res.status(500).json(erro);
  });
}

function obterGeneroEngajamento(req, res) {
  musicaModel.obterGeneroEngajamento().then((resultado) => {
    res.status(200).json(resultado);
  }).catch(erro => {
    console.error(erro);
    res.status(500).json(erro);
  });
}

module.exports = {
  obterDiferencaClipe,
  obterMelhorGenero,
  obterMelhorPlataforma,
  obterFeatSolo,
  obterTipoAlbum,
  obterDiferencaTipoAlbum,
  obterGeneroEngajamento
};
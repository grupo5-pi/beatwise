
var musicaModel = require("../models/musicaModel");

function obterAlbum(req, res) {
  musicaModel.obterAlbum().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function obterArtista(req, res) {
  musicaModel.obterArtista().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function obterMusica(req, res) {
  const limite = Number(req.query.limite);

  musicaModel.obterMusica(limite).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function obterMusicaArtista(req, res) {
  musicaModel.obterMusicaArtista().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function obterSpotify(req, res) {
  const limite = Number(req.query.limite);

  musicaModel.obterSpotify(limite).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function obterYoutube(req, res) {
  const limite = Number(req.query.limite);

  musicaModel.obterYoutube(limite).then((resultado) => {
    res.status(200).json(resultado);
  });
}

function obterTotalMusicas(req, res) {
  musicaModel.obterTotalMusicas().then((resultado) => {
    res.status(200).json(resultado[0].contagem);
  });
}

module.exports = {
  obterAlbum,
  obterArtista,
  obterMusica,
  obterMusicaArtista,
  obterSpotify,
  obterYoutube,
  obterTotalMusicas
};
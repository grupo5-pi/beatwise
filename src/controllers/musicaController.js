
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
  musicaModel.obterMusica().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function obterMusicaArtista(req, res) {
  musicaModel.obterMusicaArtista().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function obterSpotify(req, res) {
  musicaModel.obterSpotify().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function obterYoutube(req, res) {
  musicaModel.obterYoutube().then((resultado) => {
    res.status(200).json(resultado);
  });
}

module.exports = {
  obterAlbum,
  obterArtista,
  obterMusica,
  obterMusicaArtista,
  obterSpotify,
  obterYoutube
};
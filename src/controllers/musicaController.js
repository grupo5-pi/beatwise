
var musicaModel = require("../models/musicaModel");

function obterAlbum(req, res) {
  musicaModel.selectAlbum().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function obterArtista(req, res) {
  musicaModel.selectArtista().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function obterMusica(req, res) {
  musicaModel.selectMusica().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function obterMusicaArtista(req, res) {
  musicaModel.selectMusicaArtista().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function obterSpotify(req, res) {
  musicaModel.selectSpotify().then((resultado) => {
    res.status(200).json(resultado);
  });
}

function obterYoutube(req, res) {
  musicaModel.selectYoutube().then((resultado) => {
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
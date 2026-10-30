var database = require("../database/config");

function obterAlbum() {
  var instrucaoSql = `SELECT * FROM albumBD`;

  return database.executar(instrucaoSql);
}

function obterArtista() {
    var instrucaoSql = `SELECT * FROM artistaBD`;
    
    return database.executar(instrucaoSql);
}

function obterMusica() {
  var instrucaoSql = `SELECT * FROM musicaBD`;

  return database.executar(instrucaoSql);
}

function obterMusicaArtista() {
  var instrucaoSql = `SELECT * FROM musicaArtistaBD`;

  return database.executar(instrucaoSql);
}

function obterSpotify() {
  var instrucaoSql = `SELECT * FROM spotifyBD`;

  return database.executar(instrucaoSql);
}

function obterYoutube() {
  var instrucaoSql = `SELECT * FROM youtubeBD`;

  return database.executar(instrucaoSql);
}

module.exports = { 
    obterAlbum,
    obterArtista,
    obterMusica,
    obterMusicaArtista,
    obterSpotify,
    obterYoutube
};

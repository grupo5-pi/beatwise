var database = require("../database/config");

function selectAlbum() {
  var instrucaoSql = `SELECT * FROM albumBD`;

  return database.executar(instrucaoSql);
}

function selectArtista() {
    var instrucaoSql = `SELECT * FROM artistaBD`;
    
    return database.executar(instrucaoSql);
}

function selectMusica() {
  var instrucaoSql = `SELECT * FROM musicaBD`;

  return database.executar(instrucaoSql);
}

function selectMusicaArtista() {
  var instrucaoSql = `SELECT * FROM musicaArtistaBD`;

  return database.executar(instrucaoSql);
}

function selectSpotify() {
  var instrucaoSql = `SELECT * FROM spotifyBD`;

  return database.executar(instrucaoSql);
}

function selectYoutube() {
  var instrucaoSql = `SELECT * FROM youtubeBD`;

  return database.executar(instrucaoSql);
}

module.exports = { 
    selectAlbum,
    selectArtista,
    selectMusica,
    selectMusicaArtista,
    selectSpotify,
    selectYoutube
};

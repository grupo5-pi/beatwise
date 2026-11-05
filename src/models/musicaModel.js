var database = require("../database/config");

function obterAlbum() {
  var instrucaoSql = `SELECT * FROM albumBD`;

  return database.executar(instrucaoSql);
}

function obterArtista() {
    var instrucaoSql = `SELECT * FROM artistaBD`;
    
    return database.executar(instrucaoSql);
}

function obterMusica(limite) {
  var instrucaoSql = `SELECT * FROM musicaBD WHERE id > ${limite * 10 - 10} LIMIT 10`;

  return database.executar(instrucaoSql);
}

function obterMusicaArtista() {
  var instrucaoSql = `SELECT * FROM musicaArtistaBD`;

  return database.executar(instrucaoSql);
}

function obterSpotify(limite) {
  var instrucaoSql = `SELECT * FROM spotifyBD WHERE id > ${limite * 10 - 10} LIMIT 10`;

  return database.executar(instrucaoSql);
}

function obterYoutube(limite) {
  var instrucaoSql = `SELECT * FROM youtubeBD WHERE id > ${limite * 10 - 10} LIMIT 10`;

  return database.executar(instrucaoSql);
}

function obterTotalMusicas() {
  var instrucaoSql = `SELECT COUNT(*) AS contagem FROM musicaBD`;

  return database.executar(instrucaoSql);
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

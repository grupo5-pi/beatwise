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

// Pesquisa
function pesquisarMusica(palavra, limite) {
  var instrucaoSql = `
    SELECT DISTINCT musica.* FROM musicaBD musica
        LEFT JOIN albumBD album
    ON album.id = musica.fkAlbumBD
        LEFT JOIN musicaArtistaBD musicaArtista
    ON musicaArtista.fkMusicaBD = musica.id
        LEFT JOIN artistaBD artista
    ON artista.id = musicaArtista.fkArtistaBD
      WHERE
        musica.nome LIKE '${palavra}%' OR album.nome LIKE '${palavra}%' OR artista.nome LIKE '${palavra}%'
    ORDER BY musica.id LIMIT 10 OFFSET ${limite * 10 - 10}`;

  return database.executar(instrucaoSql);
}

function pesquisarSpotify(palavra, limite) {
  var instrucaoSql = `
    SELECT spotify.* FROM spotifyBD spotify
        RIGHT JOIN musicaBD musica
          ON spotify.fkMusicaBD = musica.id
        LEFT JOIN albumBD album
          ON album.id = musica.fkAlbumBD
        LEFT JOIN musicaArtistaBD musicaArtista
          ON musicaArtista.fkMusicaBD = musica.id
        LEFT JOIN artistaBD artista
          ON artista.id = musicaArtista.fkArtistaBD
      WHERE (musica.nome LIKE '${palavra}%' OR album.nome LIKE '${palavra}%' OR artista.nome LIKE '${palavra}%')
        ORDER BY musica.id LIMIT 10 OFFSET ${(limite - 1) * 10}`;

  return database.executar(instrucaoSql);
}

function pesquisarYoutube(palavra, limite) {
  var instrucaoSql = `
    SELECT youtube.* FROM youtubeBD youtube
        RIGHT JOIN musicaBD musica
          ON youtube.fkMusicaBD = musica.id
        LEFT JOIN albumBD album
          ON album.id = musica.fkAlbumBD
        LEFT JOIN musicaArtistaBD musicaArtista
          ON musicaArtista.fkMusicaBD = musica.id
        LEFT JOIN artistaBD artista
          ON artista.id = musicaArtista.fkArtistaBD
      WHERE (musica.nome LIKE '${palavra}%' OR album.nome LIKE '${palavra}%' OR artista.nome LIKE '${palavra}%')
        ORDER BY musica.id LIMIT 10 OFFSET ${(limite - 1) * 10}`;

  return database.executar(instrucaoSql);
}

function contarPesquisaMusica(palavra) {
  var instrucaoSql = `
    SELECT COUNT(DISTINCT musica.id) AS contagem FROM musicaBD musica
        LEFT JOIN albumBD album
          ON album.id = musica.fkAlbumBD
        LEFT JOIN musicaArtistaBD musicaArtista
          ON musicaArtista.fkMusicaBD = musica.id
        LEFT JOIN artistaBD artista
          ON artista.id = musicaArtista.fkArtistaBD
        WHERE (musica.nome LIKE '${palavra}%' OR album.nome LIKE '${palavra}%' OR artista.nome LIKE '${palavra}%')`;

  return database.executar(instrucaoSql);
}

module.exports = {
  obterAlbum,
  obterArtista,
  obterMusica,
  obterMusicaArtista,
  obterSpotify,
  obterYoutube,
  obterTotalMusicas,
  pesquisarMusica,
  pesquisarSpotify,
  pesquisarYoutube,
  contarPesquisaMusica
};

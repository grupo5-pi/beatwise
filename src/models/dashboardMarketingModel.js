var database = require("../database/config");

// Música com maior taxa de likes/views da base toda + taxa média da base
function melhorEngajamento() {
    var instrucaoSql = `
        SELECT m.nome,
               y.visitas + 0 AS views,
               y.curtidas AS likes,
               y.curtidas / (y.visitas + 0) * 100 AS taxa,
               (SELECT AVG(curtidas / (visitas + 0)) * 100
                FROM youtubeBD
                WHERE visitas + 0 > 0) AS mediaBase
        FROM youtubeBD y
        JOIN musicaBD m ON m.id = y.fkMusicaBD
        WHERE y.visitas + 0 >= 1000000
        ORDER BY y.curtidas / (y.visitas + 0) DESC
        LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

// Maior desbalanceamento entre YouTube e Spotify da base toda
// (mínimo de 1 milhão em cada plataforma)
function desbalanceio() {
    var instrucaoSql = `
        SELECT m.nome,
               y.visitas + 0 AS views,
               s.fluxo + 0 AS streams
        FROM musicaBD m
        JOIN youtubeBD y ON y.fkMusicaBD = m.id
        JOIN spotifyBD s ON s.fkMusicaBD = m.id
        WHERE y.visitas + 0 >= 1000000 AND s.fluxo + 0 >= 1000000
        ORDER BY GREATEST(y.visitas + 0, s.fluxo + 0) / LEAST(y.visitas + 0, s.fluxo + 0) DESC
        LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

function engajamentoClipe() {
    var instrucaoSql = `
        SELECT videoOficial AS clipe,
               SUM(IFNULL(curtidas, 0) + IFNULL(comentarios, 0)) / SUM(visitas + 0) * 100 AS taxa
        FROM youtubeBD
        WHERE visitas + 0 > 0
        GROUP BY videoOficial;
    `;
    return database.executar(instrucaoSql);
}

function engajamentoFeat() {
    var instrucaoSql = `
        SELECT IF(a.qtd > 1, 1, 0) AS feat,
               SUM(IFNULL(y.curtidas, 0) + IFNULL(y.comentarios, 0)) / SUM(y.visitas + 0) * 100 AS taxa
        FROM youtubeBD y
        JOIN (SELECT fkMusicaBD, COUNT(*) AS qtd
              FROM musicaArtistaBD
              GROUP BY fkMusicaBD) a ON a.fkMusicaBD = y.fkMusicaBD
        WHERE y.visitas + 0 > 0
        GROUP BY IF(a.qtd > 1, 1, 0);
    `;
    return database.executar(instrucaoSql);
}

function mediaPlataformas() {
    var instrucaoSql = `
        SELECT AVG(s.fluxo + 0) AS spotify,
               AVG(y.visitas + 0) AS youtube
        FROM spotifyBD s
        JOIN youtubeBD y ON y.fkMusicaBD = s.fkMusicaBD
        WHERE s.fluxo + 0 > 0 AND y.visitas + 0 > 0;
    `;
    return database.executar(instrucaoSql);
}

function topYoutube() {
    var instrucaoSql = `
        SELECT m.nome,
               y.visitas + 0 AS views,
               y.curtidas AS likes
        FROM youtubeBD y
        JOIN musicaBD m ON m.id = y.fkMusicaBD
        WHERE y.visitas + 0 > 0
        ORDER BY y.visitas + 0 DESC
        LIMIT 30;
    `;
    return database.executar(instrucaoSql);
}

function topSpotify() {
    var instrucaoSql = `
        SELECT m.nome,
               s.fluxo + 0 AS streamings
        FROM spotifyBD s
        JOIN musicaBD m ON m.id = s.fkMusicaBD
        WHERE s.fluxo + 0 > 0
        ORDER BY s.fluxo + 0 DESC
        LIMIT 30;
    `;
    return database.executar(instrucaoSql);
}

// Músicas com views e soma de views por tipo de lançamento (Feat/Solo x Single/Álbum)
// Single = álbum com apenas 1 música na base; Álbum = álbum com 2 ou mais
function tiposLancamento() {
    var instrucaoSql = `
        SELECT CONCAT(IF(a.qtd > 1, 'Feat', 'Solo'), ' - ',
                      IF(al.qtd = 1, 'Single', 'Álbum')) AS grupo,
               COUNT(DISTINCT m.id) AS quantidade,
               SUM(y.visitas + 0) AS totalViews
        FROM musicaBD m
        JOIN youtubeBD y ON y.fkMusicaBD = m.id
        JOIN (SELECT fkMusicaBD, COUNT(*) AS qtd
              FROM musicaArtistaBD
              GROUP BY fkMusicaBD) a ON a.fkMusicaBD = m.id
        JOIN (SELECT fkAlbumBD, COUNT(*) AS qtd
              FROM musicaBD
              GROUP BY fkAlbumBD) al ON al.fkAlbumBD = m.fkAlbumBD
        WHERE y.visitas + 0 > 0
        GROUP BY grupo;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    melhorEngajamento,
    desbalanceio,
    engajamentoClipe,
    engajamentoFeat,
    mediaPlataformas,
    topYoutube,
    topSpotify,
    tiposLancamento
};
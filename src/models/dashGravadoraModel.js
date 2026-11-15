var database = require("../database/config");

function obterDiferencaClipe() {
  var instrucaoSql = `
    SELECT 
	    (SELECT SUM(visitas) FROM youtubeBD WHERE videoOficial = 1) AS comClipe, 
        (SELECT SUM(visitas) FROM youtubeBD WHERE videoOficial = 0)	AS semClipe, 
        (((SELECT SUM(visitas) FROM youtubeBD WHERE videoOficial = 1) - (SELECT SUM(visitas) FROM youtubeBD WHERE videoOficial = 0)) / (SELECT SUM(visitas) FROM youtubeBD WHERE videoOficial = 0)) * 100 AS porcentagem
    FROM youtubeBD LIMIT 1`;

  return database.executar(instrucaoSql);
}

function obterMelhorGenero() {
  var instrucaoSql = `
    SELECT
        m.generoPadrao AS genero,
        AVG(s.fluxo) AS mediaGenero,
        geral.media AS mediaGeral,
        ((AVG(s.fluxo) - geral.media) / geral.media) * 100 AS porcentagem
    FROM musicaBD m
    JOIN spotifyBD s ON s.fkMusicaBD = m.id
    JOIN (
        SELECT AVG(s2.fluxo) AS media
        FROM spotifyBD s2
        JOIN musicaBD m2 ON m2.id = s2.fkMusicaBD
        WHERE m2.generoPadrao IS NOT NULL
    ) AS geral
    WHERE m.generoPadrao IS NOT NULL
    GROUP BY m.generoPadrao, geral.media
    ORDER BY mediaGenero DESC
    LIMIT 1`;

  return database.executar(instrucaoSql);
}

function obterMelhorPlataforma() {
  var instrucaoSql = `
    SELECT
        spotify,
        youtube,
        CASE WHEN youtube > spotify THEN 'YouTube' ELSE 'Spotify' END AS plataforma,
        (ABS(youtube - spotify) / LEAST(youtube, spotify)) * 100 AS porcentagem
    FROM (
        SELECT
            (SELECT SUM(fluxo) FROM spotifyBD
                WHERE fkMusicaBD IN (SELECT fkMusicaBD FROM youtubeBD)) AS spotify,
            (SELECT SUM(visitas) FROM youtubeBD
                WHERE fkMusicaBD IN (SELECT fkMusicaBD FROM spotifyBD)) AS youtube
    ) AS totais`;

  return database.executar(instrucaoSql);
}

function obterFeatSolo() {
  var instrucaoSql = `
    SELECT
        engajamentoFeat,
        engajamentoSolo,
        CASE WHEN engajamentoFeat > engajamentoSolo THEN 'Feat' ELSE 'Solo' END AS vencedor,
        (ABS(engajamentoFeat - engajamentoSolo) / LEAST(engajamentoFeat, engajamentoSolo)) * 100 AS porcentagem
    FROM (
        SELECT
            SUM(CASE WHEN qtd.artistas > 1 THEN COALESCE(y.curtidas, 0) + COALESCE(y.comentarios, 0) END)
              / SUM(CASE WHEN qtd.artistas > 1 THEN y.visitas END) * 100 AS engajamentoFeat,
            SUM(CASE WHEN qtd.artistas = 1 THEN COALESCE(y.curtidas, 0) + COALESCE(y.comentarios, 0) END)
              / SUM(CASE WHEN qtd.artistas = 1 THEN y.visitas END) * 100 AS engajamentoSolo
        FROM youtubeBD y
        JOIN (
            SELECT fkMusicaBD, COUNT(*) AS artistas
            FROM musicaArtistaBD
            GROUP BY fkMusicaBD
        ) AS qtd ON qtd.fkMusicaBD = y.fkMusicaBD
    ) AS engajamento`;

  return database.executar(instrucaoSql);
}


function obterTipoAlbum() {
  var instrucaoSql = `
    SELECT
        categoria,
        SUM(fluxo) AS total,
        ROUND(SUM(fluxo) * 100 / SUM(SUM(fluxo)) OVER (), 1) AS porcentagem
    FROM (
        SELECT
            CONCAT(
                CASE WHEN art.qtd > 1 THEN 'Feat' ELSE 'Solo' END,
                ' - ',
                CASE WHEN alb.qtd = 1 THEN 'Single' ELSE 'Álbum' END
            ) AS categoria,
            s.fluxo
        FROM spotifyBD s
        JOIN musicaBD m ON m.id = s.fkMusicaBD
        JOIN (
            SELECT fkMusicaBD, COUNT(*) AS qtd
            FROM musicaArtistaBD
            GROUP BY fkMusicaBD
        ) AS art ON art.fkMusicaBD = m.id
        JOIN (
            SELECT fkAlbumBD, COUNT(*) AS qtd
            FROM musicaBD
            GROUP BY fkAlbumBD
        ) AS alb ON alb.fkAlbumBD = m.fkAlbumBD
    ) AS base
    GROUP BY categoria`;

  return database.executar(instrucaoSql);
}

function obterDiferencaTipoAlbum() {

}

function obterGeneroEngajamento() {
    
}

module.exports = {
  obterDiferencaClipe,
  obterMelhorGenero,
  obterMelhorPlataforma,
  obterFeatSolo,  
  obterTipoAlbum,
  obterDiferencaTipoAlbum,
  obterGeneroEngajamento,
};

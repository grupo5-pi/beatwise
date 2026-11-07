var database = require("../database/config");

function buscarPorId(id) {
    var instrucaoSql = `
        SELECT a.id, a.nome,
            COUNT(DISTINCT m.id) AS totalMusicas,
            SUM(s.fluxo) AS streams,
            SUM(y.visitas) AS views,
            SUM(y.curtidas) AS curtidas,
            SUM(y.comentarios) AS comentarios,
            AVG(s.dancabilidade) AS dancabilidade,
            AVG(s.energia) AS energia,
            AVG(s.valenciaPositividade) AS valencia,
            AVG(s.acustica) AS acustica,
            AVG(s.instrumentalidade) AS instrumentalidade,
            AVG(s.tempoBPM) AS bpm,
            AVG(s.duracaoMs) AS duracaoMs
        FROM artistaBD a
        JOIN musicaArtistaBD ma ON ma.fkArtistaBD = a.id
        JOIN musicaBD m ON m.id = ma.fkMusicaBD
        LEFT JOIN spotifyBD s ON s.fkMusicaBD = m.id
        LEFT JOIN youtubeBD y ON y.fkMusicaBD = m.id
        WHERE a.id = ?
        GROUP BY a.id, a.nome;
    `;
    return database.executar(instrucaoSql, [id]);
}

module.exports = { buscarPorId };

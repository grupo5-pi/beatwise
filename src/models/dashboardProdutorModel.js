var database = require("../database/config");

var SO_GENEROS_REAIS = "m.generoPadrao IS NOT NULL AND m.generoPadrao <> 'Outros'";


var VIEWS = "CAST(y.visitas AS DECIMAL(20,0))";
var STREAMS = "CAST(s.fluxo AS DECIMAL(20,0))";


function totaisPorGenero() {
    var instrucaoSql = `
        SELECT m.generoPadrao AS genero,
               SUM(${VIEWS}) AS views,
               SUM(y.curtidas) AS curtidas,
               SUM(${STREAMS}) AS streams
        FROM musicaBD m
        JOIN youtubeBD y ON y.fkMusicaBD = m.id
        JOIN spotifyBD s ON s.fkMusicaBD = m.id
        WHERE ${SO_GENEROS_REAIS}
        GROUP BY m.generoPadrao;
    `;
    return database.executar(instrucaoSql);
}

function ultimoSnapshot() {
    var instrucaoSql = `
        SELECT genero, views, curtidas, streams
        FROM snapshotGenero
        WHERE dataAtualizacao = (SELECT MAX(dataAtualizacao) FROM snapshotGenero);
    `;
    return database.executar(instrucaoSql);
}

function snapshotAnterior() {
    var instrucaoSql = `
        SELECT genero, views, curtidas, streams
        FROM snapshotGenero
        WHERE dataAtualizacao = (
            SELECT MAX(dataAtualizacao) FROM snapshotGenero
            WHERE dataAtualizacao < (SELECT MAX(dataAtualizacao) FROM snapshotGenero)
        );
    `;
    return database.executar(instrucaoSql);
}

function salvarSnapshot(linhas) {
    var tuplas = [];
    var valores = [];
    for (var i = 0; i < linhas.length; i++) {
        tuplas.push("(NOW(), ?, ?, ?, ?)");
        valores.push(linhas[i].genero, linhas[i].views, linhas[i].curtidas, linhas[i].streams);
    }
    var instrucaoSql = `
        INSERT INTO snapshotGenero (dataAtualizacao, genero, views, curtidas, streams)
        VALUES ${tuplas.join(", ")};
    `;
    return database.executar(instrucaoSql, valores);
}


function mediasPorDesempenho(ordem, quantidade) {
    var instrucaoSql = `
        SELECT AVG(t.energia) AS energia, AVG(t.dancabilidade) AS dancabilidade,
               AVG(t.valencia) AS valencia, AVG(t.acustica) AS acustica, AVG(t.bpm) AS bpm,
               COUNT(*) AS total
        FROM (
            SELECT s.energia, s.dancabilidade, s.valenciaPositividade AS valencia,
                   s.acustica, s.tempoBPM AS bpm
            FROM musicaBD m
            JOIN spotifyBD s ON s.fkMusicaBD = m.id
            JOIN youtubeBD y ON y.fkMusicaBD = m.id
            WHERE ${VIEWS} > 0 AND s.tempoBPM > 0
            ORDER BY ${VIEWS} ${ordem === "ASC" ? "ASC" : "DESC"}, m.id
            LIMIT ${Number(quantidade)}
        ) t;
    `;
    return database.executar(instrucaoSql);
}

function desvioDasCaracteristicas() {
    var instrucaoSql = `
        SELECT STDDEV_POP(s.energia) AS energia, STDDEV_POP(s.dancabilidade) AS dancabilidade,
               STDDEV_POP(s.valenciaPositividade) AS valencia, STDDEV_POP(s.acustica) AS acustica,
               STDDEV_POP(s.tempoBPM) AS bpm
        FROM musicaBD m
        JOIN spotifyBD s ON s.fkMusicaBD = m.id
        JOIN youtubeBD y ON y.fkMusicaBD = m.id
        WHERE ${VIEWS} > 0 AND s.tempoBPM > 0;
    `;
    return database.executar(instrucaoSql);
}


function listarGeneros() {
    var instrucaoSql = `
        SELECT m.generoPadrao AS genero, COUNT(*) AS total
        FROM musicaBD m
        JOIN spotifyBD s ON s.fkMusicaBD = m.id
        JOIN youtubeBD y ON y.fkMusicaBD = m.id
        WHERE ${SO_GENEROS_REAIS}
        GROUP BY m.generoPadrao
        ORDER BY total DESC;
    `;
    return database.executar(instrucaoSql);
}

function viewsPorFaixaBpm(genero) {
    var instrucaoSql = `
        SELECT FLOOR(s.tempoBPM / 10) * 10 AS faixa,
               COUNT(*) AS total,
               AVG(${VIEWS}) AS views
        FROM musicaBD m
        JOIN spotifyBD s ON s.fkMusicaBD = m.id
        JOIN youtubeBD y ON y.fkMusicaBD = m.id
        WHERE m.generoPadrao = ? AND s.tempoBPM >= 60 AND s.tempoBPM < 180
        GROUP BY faixa
        ORDER BY faixa;
    `;
    return database.executar(instrucaoSql, [genero]);
}

function mediaViewsDoGenero(genero) {
    var instrucaoSql = `
        SELECT AVG(${VIEWS}) AS views
        FROM musicaBD m
        JOIN youtubeBD y ON y.fkMusicaBD = m.id
        WHERE m.generoPadrao = ?;
    `;
    return database.executar(instrucaoSql, [genero]);
}

module.exports = {
    totaisPorGenero, ultimoSnapshot, snapshotAnterior, salvarSnapshot,
    mediasPorDesempenho, desvioDasCaracteristicas,
    listarGeneros, viewsPorFaixaBpm, mediaViewsDoGenero
};
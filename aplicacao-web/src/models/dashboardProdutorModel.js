var database = require("../database/config");
var SO_GENEROS_REAIS = "g.nome IS NOT NULL AND g.nome <> 'Outros'";

var VIEWS = "CAST(y.visitas AS DECIMAL(20,0))";
var STREAMS = "CAST(s.fluxo AS DECIMAL(20,0))";

function montarFiltro(filtro) {
    var condicoes = [];
    var valores = [];

    if (filtro.anoInicio != null) {
        condicoes.push("m.anoLancamento >= ?");
        valores.push(filtro.anoInicio);
    }

    if (filtro.anoFim != null) {
        condicoes.push("m.anoLancamento <= ?");
        valores.push(filtro.anoFim);
    }

    if (filtro.generos && filtro.generos.length > 0) {
        var interrogacoes = filtro.generos.map(function () {
            return "?";
        });

        condicoes.push("g.nome IN (" + interrogacoes.join(", ") + ")");

        for (var i = 0; i < filtro.generos.length; i++) {
            valores.push(filtro.generos[i]);
        }
    }

    var where = "";
    if (condicoes.length > 0) {
        where = " AND " + condicoes.join(" AND ");
    }
    return {
        where: where,
        valores: valores
    };
}


function totaisPorGenero() {
    var instrucaoSql = `
        SELECT
            g.nome AS genero,
            SUM(${VIEWS}) AS views,
            SUM(y.curtidas) AS curtidas,
            SUM(${STREAMS}) AS streams
        FROM musicaBD m
        JOIN genero g ON g.id = m.fkGenero
        JOIN youtubeBD y ON y.fkMusicaBD = m.id
        JOIN spotifyBD s ON s.fkMusicaBD = m.id
        WHERE ${SO_GENEROS_REAIS}
        GROUP BY g.id, g.nome;
    `;
    return database.executar(instrucaoSql);
}


// ÚLTIMO SNAPSHOT
function ultimoSnapshot() {
    var instrucaoSql = `
        SELECT
            g.nome AS genero,
            sg.views,
            sg.curtidas,
            sg.streams
        FROM snapshotGenero sg
        JOIN genero g ON g.id = sg.fkGenero
        WHERE sg.dataAtualizacao = (
            SELECT MAX(dataAtualizacao)
            FROM snapshotGenero
        );
    `;
    return database.executar(instrucaoSql);
}

function snapshotAnterior() {
    var instrucaoSql = `
        SELECT
            g.nome AS genero,
            sg.views,
            sg.curtidas,
            sg.streams
        FROM snapshotGenero sg
        JOIN genero g ON g.id = sg.fkGenero
        WHERE sg.dataAtualizacao = (
            SELECT MAX(dataAtualizacao)
            FROM snapshotGenero
            WHERE dataAtualizacao < (
                SELECT MAX(dataAtualizacao)
                FROM snapshotGenero
            )
        );
    `;

    return database.executar(instrucaoSql);
}

function salvarSnapshot(linhas) {
    var tuplas = [];
    var valores = [];
    for (var i = 0; i < linhas.length; i++) {
        tuplas.push(`
            (
                NOW(),
                (SELECT id FROM genero WHERE nome = ?),
                ?, ?, ?
            )
        `);

        valores.push(
            linhas[i].genero,
            linhas[i].views,
            linhas[i].curtidas,
            linhas[i].streams
        );
    }

    if (tuplas.length === 0) {
        return Promise.resolve();
    }

    var instrucaoSql = `
        INSERT INTO snapshotGenero
            (dataAtualizacao, fkGenero, views, curtidas, streams)
        VALUES ${tuplas.join(", ")};
    `;
    return database.executar(instrucaoSql, valores);
}


// MÉDIAS DAS CARACTERÍSTICAS POR DESEMPENHO
function mediasPorDesempenho(ordem, quantidade) {
    var instrucaoSql = `
        SELECT
            AVG(t.energia) AS energia,
            AVG(t.dancabilidade) AS dancabilidade,
            AVG(t.valencia) AS valencia,
            AVG(t.acustica) AS acustica,
            AVG(t.bpm) AS bpm,
            COUNT(*) AS total
        FROM (
            SELECT
                s.energia,
                s.dancabilidade,
                s.valenciaPositividade AS valencia,
                s.acustica,
                s.tempoBPM AS bpm
            FROM musicaBD m
            JOIN spotifyBD s ON s.fkMusicaBD = m.id
            JOIN youtubeBD y ON y.fkMusicaBD = m.id
            WHERE ${VIEWS} > 0
                AND s.tempoBPM > 0
            ORDER BY
                ${VIEWS} ${ordem === "ASC" ? "ASC" : "DESC"},
                m.id
            LIMIT ${Number(quantidade)}
        ) t;
    `;
    return database.executar(instrucaoSql);
}


// DESVIO PADRÃO DAS CARACTERÍSTICAS
function desvioDasCaracteristicas() {
    var instrucaoSql = `
        SELECT
            STDDEV_POP(s.energia) AS energia,
            STDDEV_POP(s.dancabilidade) AS dancabilidade,
            STDDEV_POP(s.valenciaPositividade) AS valencia,
            STDDEV_POP(s.acustica) AS acustica,
            STDDEV_POP(s.tempoBPM) AS bpm
        FROM musicaBD m
        JOIN spotifyBD s ON s.fkMusicaBD = m.id
        JOIN youtubeBD y ON y.fkMusicaBD = m.id
        WHERE ${VIEWS} > 0
            AND s.tempoBPM > 0;
    `;
    return database.executar(instrucaoSql);
}


function listarGeneros() {
    var instrucaoSql = `
        SELECT
            g.nome AS genero,
            COUNT(*) AS total
        FROM musicaBD m
        JOIN genero g ON g.id = m.fkGenero
        JOIN spotifyBD s ON s.fkMusicaBD = m.id
        JOIN youtubeBD y ON y.fkMusicaBD = m.id
        WHERE ${SO_GENEROS_REAIS}
        GROUP BY g.id, g.nome
        ORDER BY total DESC;
    `;
    return database.executar(instrucaoSql);
}

function viewsPorFaixaBpm(genero) {
    var instrucaoSql = `
        SELECT
            FLOOR(s.tempoBPM / 10) * 10 AS faixa,
            COUNT(*) AS total,
            AVG(${VIEWS}) AS views
        FROM musicaBD m
        JOIN genero g ON g.id = m.fkGenero
        JOIN spotifyBD s ON s.fkMusicaBD = m.id
        JOIN youtubeBD y ON y.fkMusicaBD = m.id
        WHERE g.nome = ?
            AND s.tempoBPM >= 60
            AND s.tempoBPM < 180
        GROUP BY faixa
        ORDER BY faixa;
    `;
    return database.executar(instrucaoSql, [genero]);
}

function mediaViewsDoGenero(genero) {
    var instrucaoSql = `
        SELECT AVG(${VIEWS}) AS views
        FROM musicaBD m
        JOIN genero g ON g.id = m.fkGenero
        JOIN youtubeBD y ON y.fkMusicaBD = m.id
        WHERE g.nome = ?;
    `;
    return database.executar(instrucaoSql, [genero]);
}

function musicasParaDispersao() {
    var instrucaoSql = `
        SELECT
            m.nome AS titulo,
            (
                SELECT GROUP_CONCAT(a.nome SEPARATOR ', ')
                FROM musicaArtistaBD ma
                JOIN artistaBD a ON a.id = ma.fkArtistaBD
                WHERE ma.fkMusicaBD = m.id
            ) AS artista,
            ${VIEWS} AS views,
            s.dancabilidade,
            s.energia,
            s.tonalidade,
            s.acustica,
            s.vivicidade,
            s.valenciaPositividade,
            s.tempoBPM
        FROM musicaBD m
        JOIN spotifyBD s ON s.fkMusicaBD = m.id
        JOIN youtubeBD y ON y.fkMusicaBD = m.id
        WHERE ${VIEWS} BETWEEN 100000000 AND 10000000000
            AND s.dancabilidade IS NOT NULL
            AND s.energia IS NOT NULL
            AND s.tonalidade IS NOT NULL
            AND s.acustica IS NOT NULL
            AND s.vivicidade IS NOT NULL
            AND s.valenciaPositividade IS NOT NULL
            AND s.tempoBPM > 0
            AND MOD(m.id, 10) = 0
        ORDER BY views DESC
        LIMIT 3000;
    `;
    return database.executar(instrucaoSql);
}

function streamsPorBlocoDuracao() {
    var instrucaoSql = `
        SELECT
            FLOOR(s.duracaoMs / 30000) AS bloco,
            COUNT(*) AS total,
            AVG(${STREAMS}) AS streams
        FROM spotifyBD s
        WHERE s.duracaoMs BETWEEN 60000 AND 600000
            AND ${STREAMS} > 0
        GROUP BY bloco
        ORDER BY bloco;
    `;
    return database.executar(instrucaoSql);
}

function consultaRadarBase(filtro, limite) {
    var instrucaoSql = `
        SELECT
            s.tempoBPM AS bpm,
            s.energia AS energia,
            s.valenciaPositividade AS valencia,
            s.dancabilidade AS dancabilidade,
            s.tonalidade AS tonalidade
        FROM musicaBD m
        JOIN genero g ON g.id = m.fkGenero
        JOIN spotifyBD s ON s.fkMusicaBD = m.id
        JOIN youtubeBD y ON y.fkMusicaBD = m.id
        WHERE ${VIEWS} > 0
            AND s.tempoBPM > 0
            ${filtro.where}
    `;

    if (limite) {
        instrucaoSql += `
            ORDER BY ${VIEWS} DESC, m.id
            LIMIT ${Number(limite)}
        `;
    }
    return instrucaoSql;
}

function mediasRadar(filtro, limite) {
    var f = montarFiltro(filtro);

    var instrucaoSql = `
        SELECT
            AVG(t.bpm) AS bpm,
            AVG(t.energia) AS energia,
            AVG(t.valencia) AS valencia,
            AVG(t.dancabilidade) AS dancabilidade,
            COUNT(*) AS total
        FROM (${consultaRadarBase(f, limite)}) t;
    `;
    return database.executar(instrucaoSql, f.valores);
}


function tonalidadeMaisComum(filtro, limite) {
    var f = montarFiltro(filtro);

    var instrucaoSql = `
        SELECT
            t.tonalidade AS tonalidade,
            COUNT(*) AS total
        FROM (${consultaRadarBase(f, limite)}) t
        WHERE t.tonalidade >= 0
        GROUP BY t.tonalidade
        ORDER BY total DESC, t.tonalidade
        LIMIT 1;
    `;
    return database.executar(instrucaoSql, f.valores);
}

function streamsPorGenero(filtro) {
    var f = montarFiltro(filtro);

    var instrucaoSql = `
        SELECT
            g.nome AS genero,
            SUM(${STREAMS}) AS streams
        FROM musicaBD m
        JOIN genero g ON g.id = m.fkGenero
        JOIN spotifyBD s ON s.fkMusicaBD = m.id
        WHERE ${SO_GENEROS_REAIS}
            AND ${STREAMS} > 0
            ${f.where}
        GROUP BY g.id, g.nome
        ORDER BY streams DESC;
    `;

    return database.executar(instrucaoSql, f.valores);
}

module.exports = {
    totaisPorGenero,
    ultimoSnapshot,
    snapshotAnterior,
    salvarSnapshot,
    mediasPorDesempenho,
    desvioDasCaracteristicas,
    listarGeneros,
    viewsPorFaixaBpm,
    mediaViewsDoGenero,
    musicasParaDispersao,
    streamsPorBlocoDuracao,
    mediasRadar,
    tonalidadeMaisComum,
    streamsPorGenero
};
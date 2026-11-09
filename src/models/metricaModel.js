var database = require("../database/config");
var CARACTERISTICAS = require("./caracteristicas").CARACTERISTICAS;

var CAMPOS = `
    id, nome, periodo, anoInicio, anoFim, generos,
    caracteristicas, totalMusicas, dataCriacao
`;

var ORDENACOES = {
    recentes: "dataCriacao DESC, id DESC",
    antigas: "dataCriacao ASC, id ASC",
    nome: "nome ASC",
    musicas: "totalMusicas DESC"
};

function listar(idFuncionario, busca, ordem) {
    var ordenarPor = ORDENACOES[ordem] || ORDENACOES.recentes;
    var instrucaoSql = `
        SELECT ${CAMPOS}
        FROM metricaDash
        WHERE fkFuncionario = ? AND nome LIKE ?
        ORDER BY ${ordenarPor};
    `;
    return database.executar(instrucaoSql, [idFuncionario, "%" + (busca || "") + "%"]);
}

function buscarPorId(id, idFuncionario) {
    var instrucaoSql = `
        SELECT ${CAMPOS}
        FROM metricaDash
        WHERE id = ? AND fkFuncionario = ?;
    `;
    return database.executar(instrucaoSql, [id, idFuncionario]);
}

function cadastrar(a, idFuncionario) {
    var instrucaoSql = `
        INSERT INTO metricaDash
            (nome, periodo, anoInicio, anoFim, generos, caracteristicas,
             totalMusicas, dataCriacao, fkFuncionario)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?);
    `;
    return database.executar(instrucaoSql, [
        a.nome, a.periodo, a.anoInicio, a.anoFim, a.generos,
        JSON.stringify(a.caracteristicas), a.totalMusicas, idFuncionario
    ]);
}

function atualizar(id, a, idFuncionario) {
    var instrucaoSql = `
        UPDATE metricaDash SET
            nome = ?, periodo = ?, anoInicio = ?, anoFim = ?, generos = ?,
            caracteristicas = ?, totalMusicas = ?
        WHERE id = ? AND fkFuncionario = ?;
    `;
    return database.executar(instrucaoSql, [
        a.nome, a.periodo, a.anoInicio, a.anoFim, a.generos,
        JSON.stringify(a.caracteristicas), a.totalMusicas, id, idFuncionario
    ]);
}

function excluir(id, idFuncionario) {
    var instrucaoSql = `DELETE FROM metricaDash WHERE id = ? AND fkFuncionario = ?;`;
    return database.executar(instrucaoSql, [id, idFuncionario]);
}

function listarGeneros() {
    var instrucaoSql = `
        SELECT genero, COUNT(*) AS total
        FROM musicaBD
        WHERE genero IS NOT NULL AND genero <> ''
        GROUP BY genero
        ORDER BY total DESC, genero ASC;
    `;
    return database.executar(instrucaoSql);
}

function montarFiltro(filtros) {
    var condicoes = [];
    var valores = [];

    var faixas = filtros.caracteristicas || {};
    for (var coluna in faixas) {
        if (!CARACTERISTICAS[coluna]) continue;
        condicoes.push("s." + coluna + " BETWEEN ? AND ?");
        valores.push(faixas[coluna][0], faixas[coluna][1]);
    }

    if (filtros.generos && filtros.generos.length) {
        condicoes.push("m.genero IN (?)");
        valores.push(filtros.generos);
    }

    if (filtros.anoInicio && filtros.anoFim) {
        condicoes.push("m.anoLancamento BETWEEN ? AND ?");
        valores.push(filtros.anoInicio, filtros.anoFim);
    }

    return {
        where: condicoes.length ? "WHERE " + condicoes.join(" AND ") : "",
        valores: valores
    };
}

function contarMusicas(filtros) {
    var filtro = montarFiltro(filtros);
    var instrucaoSql = `
        SELECT COUNT(DISTINCT s.fkMusicaBD) AS total
        FROM spotifyBD s
        JOIN musicaBD m ON m.id = s.fkMusicaBD
        ${filtro.where};
    `;
    return database.executar(instrucaoSql, filtro.valores);
}

function listarMusicasFiltradas(filtros) {
    var filtro = montarFiltro(filtros);
    var instrucaoSql = `
        SELECT
            m.id,
            m.nome AS titulo,
            m.genero,
            m.anoLancamento,
            (SELECT MIN(a.nome)
               FROM musicaArtistaBD ma
               JOIN artistaBD a ON a.id = ma.fkArtistaBD
              WHERE ma.fkMusicaBD = m.id) AS artista,
            s.dancabilidade, s.energia, s.tonalidade, s.acustica,
            s.vivicidade, s.valenciaPositividade, s.tempoBPM,
            CAST(s.duracaoMs AS DECIMAL(20)) AS duracaoMs,
            CAST(s.fluxo AS DECIMAL(20)) AS streams,
            (SELECT MAX(CAST(y.visitas AS DECIMAL(20)))
               FROM youtubeBD y
              WHERE y.fkMusicaBD = m.id) AS views
        FROM spotifyBD s
        JOIN musicaBD m ON m.id = s.fkMusicaBD
        ${filtro.where};
    `;
    return database.executar(instrucaoSql, filtro.valores);
}

module.exports = {
    listar, buscarPorId, cadastrar, atualizar, excluir,
    listarGeneros, contarMusicas, listarMusicasFiltradas
};
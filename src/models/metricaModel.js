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

function contarMusicas(filtros) {
    var condicoes = [];
    var valores = [];
    for (var coluna in filtros) {
        if (!CARACTERISTICAS[coluna]) continue;
        condicoes.push(coluna + " BETWEEN ? AND ?");
        valores.push(filtros[coluna][0], filtros[coluna][1]);
    }

    var instrucaoSql = `
        SELECT COUNT(DISTINCT fkMusicaBD) AS total
        FROM spotifyBD
        ${condicoes.length ? "WHERE " + condicoes.join(" AND ") : ""};
    `;
    return database.executar(instrucaoSql, valores);
}

module.exports = { listar, buscarPorId, cadastrar, atualizar, excluir, contarMusicas };

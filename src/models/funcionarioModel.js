var database = require("../database/config");

function buscarPorId(id) {
    var instrucaoSql = `
        SELECT f.nome, f.email, f.foto, e.razaoSocial AS empresa, c.nome AS cargo
        FROM funcionario f
        JOIN empresa e ON e.id = f.fkEmpresa
        JOIN cargo c ON c.id = f.fkCargo
        WHERE f.id = ${id};
    `;
    return database.executar(instrucaoSql);
}

function verificarSenha(id, senha) {
    var instrucaoSql = `
        SELECT id FROM funcionario WHERE id = ${id} AND senha = '${senha}';
    `;
    return database.executar(instrucaoSql);
}

function atualizarNome(id, nome) {
    var instrucaoSql = `
        UPDATE funcionario SET nome = '${nome}' WHERE id = ${id};
    `;
    return database.executar(instrucaoSql);
}

function atualizarSenha(id, senha) {
    var instrucaoSql = `
        UPDATE funcionario SET senha = '${senha}' WHERE id = ${id};
    `;
    return database.executar(instrucaoSql);
}

function registrarLog(id, descricao) {
    var instrucaoSql = `
        INSERT INTO log (data, descricao, fkFuncionario) VALUES (NOW(), '${descricao}', ${id});
    `;
    return database.executar(instrucaoSql);
}

async function excluir(id) {
    await database.executar(`UPDATE funcionario SET fkSubalterno = NULL WHERE fkSubalterno = ${id};`);
    await database.executar(`DELETE FROM log WHERE fkFuncionario = ${id};`);
    await database.executar(`DELETE FROM acesso WHERE fkFuncionario = ${id};`);
    await database.executar(`DELETE FROM sugestaoFeat WHERE fkFuncionario = ${id};`);
    await database.executar(`DELETE FROM metricaDash WHERE fkFuncionario = ${id};`);
    await database.executar(`DELETE FROM notificacao WHERE fkFuncionario = ${id};`);
    await database.executar(`DELETE FROM funcionario WHERE id = ${id};`);
}

function atualizarFoto(id, foto) {
    var instrucaoSql = `
        UPDATE funcionario SET foto = '${foto}' WHERE id = ${id};
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarPorId,
    verificarSenha,
    atualizarNome,
    atualizarSenha,
    atualizarFoto,
    registrarLog,
    excluir
};
var database = require("../database/config");

function buscarAdminPorId(id) {
    var instrucaoSql = `
        SELECT f.fkEmpresa, c.nome AS cargo
        FROM funcionario f
        JOIN cargo c ON c.id = f.fkCargo
        WHERE f.id = ${id};
    `;
    return database.executar(instrucaoSql);
}

function buscarCargoPorNome(nome) {
    var instrucaoSql = `
        SELECT id FROM cargo WHERE nome = '${nome}';
    `;
    return database.executar(instrucaoSql);
}

function verificarEmailExistente(email) {
    var instrucaoSql = `
        SELECT id FROM funcionario WHERE email = '${email}';
    `;
    return database.executar(instrucaoSql);
}

function cadastrarFuncionario(nome, email, senha, fkEmpresa, fkCargo) {
    var instrucaoSql = `
        INSERT INTO funcionario (nome, email, senha, fkEmpresa, fkCargo)
        VALUES ('${nome}', '${email}', '${senha}', ${fkEmpresa}, ${fkCargo});
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarAdminPorId,
    buscarCargoPorNome,
    verificarEmailExistente,
    cadastrarFuncionario
};

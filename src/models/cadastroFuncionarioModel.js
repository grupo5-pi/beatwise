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

/* Lista Funcionarios */

function listarPorEmpresa(fkEmpresa) {
    var instrucaoSql = `
        SELECT f.id, f.nome, f.email, c.nome AS cargo
        FROM funcionario f
        JOIN cargo c ON c.id = f.fkCargo
        WHERE f.fkEmpresa = ${fkEmpresa}
        ORDER BY f.nome;
    `;
    return database.executar(instrucaoSql);
}

function buscarFuncionarioPorId(id) {
    var instrucaoSql = `
        SELECT id, fkEmpresa FROM funcionario WHERE id = ${id};
    `;
    return database.executar(instrucaoSql);
}

function verificarEmailDeOutro(email, id) {
    var instrucaoSql = `
        SELECT id FROM funcionario WHERE email = '${email}' AND id <> ${id};
    `;
    return database.executar(instrucaoSql);
}

function atualizarFuncionario(id, nome, email, fkCargo, senha) {
    var setSenha = senha ? `, senha = '${senha}'` : "";
    var instrucaoSql = `
        UPDATE funcionario
        SET nome = '${nome}', email = '${email}', fkCargo = ${fkCargo}${setSenha}
        WHERE id = ${id};
    `;
    return database.executar(instrucaoSql);
}

function excluirFuncionario(id) {
    var instrucaoSql = `
        DELETE FROM funcionario WHERE id = ${id};
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarAdminPorId,
    buscarCargoPorNome,
    verificarEmailExistente,
    cadastrarFuncionario,
    listarPorEmpresa,
    buscarFuncionarioPorId,
    verificarEmailDeOutro,
    atualizarFuncionario,
    excluirFuncionario
};
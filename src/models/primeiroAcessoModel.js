var database = require("../database/config");

function texto(valor) {
    var escapes = { "\0": "\\0", "\n": "\\n", "\r": "\\r", "\\": "\\\\", "'": "\\'", '"': '\\"', "\x1a": "\\Z" };
    var seguro = String(valor).replace(/[\0\n\r\\'"\x1a]/g, function (c) { return escapes[c]; });
    return "'" + seguro + "'";
}

function inteiro(valor) {
    var numero = Number(valor);
    if (!Number.isInteger(numero)) {
        throw new Error("Valor numérico inválido: " + valor);
    }
    return numero;
}

// O código mais recente do funcionário que ainda não foi usado e não expirou
function buscarTokenAtivo(email) {
    var instrucaoSql = `
        SELECT t.id, t.fkFuncionario, t.codigo, t.tentativas
        FROM tokenAcesso t
        JOIN funcionario f ON f.id = t.fkFuncionario
        WHERE f.email = ${texto(email)}
          AND t.usado = FALSE
          AND t.expiracao > NOW()
        ORDER BY t.id DESC
        LIMIT 1;
    `;
    return database.executar(instrucaoSql);
}

function registrarTentativaErrada(idToken) {
    var instrucaoSql = `
        UPDATE tokenAcesso SET tentativas = tentativas + 1 WHERE id = ${inteiro(idToken)};
    `;
    return database.executar(instrucaoSql);
}

// Marca o código como usado. Só funciona uma vez: se já tiver sido usado, não altera nenhuma linha.
function consumirToken(idToken) {
    var instrucaoSql = `
        UPDATE tokenAcesso SET usado = TRUE WHERE id = ${inteiro(idToken)} AND usado = FALSE;
    `;
    return database.executar(instrucaoSql);
}

function liberarToken(idToken) {
    var instrucaoSql = `
        UPDATE tokenAcesso SET usado = FALSE WHERE id = ${inteiro(idToken)};
    `;
    return database.executar(instrucaoSql);
}

// A senha é gravada do mesmo jeito que o resto do sistema (login e perfil) já usa
function definirSenha(idFuncionario, senha) {
    var instrucaoSql = `
        UPDATE funcionario SET senha = ${texto(senha)} WHERE id = ${inteiro(idFuncionario)};
    `;
    return database.executar(instrucaoSql);
}

// Depois de criar a senha, qualquer outro código pendente do funcionário deixa de valer
function invalidarTokens(idFuncionario) {
    var instrucaoSql = `
        UPDATE tokenAcesso SET usado = TRUE WHERE fkFuncionario = ${inteiro(idFuncionario)} AND usado = FALSE;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarTokenAtivo,
    registrarTentativaErrada,
    consumirToken,
    liberarToken,
    definirSenha,
    invalidarTokens
};

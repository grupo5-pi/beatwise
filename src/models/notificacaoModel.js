var database = require("../database/config");

var temas = [
    { chave: "acesso", tabela: "notificacao_acesso", colunas: ["usuario", "data", "horario", "paginas"] },
    { chave: "atualizacoes", tabela: "notificacao_atualizacoes", colunas: ["novas_funcionalidades", "correcoes", "manutencoes", "versoes"] },
    { chave: "frequencia", tabela: "notificacao_frequencia", colunas: ["diaria", "semanal", "mensal"] },
    { chave: "informativas", tabela: "notificacao_informativas", colunas: ["novidades", "dicas", "comunicados", "eventos"] }
];

function buscarTema(chave) {
    for (var i = 0; i < temas.length; i++) {
        if (temas[i].chave === chave) {
            return temas[i];
        }
    }
    return null;
}

function salvarNotificacao(fkFuncionario, chaveTema, opcoes) {
    console.log("ACESSEI O notificacao MODEL \n function salvarNotificacao():");

    var tema = buscarTema(chaveTema);
    var colunas = "";
    var valores = "";
    var atualizacoes = "";

    for (var i = 0; i < tema.colunas.length; i++) {
        var valor = 0;
        if (opcoes[i] === true || opcoes[i] === 1) {
            valor = 1;
        }

        if (i > 0) {
            colunas += ", ";
            valores += ", ";
            atualizacoes += ", ";
        }

        colunas += tema.colunas[i];
        valores += valor;
        atualizacoes += tema.colunas[i] + " = " + valor;
    }

    var instrucaoNotificacao = `
        INSERT INTO notificacao (fkFuncionario)
        SELECT ${fkFuncionario} FROM DUAL
        WHERE NOT EXISTS (SELECT 1 FROM notificacao WHERE fkFuncionario = ${fkFuncionario});
    `;

    var instrucaoTema = `
        INSERT INTO ${tema.tabela} (${colunas}, fkNotificacao)
        SELECT ${valores}, id FROM notificacao WHERE fkFuncionario = ${fkFuncionario} LIMIT 1
        ON DUPLICATE KEY UPDATE ${atualizacoes};
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoNotificacao + instrucaoTema);

    return database.executar(instrucaoNotificacao).then(function () {
        return database.executar(instrucaoTema);
    });
}

module.exports = {
    buscarTema,
    salvarNotificacao
};
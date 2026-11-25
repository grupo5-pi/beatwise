var database = require("../database/config");

var temas = [
    { chave: "acesso", tabela: "notificacao_acesso", colunas: ["usuario", "data", "horario", "paginas"] },
    { chave: "atualizacoes", tabela: "notificacao_atualizacoes", colunas: ["novas_funcionalidades", "correcoes", "manutencoes", "versoes"] },
    { chave: "frequencia", tabela: "notificacao_frequencia", colunas: ["diaria", "semanal", "mensal"] },
    { chave: "informativas", tabela: "notificacao_informativas", colunas: ["novidades", "dicas", "comunicados", "eventos"] },
    { chave: "alertas", tabela: "notificacao_alertas", colunas: ["aumentos", "quedas", "visualizacoes", "curtidas", "streams"] }
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

function buscarConfiguracao(fkFuncionario) {
    console.log("ACESSEI O notificacao MODEL \n function buscarConfiguracao():");

    var consultas = temas.map(function (tema) {
        var instrucao = `
            SELECT ${tema.colunas.join(", ")}
            FROM ${tema.tabela} t
            JOIN notificacao n ON n.id = t.fkNotificacao
            WHERE n.fkFuncionario = ${fkFuncionario}
            LIMIT 1;
        `;

        return database.executar(instrucao).then(function (linhas) {
            if (linhas.length == 0) {
                return null;
            }
            return {
                chave: tema.chave,
                opcoes: tema.colunas.map(function (coluna) {
                    return linhas[0][coluna] === 1;
                })
            };
        });
    });

    return Promise.all(consultas).then(function (resultados) {
        var config = {};
        resultados.forEach(function (r) {
            if (r != null) {
                config[r.chave] = r.opcoes;
            }
        });
        return config;
    });
}

function excluirTema(fkFuncionario, chaveTema) {
    console.log("ACESSEI O notificacao MODEL \n function excluirTema():");

    var tema = buscarTema(chaveTema);

    var instrucao = `
        DELETE t FROM ${tema.tabela} t
        JOIN notificacao n ON n.id = t.fkNotificacao
        WHERE n.fkFuncionario = ${fkFuncionario};
    `;

    console.log("Executando a instrução SQL: \n" + instrucao);
    return database.executar(instrucao);
}

module.exports = {
    buscarTema,
    salvarNotificacao,
    buscarConfiguracao,
    excluirTema
};
var database = require("../database/config");

var MAX_ALERTAS_POR_EMAIL = 10;
var HORA_DO_ENVIO = 8;

var COLUNA_DA_METRICA = { views: "visualizacoes", curtidas: "curtidas", streams: "streams" };

async function destinatarios() {
    var instrucaoSql = `
        SELECT na.id AS idAlertas, f.id, f.email,
               na.aumentos, na.quedas, na.visualizacoes, na.curtidas, na.streams,
               nf.id AS idFrequencia, nf.diaria, nf.semanal, nf.mensal
        FROM notificacao_alertas na
        JOIN notificacao n ON n.id = na.fkNotificacao
        JOIN funcionario f ON f.id = n.fkFuncionario
        LEFT JOIN notificacao_frequencia nf ON nf.fkNotificacao = n.id
        WHERE f.email IS NOT NULL AND f.email <> ''
        ORDER BY na.id, nf.id;
    `;
    var linhas = await database.executar(instrucaoSql);

    var porPessoa = {};
    linhas.forEach(function (l) {
        porPessoa[l.id] = l;
    });
    return Object.keys(porPessoa).map(function (id) { return porPessoa[id]; });
}

function colocarNaFila(idFuncionario, conteudo, enviarApos) {
    var instrucaoSql = `
        INSERT INTO emailAlerta (fkFuncionario, conteudo, enviarApos) VALUES (?, ?, ?);
    `;
    return database.executar(instrucaoSql, [idFuncionario, conteudo, enviarApos]);
}


function proximaDiaria(agora) {
    var data = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), HORA_DO_ENVIO, 0, 0);
    if (data <= agora) data.setDate(data.getDate() + 1);
    return data;
}

function proximaSemanal(agora) {
    var data = new Date(agora.getFullYear(), agora.getMonth(), agora.getDate(), HORA_DO_ENVIO, 0, 0);
    var diasAteSegunda = (8 - data.getDay()) % 7;
    data.setDate(data.getDate() + diasAteSegunda);
    if (data <= agora) data.setDate(data.getDate() + 7);
    return data;
}

function proximaMensal(agora) {
    return new Date(agora.getFullYear(), agora.getMonth() + 1, 1, HORA_DO_ENVIO, 0, 0);
}

function quandoEnviar(d, agora) {
    var datas = [];
    if (d.diaria == 1) datas.push(proximaDiaria(agora));
    if (d.semanal == 1) datas.push(proximaSemanal(agora));
    if (d.mensal == 1) datas.push(proximaMensal(agora));

    if (datas.length == 0) return agora;
    return new Date(Math.min.apply(null, datas));
}


function alertasDaPessoa(variacoes, d) {
    return variacoes
        .filter(function (v) {
            var querEsteTipo = v.tipo == "positivo" ? d.aumentos == 1 : d.quedas == 1;
            var querEstaMetrica = d[COLUNA_DA_METRICA[v.metrica]] == 1;
            return querEsteTipo && querEstaMetrica;
        })
        .sort(function (a, b) { return b.percentual - a.percentual; })
        .slice(0, MAX_ALERTAS_POR_EMAIL);
}

async function enfileirarAlertas(variacoes) {
    var lista = await destinatarios();
    var agora = new Date();
    var enfileirados = 0;

    for (var i = 0; i < lista.length; i++) {
        var meus = alertasDaPessoa(variacoes, lista[i]);
        if (meus.length == 0) continue;

        var conteudo = meus.map(function (a) { return a.tipo + "\t" + a.texto; }).join("\n");
        await colocarNaFila(lista[i].id, conteudo, quandoEnviar(lista[i], agora));
        enfileirados++;
    }

    console.log("E-mails de alertas colocados na fila: " + enfileirados);
    return enfileirados;
}

module.exports = { enfileirarAlertas, alertasDaPessoa, quandoEnviar };
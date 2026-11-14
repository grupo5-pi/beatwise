var model = require("../models/dashboardProdutorModel");


var LIMITE_VARIACAO = 5;
var MAX_ALERTAS = 4;
var QTD_MUSICAS_GRUPO = 10;


function numero(valor) {
    return Number(valor) || 0;
}

function normalizar(linhas) {
    return linhas.map(function (l) {
        return {
            genero: l.genero,
            views: Math.round(numero(l.views)),
            curtidas: Math.round(numero(l.curtidas)),
            streams: Math.round(numero(l.streams))
        };
    });
}

function baseMudou(atuais, ultimo) {
    if (atuais.length != ultimo.length) return true;

    var antes = {};
    for (var i = 0; i < ultimo.length; i++) {
        antes[ultimo[i].genero] = ultimo[i];
    }
    for (var j = 0; j < atuais.length; j++) {
        var a = atuais[j];
        var u = antes[a.genero];
        if (!u || u.views != a.views || u.curtidas != a.curtidas || u.streams != a.streams) return true;
    }
    return false;
}

var verificacaoEmAndamento = null;


function verificarAtualizacao() {
    if (!verificacaoEmAndamento) {
        verificacaoEmAndamento = (async function () {
            var atuais = normalizar(await model.totaisPorGenero());
            if (atuais.length == 0) return;   // ainda sem gênero na base: nada a comparar

            var ultimo = normalizar(await model.ultimoSnapshot());
            if (ultimo.length == 0 || baseMudou(atuais, ultimo)) {
                await model.salvarSnapshot(atuais);
            }
        })().finally(function () {
            verificacaoEmAndamento = null;
        });
    }
    return verificacaoEmAndamento;
}

var METRICAS = [
    { campo: "views", rotulo: "visualizações" },
    { campo: "curtidas", rotulo: "curtidas" },
    { campo: "streams", rotulo: "streams" }
];

function montarAlertas(novo, antigo) {
    var anterior = {};
    for (var i = 0; i < antigo.length; i++) {
        anterior[antigo[i].genero] = antigo[i];
    }

    var porStreams = novo.slice().sort(function (x, y) { return y.streams - x.streams; });
    var top5 = porStreams.slice(0, 5).map(function (g) { return g.genero; });

    var alertas = [];
    for (var j = 0; j < novo.length; j++) {
        var g = novo[j];
        var a = anterior[g.genero];
        if (!a) continue;   // gênero novo, sem como comparar

        for (var k = 0; k < METRICAS.length; k++) {
            var campo = METRICAS[k].campo;
            if (a[campo] <= 0) continue;

            var variacao = (g[campo] - a[campo]) / a[campo] * 100;
            if (Math.abs(variacao) < LIMITE_VARIACAO) continue;

            var texto = (variacao > 0 ? "Aumento" : "Queda") + " de " + Math.round(Math.abs(variacao)) +
                "% de " + METRICAS[k].rotulo + " no gênero " + g.genero + " desde a última atualização";
            if (top5.indexOf(g.genero) >= 0) {
                texto += " - (Gênero top 5 mais escutados) - Spotify";
            }

            alertas.push({
                tipo: variacao > 0 ? "positivo" : "negativo",
                texto: texto,
                peso: Math.abs(variacao)
            });
        }
    }

    alertas.sort(function (x, y) { return y.peso - x.peso; });
    return alertas.slice(0, MAX_ALERTAS).map(function (a) {
        return { tipo: a.tipo, texto: a.texto };
    });
}

async function alertas(req, res) {
    try {
        await verificarAtualizacao();

        var antigo = normalizar(await model.snapshotAnterior());
        if (antigo.length == 0) {
            return res.json([]);   // só existe a carga inicial: ainda não houve atualização
        }
        var novo = normalizar(await model.ultimoSnapshot());
        res.json(montarAlertas(novo, antigo));
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao carregar os alertas." });
    }
}

var FATORES = [
    { campo: "energia", nome: "Energia", comparativo: "energia" },
    { campo: "dancabilidade", nome: "Dançabilidade", comparativo: "dançabilidade" },
    { campo: "valencia", nome: "Valência", comparativo: "valência" },
    { campo: "acustica", nome: "Acústica", comparativo: "acústica" },
    { campo: "bpm", nome: "BPM", comparativo: "BPM" }
];

function calcularFator(top, baixo, desvio) {
    var escolhido = null;

    for (var i = 0; i < FATORES.length; i++) {
        var f = FATORES[i];
        var mediaTop = numero(top[f.campo]);
        var mediaBaixo = numero(baixo[f.campo]);
        var dp = numero(desvio[f.campo]);
        if (dp <= 0 || mediaBaixo <= 0) continue;

        var distancia = Math.abs(mediaTop - mediaBaixo) / dp;
        if (!escolhido || distancia > escolhido.distancia) {
            escolhido = { fator: f, distancia: distancia, mediaTop: mediaTop, mediaBaixo: mediaBaixo };
        }
    }

    if (!escolhido) return null;

    var subiu = escolhido.mediaTop >= escolhido.mediaBaixo;
    var percentual = Math.round(Math.abs(escolhido.mediaTop - escolhido.mediaBaixo) / escolhido.mediaBaixo * 100);

    return {
        valor: escolhido.fator.nome + (subiu ? " ↑↑" : " ↓↓"),
        texto: "Músicas de sucesso (top " + QTD_MUSICAS_GRUPO + ") têm, em média, " + percentual + "% " +
            (subiu ? "mais " : "menos ") + escolhido.fator.comparativo + " que as de baixo desempenho."
    };
}

async function fatorDecisivo(req, res) {
    try {
        var resultados = await Promise.all([
            model.mediasPorDesempenho("DESC", QTD_MUSICAS_GRUPO),
            model.mediasPorDesempenho("ASC", QTD_MUSICAS_GRUPO),
            model.desvioDasCaracteristicas()
        ]);

        var fator = calcularFator(resultados[0][0], resultados[1][0], resultados[2][0]);
        if (!fator) {
            return res.json({ valor: "—", texto: "Ainda não há dados suficientes para calcular." });
        }
        res.json(fator);
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao calcular o fator decisivo." });
    }
}


async function generos(req, res) {
    try {
        var linhas = await model.listarGeneros();
        res.json(linhas.map(function (l) {
            return { genero: l.genero, total: numero(l.total) };
        }));
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao carregar os gêneros." });
    }
}

function emMilhoes(valor) {
    return Math.round(numero(valor) / 1000000 * 100) / 100;
}

function montarFaixas(genero, linhas, mediaGenero) {
    var resposta = { genero: genero, faixas: [], views: [], qtd: [], retornoEsperado: emMilhoes(mediaGenero) };
    if (linhas.length == 0) return resposta;

    var porFaixa = {};
    for (var i = 0; i < linhas.length; i++) {
        porFaixa[numero(linhas[i].faixa)] = linhas[i];
    }

    // vai da primeira à última faixa que existe, preenchendo com 0 as faixas sem música
    var primeira = numero(linhas[0].faixa);
    var ultima = numero(linhas[linhas.length - 1].faixa);

    for (var faixa = primeira; faixa <= ultima; faixa += 10) {
        resposta.faixas.push(faixa + "–" + (faixa + 10));
        if (porFaixa[faixa]) {
            resposta.views.push(emMilhoes(porFaixa[faixa].views));
            resposta.qtd.push(numero(porFaixa[faixa].total));
        } else {
            resposta.views.push(0);
            resposta.qtd.push(0);
        }
    }
    return resposta;
}

async function viewsPorBpm(req, res) {
    var genero = String(req.query.genero || "").trim();
    if (genero == "") {
        return res.status(400).json({ mensagem: "Informe o gênero." });
    }

    try {
        var linhas = await model.viewsPorFaixaBpm(genero);
        var media = await model.mediaViewsDoGenero(genero);
        res.json(montarFaixas(genero, linhas, media.length ? media[0].views : 0));
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao carregar o gráfico." });
    }
}

module.exports = { alertas, fatorDecisivo, generos, viewsPorBpm };
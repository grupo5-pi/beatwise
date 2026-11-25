var model = require("../models/dashboardProdutorModel");
var alertaEmail = require("../models/alertaEmailModel");


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


var leituraAnterior = null;

function verificarAtualizacao(exigirEstabilidade) {
    if (!verificacaoEmAndamento) {
        verificacaoEmAndamento = (async function () {
            var atuais = normalizar(await model.totaisPorGenero());
            if (atuais.length == 0) return;   // ainda sem gênero na base: nada a comparar

            var ultimo = normalizar(await model.ultimoSnapshot());
            if (ultimo.length == 0) {
                await model.salvarSnapshot(atuais);
                return;
            }

            if (!baseMudou(atuais, ultimo)) {
                leituraAnterior = null;
                return;
            }

            if (exigirEstabilidade) {
                var chave = JSON.stringify(atuais);
                if (chave !== leituraAnterior) {
                    leituraAnterior = chave;   // espera a próxima verificação para confirmar
                    return;
                }
            }
            leituraAnterior = null;

            await model.salvarSnapshot(atuais);

            try {
                var variacoes = calcularVariacoes(atuais, ultimo).filter(function (v) {
                    return v.percentual >= LIMITE_VARIACAO;
                });
                await alertaEmail.enfileirarAlertas(variacoes);
            } catch (erro) {
                console.log("Erro ao colocar os e-mails de alertas na fila:", erro);
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

// MUDOU: calcula TODAS as variações entre as duas fotos (antes já cortava no limite e no máximo de alertas).
// A dashboard usa as maiores; o e-mail usa as que cada pessoa escolheu na tela de notificações.
function calcularVariacoes(novo, antigo) {
    var anterior = {};
    for (var i = 0; i < antigo.length; i++) {
        anterior[antigo[i].genero] = antigo[i];
    }

    var porStreams = novo.slice().sort(function (x, y) { return y.streams - x.streams; });
    var top5 = porStreams.slice(0, 5).map(function (g) { return g.genero; });

    var variacoes = [];
    for (var j = 0; j < novo.length; j++) {
        var g = novo[j];
        var a = anterior[g.genero];
        if (!a) continue;   // gênero novo, sem como comparar

        for (var k = 0; k < METRICAS.length; k++) {
            var campo = METRICAS[k].campo;
            if (a[campo] <= 0) continue;

            var variacao = (g[campo] - a[campo]) / a[campo] * 100;
            if (variacao == 0) continue;

            var texto = (variacao > 0 ? "Aumento" : "Queda") + " de " + Math.round(Math.abs(variacao)) +
                "% de " + METRICAS[k].rotulo + " no gênero " + g.genero + " desde a última atualização";
            if (top5.indexOf(g.genero) >= 0) {
                texto += " - (Gênero top 5 mais escutados) - Spotify";
            }

            variacoes.push({
                tipo: variacao > 0 ? "positivo" : "negativo",
                metrica: campo,
                genero: g.genero,
                percentual: Math.abs(variacao),
                texto: texto
            });
        }
    }
    return variacoes;
}

function montarAlertas(novo, antigo) {
    return calcularVariacoes(novo, antigo)
        .filter(function (v) { return v.percentual >= LIMITE_VARIACAO; })
        .sort(function (x, y) { return y.percentual - x.percentual; })
        .slice(0, MAX_ALERTAS)
        .map(function (v) { return { tipo: v.tipo, texto: v.texto }; });
}

async function alertas(req, res) {
    try {
        await verificarAtualizacao(false);

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

var MIN_MUSICAS_FAIXA = 30;

function formatarTempo(segundos) {
    var min = Math.floor(segundos / 60);
    var seg = segundos % 60;
    return min + ":" + (seg < 10 ? "0" : "") + seg;
}

function abreviar(valor) {
    if (valor >= 1000000000) return (valor / 1000000000).toFixed(1).replace(".", ",") + " bi";
    if (valor >= 1000000) return (valor / 1000000).toFixed(1).replace(".", ",") + " milhões";
    if (valor >= 1000) return Math.round(valor / 1000) + " mil";
    return String(Math.round(valor));
}

function calcularDuracaoIdeal(linhas) {
    var blocos = {};
    var totalMusicas = 0;
    var somaStreams = 0;

    for (var i = 0; i < linhas.length; i++) {
        var total = numero(linhas[i].total);
        var streams = numero(linhas[i].streams);
        blocos[numero(linhas[i].bloco)] = { total: total, streams: streams };
        totalMusicas += total;
        somaStreams += total * streams;
    }
    if (totalMusicas == 0) return null;

    var mediaGeral = somaStreams / totalMusicas;
    var melhor = null;

    for (var chave in blocos) {
        var b = Number(chave);
        var a = blocos[b];
        var c = blocos[b + 1];
        if (!c) continue;

        var qtd = a.total + c.total;
        if (qtd < MIN_MUSICAS_FAIXA) continue;

        var media = (a.total * a.streams + c.total * c.streams) / qtd;
        if (!melhor || media > melhor.media) {
            melhor = { bloco: b, media: media };
        }
    }
    if (!melhor) return null;

    var inicio = melhor.bloco * 30;
    var fator = melhor.media / mediaGeral;

    return {
        valor: formatarTempo(inicio) + " - " + formatarTempo(inicio + 60),
        texto: "Músicas nessa faixa têm streams " + fator.toFixed(1).replace(".", ",") +
            "x acima da média (" + abreviar(melhor.media) + " vs " + abreviar(mediaGeral) + " da média geral)"
    };
}

async function duracaoIdeal(req, res) {
    try {
        var linhas = await model.streamsPorBlocoDuracao();
        var resultado = calcularDuracaoIdeal(linhas);
        if (!resultado) {
            return res.json({ valor: "—", texto: "Ainda não há dados suficientes para calcular." });
        }
        res.json(resultado);
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao calcular a duração ideal." });
    }
}

async function dispersao(req, res) {
    try {
        var linhas = await model.musicasParaDispersao();
        var vistos = {};
        var pontos = [];

        for (var i = 0; i < linhas.length; i++) {
            var l = linhas[i];
            var chave = l.titulo + "|" + l.artista;
            if (vistos[chave]) continue;
            vistos[chave] = true;

            pontos.push({
                titulo: l.titulo,
                artista: l.artista || "—",
                views: numero(l.views),
                dancabilidade: l.dancabilidade,
                energia: l.energia,
                tonalidade: l.tonalidade,
                acustica: l.acustica,
                vivicidade: l.vivicidade,
                valenciaPositividade: l.valenciaPositividade,
                tempoBPM: l.tempoBPM
            });
        }

        res.json(pontos);
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao carregar a dispersão." });
    }
}


function lerFiltroQuery(query) {
    var anoInicio = parseInt(query.anoInicio);
    var anoFim = parseInt(query.anoFim);
    var generos = String(query.generos || "")
        .split(",")
        .map(function (g) { return g.trim(); })
        .filter(function (g) { return g != ""; });

    return {
        anoInicio: isNaN(anoInicio) ? null : anoInicio,
        anoFim: isNaN(anoFim) ? null : anoFim,
        generos: generos
    };
}

function nomeDosGeneros(filtro) {
    return filtro.generos.length ? filtro.generos.join(" / ") : "Todos os gêneros";
}


async function streamsPorGenero(req, res) {
    try {
        var linhas = await model.streamsPorGenero(lerFiltroQuery(req.query));

        var total = 0;
        for (var i = 0; i < linhas.length; i++) total += numero(linhas[i].streams);

        if (linhas.length == 0 || total == 0) {
            return res.json({ valor: "—", texto: "Sem dados de streams para o filtro aplicado." });
        }

        var maior = linhas[0];
        var streams = numero(maior.streams);

        res.json({
            valor: abreviar(streams) + " - " + Math.round(streams / total * 100) + "%",
            texto: maior.genero + " tem a maior soma de streams entre as músicas analisadas."
        });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao carregar o total de streams por gênero." });
    }
}

// ---------- Gráfico de radar ----------

var NOTAS = ["Dó", "Dó♯", "Ré", "Ré♯", "Mi", "Fá", "Fá♯", "Sol", "Sol♯", "Lá", "Lá♯", "Si"];
var PERCENTUAL_SUCESSO = 0.1;

function valorOuNulo(valor) {
    if (valor === null || valor === undefined) return null;
    var n = Number(valor);
    return isNaN(n) ? null : n;
}

function perfilRadar(medias, tom) {
    var bpm = valorOuNulo(medias.bpm);
    var tonalidade = tom ? valorOuNulo(tom.tonalidade) : null;

    function porcento(v) {
        v = valorOuNulo(v);
        return v === null ? 0 : Math.round(v * 100);
    }

    return {
        valores: [
            bpm === null ? 0 : Math.max(0, Math.min(100, Math.round((bpm - 60) / 120 * 100))),
            tonalidade === null ? 0 : Math.round(tonalidade / 11 * 100),
            porcento(medias.energia),
            porcento(medias.valencia),
            porcento(medias.dancabilidade)
        ],
        valoresReais: [
            bpm === null ? "—" : Math.round(bpm) + " BPM",
            tonalidade === null ? "—" : NOTAS[tonalidade],
            porcento(medias.energia) + "%",
            porcento(medias.valencia) + "%",
            porcento(medias.dancabilidade) + "%"
        ]
    };
}

async function radar(req, res) {
    var filtro = lerFiltroQuery(req.query);
    var genero = nomeDosGeneros(filtro);

    try {
        var geral = (await model.mediasRadar(filtro, null))[0] || {};
        var qtdTotal = numero(geral.total);

        if (qtdTotal == 0) {
            return res.json({ genero: genero, vazio: true });
        }

        var qtdSucesso = Math.max(1, Math.round(qtdTotal * PERCENTUAL_SUCESSO));
        var sucesso = (await model.mediasRadar(filtro, qtdSucesso))[0] || {};
        var tomSucesso = (await model.tonalidadeMaisComum(filtro, qtdSucesso))[0];
        var tomGeral = (await model.tonalidadeMaisComum(filtro, null))[0];

        var perfilSucesso = perfilRadar(sucesso, tomSucesso);
        var perfilGeral = perfilRadar(geral, tomGeral);

        res.json({
            genero: genero,
            vazio: false,
            valores: perfilSucesso.valores,
            valoresReais: perfilSucesso.valoresReais,
            valoresGeral: perfilGeral.valores,
            valoresReaisGeral: perfilGeral.valoresReais,
            qtdSucesso: qtdSucesso,
            qtdTotal: qtdTotal
        });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao carregar o gráfico de radar." });
    }
}

var MINUTOS_ENTRE_VERIFICACOES = 10;

function verificarEmSegundoPlano() {
    verificarAtualizacao(true).catch(function (erro) {
        console.log("Erro na verificação da base:", erro);
    });
}

setTimeout(verificarEmSegundoPlano, 5000);
setInterval(verificarEmSegundoPlano, MINUTOS_ENTRE_VERIFICACOES * 60 * 1000);

module.exports = {
    alertas, fatorDecisivo, generos, viewsPorBpm, duracaoIdeal, dispersao,
    radar, streamsPorGenero, verificarAtualizacao   // MUDOU: verificarAtualizacao exportada
};
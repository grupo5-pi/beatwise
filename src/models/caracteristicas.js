var CARACTERISTICAS = {
    dancabilidade:        { rotulo: "Dançabilidade",     min: 0,   max: 1,   passo: 0.01, casas: 2, escala: true },
    energia:              { rotulo: "Energia",           min: 0,   max: 1,   passo: 0.01, casas: 2, escala: true },
    tonalidade:           { rotulo: "Tonalidade",        min: 0,   max: 11,  passo: 1,    casas: 0 },
    acustica:             { rotulo: "Acústica",          min: 0,   max: 1,   passo: 0.01, casas: 2, escala: true },
    vivicidade:           { rotulo: "Vivacidade",        min: 0,   max: 1,   passo: 0.01, casas: 2, escala: true },
    valenciaPositividade: { rotulo: "Valência",          min: 0,   max: 1,   passo: 0.01, casas: 2, escala: true },
    tempoBPM:             { rotulo: "BPM",               min: 0,   max: 250, passo: 1,    casas: 0 }
};

function normalizar(entrada) {
    if (typeof entrada == "string") {
        try { entrada = JSON.parse(entrada); } catch (e) { entrada = {}; }
    }
    if (!entrada || typeof entrada != "object") entrada = {};

    var saida = {};
    for (var chave in CARACTERISTICAS) {
        var faixa = entrada[chave];
        if (!Array.isArray(faixa) || faixa.length != 2) continue;

        var c = CARACTERISTICAS[chave];
        var min = parseFloat(faixa[0]);
        var max = parseFloat(faixa[1]);
        if (isNaN(min) || isNaN(max)) continue;

        min = Math.min(c.max, Math.max(c.min, min));
        max = Math.min(c.max, Math.max(c.min, max));
        if (min > max) return null;

        var fator = Math.pow(10, c.casas);
        min = Math.round(min * fator) / fator;
        max = Math.round(max * fator) / fator;

        if (min > c.min || max < c.max) saida[chave] = [min, max];
    }
    return saida;
}

module.exports = { CARACTERISTICAS, normalizar };

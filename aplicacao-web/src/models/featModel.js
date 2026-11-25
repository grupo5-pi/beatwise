var database = require("../database/config");

// PESOS DA RECOMENDAÇÃO
//   gênero (35)       principal
//   BPM (25)          o andamento precisa combinar para a faixa funcionar
//   energia (15)      clima da música
//   dançabilidade (15) clima da música
//   tonalidade (10)   a menos crítica, pois da para ajustar o tom em estúdio
//
// O intervalo de anos NÃO entra na pontuação: é um filtro obrigatório
// Se o usuário não preencher, é ignorado.

var PESOS = { genero: 35, bpm: 25, energia: 15, dancabilidade: 15, tonalidade: 10 };

var TOLERANCIA_BPM = 30;


function notaGenero(a, generoPedido) {
    if (!generoPedido || !a.generos || a.totalGeneros == 0) return null;
    return (a.generos[generoPedido] || 0) / a.totalGeneros;
}

function dentroDoIntervalo(a, f) {
    if (f.intervaloAnos === null || f.intervaloAnos === undefined) return true;
    if (a.ultimoAno === null) return false;
    return new Date().getFullYear() - a.ultimoAno <= f.intervaloAnos;
}

function notaBpm(a, f) {
    if (f.bpmMin === null && f.bpmMax === null) return null;
    var min = f.bpmMin !== null ? f.bpmMin : 0;
    var max = f.bpmMax !== null ? f.bpmMax : 1000;
    var distancia = 0;
    if (a.bpm < min) distancia = min - a.bpm;
    else if (a.bpm > max) distancia = a.bpm - max;
    return Math.max(0, 1 - distancia / TOLERANCIA_BPM);
}

function notaTonalidade(a, f) {
    if (f.tonalidade === null || a.tonalidade === null) return null;
    var posicaoA = (a.tonalidade * 7) % 12;
    var posicaoB = (f.tonalidade * 7) % 12;
    var casas = Math.abs(posicaoA - posicaoB);
    casas = Math.min(casas, 12 - casas);
    return 1 - casas / 6;
}

function pontuar(a, f) {
    var fatores = [
        { peso: PESOS.genero, nota: notaGenero(a, f.genero) },
        { peso: PESOS.bpm, nota: notaBpm(a, f) },
        { peso: PESOS.energia, nota: 1 - Math.abs(a.energia - f.energia / 100) },
        { peso: PESOS.dancabilidade, nota: 1 - Math.abs(a.dancabilidade - f.dancabilidade / 100) },
        { peso: PESOS.tonalidade, nota: notaTonalidade(a, f) }
    ];

    var soma = 0;
    var pesoTotal = 0;
    for (var i = 0; i < fatores.length; i++) {
        if (fatores[i].nota === null) continue;
        soma += fatores[i].peso * fatores[i].nota;
        pesoTotal += fatores[i].peso;
    }
    return Math.round(100 * soma / pesoTotal);
}

function perfisDosArtistas() {
    var instrucaoSql = `
        SELECT a.id, a.nome,
            MAX(m.anoLancamento) AS ultimoAno,
            AVG(s.tempoBPM) AS bpm,
            AVG(s.energia) AS energia,
            AVG(s.dancabilidade) AS dancabilidade,
            (SELECT s2.tonalidade
               FROM musicaArtistaBD ma2
               JOIN spotifyBD s2 ON s2.fkMusicaBD = ma2.fkMusicaBD
              WHERE ma2.fkArtistaBD = a.id
              GROUP BY s2.tonalidade
              ORDER BY COUNT(*) DESC
              LIMIT 1) AS tonalidade
        FROM artistaBD a
        JOIN musicaArtistaBD ma ON ma.fkArtistaBD = a.id
        JOIN musicaBD m ON m.id = ma.fkMusicaBD
        JOIN spotifyBD s ON s.fkMusicaBD = ma.fkMusicaBD
        GROUP BY a.id, a.nome;
    `;
    return database.executar(instrucaoSql);
}

function generosDosArtistas() {
    var instrucaoSql = `
        SELECT ma.fkArtistaBD AS idArtista, m.generoPadrao AS genero, COUNT(*) AS qtd
        FROM musicaArtistaBD ma
        JOIN musicaBD m ON m.id = ma.fkMusicaBD
        WHERE m.generoPadrao IS NOT NULL
        GROUP BY ma.fkArtistaBD, m.generoPadrao;
    `;
    return database.executar(instrucaoSql);
}

function listarGeneros() {
    var instrucaoSql = `
        SELECT generoPadrao AS genero, COUNT(*) AS qtd
        FROM musicaBD
        WHERE generoPadrao IS NOT NULL AND generoPadrao <> 'Outros'
        GROUP BY generoPadrao
        ORDER BY generoPadrao;
    `;
    return database.executar(instrucaoSql);
}

async function recomendar(f) {
    var linhas = await perfisDosArtistas();
    var linhasGenero = await generosDosArtistas();

    var generosPorArtista = {};
    for (var g = 0; g < linhasGenero.length; g++) {
        var lg = linhasGenero[g];
        if (!generosPorArtista[lg.idArtista]) generosPorArtista[lg.idArtista] = { total: 0, porGenero: {} };
        generosPorArtista[lg.idArtista].porGenero[lg.genero] = Number(lg.qtd);
        generosPorArtista[lg.idArtista].total += Number(lg.qtd);
    }

    var artistas = linhas.map(function (l) {
        var a = {
            id: l.id,
            nome: l.nome,
            bpm: Number(l.bpm),
            energia: Number(l.energia),
            dancabilidade: Number(l.dancabilidade),
            tonalidade: l.tonalidade === null ? null : Number(l.tonalidade),
            ultimoAno: l.ultimoAno === null ? null : Number(l.ultimoAno),
            generos: generosPorArtista[l.id] ? generosPorArtista[l.id].porGenero : null,
            totalGeneros: generosPorArtista[l.id] ? generosPorArtista[l.id].total : 0
        };
        a.compatibilidade = pontuar(a, f);
        return a;
    }).filter(function (a) {
        return dentroDoIntervalo(a, f);
    });

    artistas.sort(function (x, y) {
        return y.compatibilidade - x.compatibilidade || x.nome.localeCompare(y.nome);
    });

    return artistas.slice(0, 3).map(function (a) {
        return { id: a.id, nome: a.nome, bpm: Math.round(a.bpm), tonalidade: a.tonalidade, compatibilidade: a.compatibilidade };
    });
}

function listar(idFuncionario) {
    var instrucaoSql = `
        SELECT id, nome, genero, energia, dancabilidade, bpmMin, bpmMax,
               tonalidade, intervaloAnos, featUm, featDois, featTres
        FROM sugestaoFeat
        WHERE fkFuncionario = ?
        ORDER BY id DESC;
    `;
    return database.executar(instrucaoSql, [idFuncionario]);
}


function tresNomes(nomes) {
    var lista = [];
    for (var i = 0; i < 3; i++) {
        lista.push(String(nomes[i] || "").slice(0, 45));
    }
    return lista;
}

function cadastrar(nome, f, nomes, idFuncionario) {
    nomes = tresNomes(nomes);
    var instrucaoSql = `
        INSERT INTO sugestaoFeat
            (nome, genero, energia, dancabilidade, bpmMin, bpmMax, tonalidade, intervaloAnos,
             featUm, featDois, featTres, fkFuncionario)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    return database.executar(instrucaoSql, [
        nome, f.genero, f.energia, f.dancabilidade, f.bpmMin, f.bpmMax, f.tonalidade, f.intervaloAnos,
        nomes[0], nomes[1], nomes[2], idFuncionario
    ]);
}

function atualizar(id, nome, f, nomes, idFuncionario) {
    nomes = tresNomes(nomes);
    var instrucaoSql = `
        UPDATE sugestaoFeat SET
            nome = ?, genero = ?, energia = ?, dancabilidade = ?, bpmMin = ?, bpmMax = ?,
            tonalidade = ?, intervaloAnos = ?,
            featUm = ?, featDois = ?, featTres = ?
        WHERE id = ? AND fkFuncionario = ?;
    `;
    return database.executar(instrucaoSql, [
        nome, f.genero, f.energia, f.dancabilidade, f.bpmMin, f.bpmMax, f.tonalidade, f.intervaloAnos,
        nomes[0], nomes[1], nomes[2], id, idFuncionario
    ]);
}

function excluir(id, idFuncionario) {
    var instrucaoSql = `DELETE FROM sugestaoFeat WHERE id = ? AND fkFuncionario = ?;`;
    return database.executar(instrucaoSql, [id, idFuncionario]);
}

module.exports = { recomendar, pontuar, listarGeneros, listar, cadastrar, atualizar, excluir };
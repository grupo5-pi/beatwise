var model = require("../models/featModel");

function idValido(valor) {
    var n = parseInt(valor);
    return !isNaN(n) && n > 0 ? n : null;
}

function numero(valor, min, max) {
    if (valor === "" || valor === null || valor === undefined) return null;
    var n = Number(valor);
    if (isNaN(n) || n < min || n > max) return undefined;
    return n;
}

function lerFiltros(body) {
    var f = {
        genero: (body.genero || "").trim() || null,
        energia: numero(body.energia, 0, 100),
        dancabilidade: numero(body.dancabilidade, 0, 100),
        bpmMin: numero(body.bpmMin, 40, 220),
        bpmMax: numero(body.bpmMax, 40, 220),
        tonalidade: numero(body.tonalidade, 0, 11),
        intervaloAnos: numero(body.intervaloAnos, 0, 30)
    };

    for (var campo in f) {
        if (f[campo] === undefined) return { erro: "Valor inválido no filtro: " + campo + "." };
    }
    if (f.energia === null) f.energia = 50;
    if (f.dancabilidade === null) f.dancabilidade = 50;
    if (f.bpmMin !== null && f.bpmMax !== null && f.bpmMin > f.bpmMax) {
        return { erro: "O BPM mínimo não pode ser maior que o máximo." };
    }
    return { filtros: f };
}

function lerNome(body) {
    var nome = (body.nome || "").trim();
    return nome.length >= 1 && nome.length <= 40 ? nome : null;
}

function lerNomesArtistas(lista) {
    if (!Array.isArray(lista)) return [];
    return lista
        .map(function (n) { return String(n || "").trim(); })
        .filter(function (n) { return n; })
        .slice(0, 3);
}

function formatar(linha) {
    return {
        id: linha.id,
        nome: linha.nome,
        artistas: [linha.featUm, linha.featDois, linha.featTres].filter(function (n) { return n; }),
        filtros: {
            genero: linha.genero,
            energia: linha.energia,
            danca: linha.dancabilidade,
            bpmMin: linha.bpmMin,
            bpmMax: linha.bpmMax,
            tom: linha.tonalidade,
            anos: linha.intervaloAnos
        }
    };
}

async function recomendar(req, res) {
    var lido = lerFiltros(req.body);
    if (lido.erro) return res.status(400).json({ mensagem: lido.erro });
    try {
        var linhas = await model.recomendar(lido.filtros);
        res.json(linhas.map(function (l) {
            return {
                id: l.id,
                nome: l.nome,
                bpm: Number(l.bpm),
                tonalidade: l.tonalidade,
                compatibilidade: Number(l.compatibilidade)
            };
        }));
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao gerar a recomendação." });
    }
}

async function listarGeneros(req, res) {
    try {
        var linhas = await model.listarGeneros();
        res.json(linhas.map(function (l) { return l.genero; }));
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao carregar os gêneros." });
    }
}

async function listar(req, res) {
    var idFuncionario = idValido(req.params.idFuncionario);
    if (!idFuncionario) return res.status(400).json({ mensagem: "Funcionário inválido." });
    try {
        var linhas = await model.listar(idFuncionario);
        res.json(linhas.map(formatar));
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao carregar os feats cadastrados." });
    }
}

async function cadastrar(req, res) {
    var idFuncionario = idValido(req.body.idFuncionario);
    if (!idFuncionario) return res.status(400).json({ mensagem: "Funcionário inválido." });

    var nome = lerNome(req.body);
    if (!nome) return res.status(400).json({ mensagem: "Dê um nome (até 40 caracteres) para a recomendação." });

    var lido = lerFiltros(req.body);
    if (lido.erro) return res.status(400).json({ mensagem: lido.erro });

    var nomes = lerNomesArtistas(req.body.artistas);
    if (nomes.length == 0) return res.status(400).json({ mensagem: "Nenhum artista para salvar." });

    try {
        var resultado = await model.cadastrar(nome, lido.filtros, nomes, idFuncionario);
        res.status(201).json({ id: resultado.insertId });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao salvar a recomendação." });
    }
}

// Editar
async function atualizar(req, res) {
    var id = idValido(req.params.id);
    var idFuncionario = idValido(req.body.idFuncionario);
    if (!id || !idFuncionario) return res.status(400).json({ mensagem: "Requisição inválida." });

    var nome = lerNome(req.body);
    if (!nome) return res.status(400).json({ mensagem: "Dê um nome para a recomendação." });

    var lido = lerFiltros(req.body);
    if (lido.erro) return res.status(400).json({ mensagem: lido.erro });

    try {
        var novos = await model.recomendar(lido.filtros);
        if (novos.length == 0) {
            return res.status(400).json({ mensagem: "Nenhum artista encontrado com esses filtros." });
        }
        var nomes = novos.map(function (a) { return a.nome; });
        var resultado = await model.atualizar(id, nome, lido.filtros, nomes, idFuncionario);
        if (resultado.affectedRows == 0) return res.status(404).json({ mensagem: "Recomendação não encontrada." });
        res.json({ ok: true });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao salvar as alterações." });
    }
}

async function excluir(req, res) {
    var id = idValido(req.params.id);
    var idFuncionario = idValido(req.query.idFuncionario);
    if (!id || !idFuncionario) return res.status(400).json({ mensagem: "Requisição inválida." });
    try {
        var resultado = await model.excluir(id, idFuncionario);
        if (resultado.affectedRows == 0) return res.status(404).json({ mensagem: "Recomendação não encontrada." });
        res.json({ ok: true });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao excluir a recomendação." });
    }
}

module.exports = { recomendar, listarGeneros, listar, cadastrar, atualizar, excluir };
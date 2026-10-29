var model = require("../models/metricaModel");
var caracteristicas = require("../models/caracteristicas");

var PERIODOS = ["5anos", "10anos", "todos", "personalizado"];
var GENEROS = ["Pop", "R&B", "MPB", "Hip-Hop", "Eletrônica", "Funk", "Samba"];

function lerAnalise(body) {
    var nome = (body.nome || "").trim();
    if (nome.length < 3 || nome.length > 60) {
        return { erro: "O nome da análise deve ter entre 3 e 60 caracteres." };
    }

    var periodo = PERIODOS.indexOf(body.periodo) >= 0 ? body.periodo : "todos";
    var anoAtual = new Date().getFullYear();
    var anoInicio = null;
    var anoFim = null;

    if (periodo == "5anos") {
        anoInicio = anoAtual - 5;
        anoFim = anoAtual;
    } else if (periodo == "10anos") {
        anoInicio = anoAtual - 10;
        anoFim = anoAtual;
    } else if (periodo == "personalizado") {
        anoInicio = parseInt(body.anoInicio);
        anoFim = parseInt(body.anoFim);
        if (isNaN(anoInicio) || isNaN(anoFim) || anoInicio < 1900 || anoFim > anoAtual || anoInicio > anoFim) {
            return { erro: "Informe um período válido (de 1900 até " + anoAtual + ", com início antes do fim)." };
        }
    }

    var generos = Array.isArray(body.generos) ? body.generos : [];
    generos = generos.filter(function (g, i) {
        return GENEROS.indexOf(g) >= 0 && generos.indexOf(g) == i;
    });

    var filtros = caracteristicas.normalizar(body.caracteristicas);
    if (!filtros) {
        return { erro: "Nas características musicais, o mínimo não pode ser maior que o máximo." };
    }

    return {
        analise: {
            nome: nome,
            periodo: periodo,
            anoInicio: anoInicio,
            anoFim: anoFim,
            generos: generos.length ? generos.join(",") : null,
            caracteristicas: filtros
        }
    };
}

function formatar(linha) {
    return {
        id: linha.id,
        nome: linha.nome,
        periodo: linha.periodo,
        anoInicio: linha.anoInicio,
        anoFim: linha.anoFim,
        generos: linha.generos ? linha.generos.split(",") : [],
        caracteristicas: caracteristicas.normalizar(linha.caracteristicas) || {},
        totalMusicas: linha.totalMusicas,
        dataCriacao: linha.dataCriacao
    };
}

function idValido(valor) {
    var n = parseInt(valor);
    return !isNaN(n) && n > 0 ? n : null;
}

async function contar(filtros) {
    var resultado = await model.contarMusicas(filtros);
    return resultado[0] ? Number(resultado[0].total) : 0;
}

async function listar(req, res) {
    var idFuncionario = idValido(req.params.idFuncionario);
    if (!idFuncionario) return res.status(400).json({ mensagem: "Funcionário inválido." });
    try {
        var linhas = await model.listar(idFuncionario, (req.query.busca || "").trim(), req.query.ordem);
        res.json(linhas.map(formatar));
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao carregar as análises." });
    }
}

async function buscar(req, res) {
    var id = idValido(req.params.id);
    var idFuncionario = idValido(req.query.idFuncionario);
    if (!id || !idFuncionario) return res.status(400).json({ mensagem: "Requisição inválida." });
    try {
        var linhas = await model.buscarPorId(id, idFuncionario);
        if (linhas.length == 0) return res.status(404).json({ mensagem: "Análise não encontrada." });
        res.json(formatar(linhas[0]));
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao carregar a análise." });
    }
}

function listarCaracteristicas(req, res) {
    res.json(caracteristicas.CARACTERISTICAS);
}

async function contagem(req, res) {
    var filtros = caracteristicas.normalizar(req.query.filtros);
    if (!filtros) return res.status(400).json({ mensagem: "Faixa inválida." });
    try {
        res.json({ total: await contar(filtros) });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao contar as músicas." });
    }
}

async function cadastrar(req, res) {
    var idFuncionario = idValido(req.body.idFuncionario);
    if (!idFuncionario) return res.status(400).json({ mensagem: "Funcionário inválido." });

    var lido = lerAnalise(req.body);
    if (lido.erro) return res.status(400).json({ mensagem: lido.erro });

    try {
        lido.analise.totalMusicas = await contar(lido.analise.caracteristicas);
        var resultado = await model.cadastrar(lido.analise, idFuncionario);
        res.status(201).json({ id: resultado.insertId, totalMusicas: lido.analise.totalMusicas });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao salvar a análise." });
    }
}

async function atualizar(req, res) {
    var id = idValido(req.params.id);
    var idFuncionario = idValido(req.body.idFuncionario);
    if (!id || !idFuncionario) return res.status(400).json({ mensagem: "Requisição inválida." });

    var lido = lerAnalise(req.body);
    if (lido.erro) return res.status(400).json({ mensagem: lido.erro });

    try {
        lido.analise.totalMusicas = await contar(lido.analise.caracteristicas);
        var resultado = await model.atualizar(id, lido.analise, idFuncionario);
        if (resultado.affectedRows == 0) return res.status(404).json({ mensagem: "Análise não encontrada." });
        res.json({ ok: true, totalMusicas: lido.analise.totalMusicas });
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
        if (resultado.affectedRows == 0) return res.status(404).json({ mensagem: "Análise não encontrada." });
        res.json({ ok: true });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao excluir a análise." });
    }
}

module.exports = { listarCaracteristicas, listar, buscar, contagem, cadastrar, atualizar, excluir };

var model = require("../models/metricaModel");
var caracteristicas = require("../models/caracteristicas");

var PERIODOS = ["5anos", "10anos", "todos", "personalizado"];

async function generosDisponiveis() {
    var linhas = await model.listarGeneros();
    return linhas.map(function (l) { return l.genero; });
}

function lerFiltros(body, generosValidos) {
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
        return generosValidos.indexOf(g) >= 0 && generos.indexOf(g) == i;
    });

    var faixas = caracteristicas.normalizar(body.caracteristicas);
    if (!faixas) {
        return { erro: "Nas características musicais, o mínimo não pode ser maior que o máximo." };
    }

    return {
        filtros: {
            periodo: periodo,
            anoInicio: anoInicio,
            anoFim: anoFim,
            generos: generos,
            caracteristicas: faixas
        }
    };
}

function lerAnalise(body, generosValidos) {
    var nome = (body.nome || "").trim();
    if (nome.length < 3 || nome.length > 60) {
        return { erro: "O nome da análise deve ter entre 3 e 60 caracteres." };
    }

    var lido = lerFiltros(body, generosValidos);
    if (lido.erro) return lido;

    lido.filtros.nome = nome;
    return { analise: lido.filtros };
}

function paraBanco(analise) {
    return Object.assign({}, analise, {
        generos: analise.generos.length ? analise.generos.join(",") : null
    });
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

function numeroOuNulo(valor) {
    if (valor === null || valor === undefined || valor === "") return null;
    var n = Number(valor);
    return isNaN(n) ? null : n;
}

async function dashboard(req, res) {
    var id = idValido(req.params.id);
    var idFuncionario = idValido(req.query.idFuncionario);
    if (!id || !idFuncionario) return res.status(400).json({ mensagem: "Requisição inválida." });
    try {
        var linhas = await model.buscarPorId(id, idFuncionario);
        if (linhas.length == 0) return res.status(404).json({ mensagem: "Análise não encontrada." });

        var analise = formatar(linhas[0]);
        var musicas = await model.listarMusicasFiltradas(analise);

        res.json({
            analise: analise,
            musicas: musicas.map(function (m) {
                return {
                    id: m.id,
                    titulo: m.titulo,
                    artista: m.artista || "",
                    genero: m.genero,
                    anoLancamento: m.anoLancamento,
                    dancabilidade: numeroOuNulo(m.dancabilidade),
                    energia: numeroOuNulo(m.energia),
                    tonalidade: numeroOuNulo(m.tonalidade),
                    acustica: numeroOuNulo(m.acustica),
                    vivicidade: numeroOuNulo(m.vivicidade),
                    valenciaPositividade: numeroOuNulo(m.valenciaPositividade),
                    tempoBPM: numeroOuNulo(m.tempoBPM),
                    duracaoMs: numeroOuNulo(m.duracaoMs),
                    streams: numeroOuNulo(m.streams),
                    views: numeroOuNulo(m.views)
                };
            })
        });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao carregar o dashboard da análise." });
    }
}

function listarCaracteristicas(req, res) {
    res.json(caracteristicas.CARACTERISTICAS);
}

async function listarGeneros(req, res) {
    try {
        res.json(await model.listarGeneros());
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao carregar os gêneros." });
    }
}

async function contagem(req, res) {
    try {
        var lido = lerFiltros(req.body, await generosDisponiveis());
        if (lido.erro) return res.status(400).json({ mensagem: lido.erro });
        res.json({ total: await contar(lido.filtros) });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao contar as músicas." });
    }
}

async function cadastrar(req, res) {
    var idFuncionario = idValido(req.body.idFuncionario);
    if (!idFuncionario) return res.status(400).json({ mensagem: "Funcionário inválido." });

    try {
        var lido = lerAnalise(req.body, await generosDisponiveis());
        if (lido.erro) return res.status(400).json({ mensagem: lido.erro });

        lido.analise.totalMusicas = await contar(lido.analise);
        var resultado = await model.cadastrar(paraBanco(lido.analise), idFuncionario);
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

    try {
        var lido = lerAnalise(req.body, await generosDisponiveis());
        if (lido.erro) return res.status(400).json({ mensagem: lido.erro });

        lido.analise.totalMusicas = await contar(lido.analise);
        var resultado = await model.atualizar(id, paraBanco(lido.analise), idFuncionario);
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

module.exports = { listarCaracteristicas, listarGeneros, listar, buscar, dashboard, contagem, cadastrar, atualizar, excluir };
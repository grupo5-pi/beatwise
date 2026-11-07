var model = require("../models/artistaModel");

function porcento(valor) {
    return valor === null || valor === undefined ? 0 : Math.round(Number(valor) * 100);
}

async function buscar(req, res) {
    var id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) return res.status(400).json({ mensagem: "Artista inválido." });
    try {
        var linhas = await model.buscarPorId(id);
        if (linhas.length == 0) return res.status(404).json({ mensagem: "Artista não encontrado." });

        var a = linhas[0];
        res.json({
            id: a.id,
            nome: a.nome,
            totalMusicas: Number(a.totalMusicas),
            streams: Number(a.streams) || 0,
            views: Number(a.views) || 0,
            curtidas: Number(a.curtidas) || 0,
            comentarios: Number(a.comentarios) || 0,
            perfil: {
                dancabilidade: porcento(a.dancabilidade),
                energia: porcento(a.energia),
                valencia: porcento(a.valencia),
                acustica: porcento(a.acustica),
                instrumentalidade: porcento(a.instrumentalidade)
            },
            bpm: Math.round(Number(a.bpm)) || 0,
            duracaoMs: Math.round(Number(a.duracaoMs)) || 0
        });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao carregar o artista." });
    }
}

module.exports = { buscar };

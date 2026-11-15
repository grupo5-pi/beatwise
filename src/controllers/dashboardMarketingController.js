var dashboardMarketingModel = require("../models/dashboardMarketingModel");

async function marketing(req, res) {
    try {
        var r = await Promise.all([
            dashboardMarketingModel.melhorEngajamento(),
            dashboardMarketingModel.desbalanceio(),
            dashboardMarketingModel.engajamentoClipe(),
            dashboardMarketingModel.engajamentoFeat(),
            dashboardMarketingModel.mediaPlataformas()
        ]);

        var melhor = null;
        if (r[0].length > 0) {
            var taxa = Number(r[0][0].taxa);
            var media = Number(r[0][0].mediaBase);

            melhor = {
                nome: r[0][0].nome,
                views: Number(r[0][0].views),
                likes: Number(r[0][0].likes),
                taxa: taxa,
                acima: media > 0 ? (taxa - media) / media * 100 : 0
            };
        }

        var desbalanceio = r[1].map(function (m) {
            return { nome: m.nome, views: Number(m.views), streams: Number(m.streams) };
        });

        var clipe = { com: 0, sem: 0 };
        r[2].forEach(function (l) {
            if (l.clipe == 1) clipe.com = Number(l.taxa);
            else clipe.sem = Number(l.taxa);
        });

        var feat = { feat: 0, solo: 0 };
        r[3].forEach(function (l) {
            if (l.feat == 1) feat.feat = Number(l.taxa);
            else feat.solo = Number(l.taxa);
        });

        var plataforma = {
            spotify: Number(r[4][0].spotify) || 0,
            youtube: Number(r[4][0].youtube) || 0
        };

        res.status(200).json({ melhor, desbalanceio, clipe, feat, plataforma });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao carregar a dashboard de marketing." });
    }
}

module.exports = { marketing };
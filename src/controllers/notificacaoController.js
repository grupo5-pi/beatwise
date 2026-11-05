var notificacaoModel = require("../models/notificacaoModel");

function salvarNotificacao(req, res) {
    
    var fkFuncionario = Number(req.body.fkFuncionarioServer);
    var tema = req.body.temaServer;
    var opcoes = req.body.opcoesServer;

    if (req.body.fkFuncionarioServer == undefined) {
        res.status(400).send("O fkFuncionario está undefined!");
    } else if (Number.isInteger(fkFuncionario) == false) {
        res.status(400).send("O fkFuncionario precisa ser um número inteiro!");
    } else if (tema == undefined) {
        res.status(400).send("O tema está undefined!");
    } else if (notificacaoModel.buscarTema(tema) == null) {
        res.status(400).send("Tema inválido!");
    } else if (Array.isArray(opcoes) == false) {
        res.status(400).send("As opções estão undefined ou em formato inválido!");
    } else if (opcoes.length != notificacaoModel.buscarTema(tema).colunas.length) {
        res.status(400).send("Quantidade de opções inválida para esse tema!");
    } else {

        notificacaoModel.salvarNotificacao(fkFuncionario, tema, opcoes)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao salvar a notificação! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

module.exports = {
    salvarNotificacao
}
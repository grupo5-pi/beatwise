var notificacaoModel = require("../models/notificacaoModel");

function salvarNotificacao(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var razaoSocial = req.body.razaoSocialServer;
    var emailEmpresa = req.body.emailEmpresaServer;
    var cnpj = req.body.cnpjServer;
    var telefone = req.body.telefoneServer;

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (razaoSocial == undefined) {
        res.status(400).send("A razão social está undefined!");
    }else if (emailEmpresa == undefined) {
        res.status(400).send("O email da empresa está undefined!");
    }else if (cnpj == undefined) {
        res.status(400).send("Seu cnpj está undefined!");
    }  else if (telefone == undefined) {
        res.status(400).send("Seu telefone está undefined!"); 
    } else {

        // Passe os valores como parâmetro e vá para o arquivo notificacaoModel.js
        notificacaoModel.salvarNotificacao(nome, email, senha, razaoSocial, emailEmpresa, cnpj, telefone)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
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
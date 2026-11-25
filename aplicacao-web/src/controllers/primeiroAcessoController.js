var primeiroAcessoModel = require("../models/primeiroAcessoModel");

var MAXIMO_TENTATIVAS = 5;
var MENSAGEM_CODIGO_INVALIDO = "Código inválido ou expirado.";

function senhaValida(senha) {
    var temEspecial = /[@#$%&*!?_\-]/.test(senha);
    var temNum = /[0-9]/.test(senha);
    var temMaiuscula = /[A-Z]/.test(senha);
    var temMinuscula = /[a-z]/.test(senha);
    return senha.length >= 8 && senha.length <= 100 && temEspecial && temNum && temMaiuscula && temMinuscula;
}

async function definirSenha(req, res) {
    try {
        var email = (req.body.emailServer || "").trim();
        var codigo = (req.body.codigoServer || "").trim().toUpperCase();
        var senha = req.body.senhaServer || "";
        var confirmacao = req.body.confirmacaoServer || "";

        if (email == "" || email.length > 45 || !/^[A-Z0-9]{8}$/.test(codigo)) {
            return res.status(400).json({ mensagem: MENSAGEM_CODIGO_INVALIDO });
        }
        if (!senhaValida(senha)) {
            return res.status(400).json({
                mensagem: "A senha deve ter 8 ou mais caracteres, com letra maiúscula, minúscula, número e caractere especial (@ # $ % & * ! ? _ -)."
            });
        }
        if (senha != confirmacao) {
            return res.status(400).json({ mensagem: "A confirmação não coincide com a senha." });
        }

        var token = await primeiroAcessoModel.buscarTokenAtivo(email);

        // E-mail inexistente e código errado dão a mesma resposta, para ninguém descobrir quem é funcionário
        if (token.length == 0) {
            return res.status(400).json({ mensagem: MENSAGEM_CODIGO_INVALIDO });
        }
        if (token[0].tentativas >= MAXIMO_TENTATIVAS) {
            return res.status(429).json({ mensagem: "Muitas tentativas erradas. Peça um novo código ao administrador." });
        }
        if (token[0].codigo.toUpperCase() != codigo) {
            await primeiroAcessoModel.registrarTentativaErrada(token[0].id);
            return res.status(400).json({ mensagem: MENSAGEM_CODIGO_INVALIDO });
        }

        // Marca o código como usado ANTES de gravar a senha: dois pedidos ao mesmo tempo não passam os dois
        var consumido = await primeiroAcessoModel.consumirToken(token[0].id);
        if (consumido && consumido.affectedRows === 0) {
            return res.status(400).json({ mensagem: MENSAGEM_CODIGO_INVALIDO });
        }

        try {
            await primeiroAcessoModel.definirSenha(token[0].fkFuncionario, senha);
        } catch (erroSenha) {
            await primeiroAcessoModel.liberarToken(token[0].id);
            throw erroSenha;
        }

        await primeiroAcessoModel.invalidarTokens(token[0].fkFuncionario);

        res.json({ ok: true });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao definir a senha." });
    }
}

module.exports = { definirSenha };

var model = require("../models/funcionarioModel");

async function obterPerfil(req, res) {
    try {
        var resultado = await model.buscarPorId(req.params.id);
        if (resultado.length == 0) {
            return res.status(404).json({ mensagem: "Usuário não encontrado." });
        }
        res.json(resultado[0]);
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao carregar o perfil." });
    }
}

async function atualizarNome(req, res) {
    try {
        var nome = (req.body.nome || "").trim();
        if (nome.length < 3 || nome.length > 45) {
            return res.status(400).json({ mensagem: "O nome deve ter entre 3 e 45 caracteres." });
        }
        await model.atualizarNome(req.params.id, nome.replace(/'/g, "''"));
        await model.registrarLog(req.params.id, "Nome alterado pelo próprio usuário.");
        res.json({ ok: true, nome: nome });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao salvar as alterações." });
    }
}

async function alterarSenha(req, res) {
    try {
        var senhaAtual = req.body.senhaAtual;
        var novaSenha = req.body.novaSenha;
        var confirmacao = req.body.confirmacao;
        var id = req.params.id;

        if (!senhaAtual || !novaSenha || !confirmacao) {
            return res.status(400).json({ mensagem: "Preencha todos os campos." });
        }

        var confere = await model.verificarSenha(id, senhaAtual.replace(/'/g, "''"));
        if (confere.length == 0) {
            return res.status(400).json({ mensagem: "A senha atual está incorreta." });
        }
        if (novaSenha.length < 8) {
            return res.status(400).json({ mensagem: "A nova senha deve ter pelo menos 8 caracteres." });
        }
        if (novaSenha == senhaAtual) {
            return res.status(400).json({ mensagem: "A nova senha deve ser diferente da atual." });
        }
        if (novaSenha != confirmacao) {
            return res.status(400).json({ mensagem: "A confirmação não coincide com a nova senha." });
        }

        await model.atualizarSenha(id, novaSenha.replace(/'/g, "''"));
        await model.registrarLog(id, "Senha alterada pelo próprio usuário.");
        res.json({ ok: true });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao alterar a senha." });
    }
}

async function excluirConta(req, res) {
    try {
        await model.excluir(req.params.id);
        res.json({ ok: true });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao excluir a conta." });
    }
}

async function atualizarFoto(req, res) {
    try {
        var foto = req.body.foto;

        // Só aceita imagem em base64 e de tamanho razoável
        var valida = foto && /^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/.test(foto);
        if (!valida || foto.length > 500000) {
            return res.status(400).json({ mensagem: "Imagem inválida ou muito grande." });
        }

        await model.atualizarFoto(req.params.id, foto);
        await model.registrarLog(req.params.id, "Foto de perfil alterada pelo próprio usuário.");
        res.json({ ok: true });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao salvar a foto." });
    }
}

module.exports = { obterPerfil, atualizarNome, alterarSenha, atualizarFoto, excluirConta };
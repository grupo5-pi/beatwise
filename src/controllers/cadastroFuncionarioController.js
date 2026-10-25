var cadastroFuncionarioModel = require("../models/cadastroFuncionarioModel");

function emailValido(email) {
    return email.includes('@')
        && email.indexOf('@') > 0
        && email.lastIndexOf('.') > email.indexOf('@') + 1
        && email.lastIndexOf('.') < email.length - 1;
}

function senhaValida(senha) {
    var temEspecial = /[@#$%&*!?_\-]/.test(senha);
    var temNum = /[0-9]/.test(senha);
    var temMaiuscula = /[A-Z]/.test(senha);
    var temMinuscula = /[a-z]/.test(senha);
    return senha.length >= 8 && temEspecial && temNum && temMaiuscula && temMinuscula;
}

async function cadastrarFuncionario(req, res) {
    try {
        var nome = (req.body.nomeServer || "").trim();
        var email = (req.body.emailServer || "").trim();
        var cargo = (req.body.cargoServer || "").trim();
        var senha = req.body.senhaServer || "";
        var idAdmin = parseInt(req.body.idAdminServer);

        if (nome.length < 3 || nome.length > 45) {
            return res.status(400).json({ mensagem: "O nome deve ter entre 3 e 45 caracteres." });
        }
        if (!emailValido(email) || email.length > 45) {
            return res.status(400).json({ mensagem: "Digite um email válido (Ex: fulano@mail.com)" });
        }
        if (cargo == "") {
            return res.status(400).json({ mensagem: "Informe o cargo." });
        }
        if (!Number.isInteger(idAdmin)) {
            return res.status(400).json({ mensagem: "Usuário não identificado." });
        }
        if (!senhaValida(senha) || senha.length > 100) {
            return res.status(400).json({ mensagem: "Senha provisória inválida." });
        }

        var admin = await cadastroFuncionarioModel.buscarAdminPorId(idAdmin);
        if (admin.length == 0 || admin[0].cargo != "Administrador") {
            return res.status(403).json({ mensagem: "Apenas administradores podem cadastrar funcionários." });
        }

        var cargoEncontrado = await cadastroFuncionarioModel.buscarCargoPorNome(cargo.replace(/'/g, "''"));
        if (cargoEncontrado.length == 0) {
            return res.status(404).json({ mensagem: "Cargo não encontrado." });
        }

        var emailExistente = await cadastroFuncionarioModel.verificarEmailExistente(email.replace(/'/g, "''"));
        if (emailExistente.length > 0) {
            return res.status(409).json({ mensagem: "Já existe um funcionário com esse e-mail." });
        }

        await cadastroFuncionarioModel.cadastrarFuncionario(
            nome.replace(/'/g, "''"),
            email.replace(/'/g, "''"),
            senha.replace(/'/g, "''"),
            admin[0].fkEmpresa,
            cargoEncontrado[0].id
        );

        res.status(201).json({ ok: true });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao cadastrar o funcionário." });
    }
}

module.exports = { cadastrarFuncionario };

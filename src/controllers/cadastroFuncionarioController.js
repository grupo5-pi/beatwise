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

function escapar(texto) {
    return texto.replace(/\\/g, "\\\\").replace(/'/g, "''");
}

// Retorna o admin (com fkEmpresa) ou null se não for administrador
async function validarAdmin(idAdmin) {
    if (!Number.isInteger(idAdmin)) return null;
    var admin = await cadastroFuncionarioModel.buscarAdminPorId(idAdmin);
    if (admin.length == 0 || admin[0].cargo != "Administrador") return null;
    return admin[0];
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

/* Lista de Funcionarios */

async function listarFuncionarios(req, res) {
    try {
        var admin = await validarAdmin(parseInt(req.params.idAdmin));
        if (!admin) {
            return res.status(403).json({ mensagem: "Apenas administradores podem ver os funcionários." });
        }

        var lista = await cadastroFuncionarioModel.listarPorEmpresa(admin.fkEmpresa);
        res.status(200).json(lista);
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao listar os funcionários." });
    }
}

async function atualizarFuncionario(req, res) {
    try {
        var id = parseInt(req.params.id);
        var idAdmin = parseInt(req.body.idAdminServer);
        var nome = (req.body.nomeServer || "").trim();
        var email = (req.body.emailServer || "").trim();
        var cargo = (req.body.cargoServer || "").trim();
        var senha = req.body.senhaServer || "";

        if (!Number.isInteger(id)) {
            return res.status(400).json({ mensagem: "Funcionário inválido." });
        }
        if (nome.length < 3 || nome.length > 45) {
            return res.status(400).json({ mensagem: "O nome deve ter entre 3 e 45 caracteres." });
        }
        if (!emailValido(email) || email.length > 45) {
            return res.status(400).json({ mensagem: "Digite um email válido (Ex: fulano@mail.com)" });
        }
        if (cargo == "") {
            return res.status(400).json({ mensagem: "Informe o cargo." });
        }
        if (senha != "" && (!senhaValida(senha) || senha.length > 100)) {
            return res.status(400).json({
                mensagem: "A senha deve ter 8+ caracteres, com maiúscula, minúscula, número e caractere especial."
            });
        }

        var admin = await validarAdmin(idAdmin);
        if (!admin) {
            return res.status(403).json({ mensagem: "Apenas administradores podem editar funcionários." });
        }

        var alvo = await cadastroFuncionarioModel.buscarFuncionarioPorId(id);
        if (alvo.length == 0) {
            return res.status(404).json({ mensagem: "Funcionário não encontrado." });
        }
        if (alvo[0].fkEmpresa != admin.fkEmpresa) {
            return res.status(403).json({ mensagem: "Esse funcionário não pertence à sua empresa." });
        }

        var cargoEncontrado = await cadastroFuncionarioModel.buscarCargoPorNome(escapar(cargo));
        if (cargoEncontrado.length == 0) {
            return res.status(404).json({ mensagem: "Cargo não encontrado." });
        }

        var emailExistente = await cadastroFuncionarioModel.verificarEmailDeOutro(escapar(email), id);
        if (emailExistente.length > 0) {
            return res.status(409).json({ mensagem: "Já existe um funcionário com esse e-mail." });
        }

        await cadastroFuncionarioModel.atualizarFuncionario(
            id,
            escapar(nome),
            escapar(email),
            cargoEncontrado[0].id,
            senha == "" ? "" : escapar(senha)
        );

        res.status(200).json({ ok: true });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao atualizar o funcionário." });
    }
}

async function excluirFuncionario(req, res) {
    try {
        var id = parseInt(req.params.id);
        var idAdmin = parseInt(req.body.idAdminServer);

        if (!Number.isInteger(id)) {
            return res.status(400).json({ mensagem: "Funcionário inválido." });
        }
        if (id == idAdmin) {
            return res.status(400).json({ mensagem: "Você não pode excluir o seu próprio usuário." });
        }

        var admin = await validarAdmin(idAdmin);
        if (!admin) {
            return res.status(403).json({ mensagem: "Apenas administradores podem excluir funcionários." });
        }

        var alvo = await cadastroFuncionarioModel.buscarFuncionarioPorId(id);
        if (alvo.length == 0) {
            return res.status(404).json({ mensagem: "Funcionário não encontrado." });
        }
        if (alvo[0].fkEmpresa != admin.fkEmpresa) {
            return res.status(403).json({ mensagem: "Esse funcionário não pertence à sua empresa." });
        }

        try {
            await cadastroFuncionarioModel.excluirFuncionario(id);
        } catch (erroDelete) {
            if (erroDelete.code == "ER_ROW_IS_REFERENCED_2") {
                return res.status(409).json({
                    mensagem: "Esse funcionário tem registros vinculados (logs, acessos ou subalternos) e não pode ser excluído."
                });
            }
            throw erroDelete;
        }

        res.status(200).json({ ok: true });
    } catch (erro) {
        console.log(erro);
        res.status(500).json({ mensagem: "Erro ao excluir o funcionário." });
    }
}

module.exports = {
    cadastrarFuncionario,
    listarFuncionarios,
    atualizarFuncionario,
    excluirFuncionario
};
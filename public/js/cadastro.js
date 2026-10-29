function continuar() {
    // Valida todos os campos do passo 1 antes de deixar avançar
    validarRazaoSocial();
    validarEmailEmpresa();
    validarCNPJ();
    validarTelefone();

    if (validacaoRazaoSocial && validacaoEmailEmpresa && validacaoCNPJ && validacaoTelefone) {
        document.getElementById("formulario1").style.display = "none";
        document.getElementById("formulario2").style.display = "flex";
    } else {
        mensagem1.innerHTML = '<span class="erro">Preencha todos os campos corretamente antes de continuar!</span>';
    }
}

function voltar() {
    document.getElementById("formulario1").style.display = "flex";
    document.getElementById("formulario2").style.display = "none";
}

function mascaraCNPJ(input) {
    let valor = input.value.replace(/\D/g, "");

    valor = valor.replace(/^(\d{2})(\d)/, "$1.$2");
    valor = valor.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
    valor = valor.replace(/\.(\d{3})(\d)/, ".$1/$2");
    valor = valor.replace(/(\d{4})(\d)/, "$1-$2");

    input.value = valor;
}

function mascaraTelefone(input) {
    let valor = input.value.replace(/\D/g, "");
    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");
    input.value = valor;
}

let validacaoRazaoSocial = false;
let validacaoEmailEmpresa = false;
let validacaoCNPJ = false;
let validacaoTelefone = false;

let validacaoNome = false;
let validacaoEmail = false;
let validacaoSenha = false;
let validacaoConfirmSenha = false;

function validarRazaoSocial() {
    let razaoSocial = input_razao_social.value;

    if (razaoSocial.length >= 3) {
        validacaoRazaoSocial = true;
        mensagem1.innerHTML = '';
    } else {
        validacaoRazaoSocial = false;
        mensagem1.innerHTML = '<span class="erro">Digite uma razão social válida (mínimo 3 caracteres)</span>';
    }
}

function validarEmailEmpresa() {
    let email = input_email_empresa.value;

    if (email.includes('@') && email.indexOf('@') > 0 && email.lastIndexOf('.') > email.indexOf('@') + 1 && email.lastIndexOf('.') < email.length - 1) {
        validacaoEmailEmpresa = true;
        mensagem1.innerHTML = '';
    } else {
        validacaoEmailEmpresa = false;
        mensagem1.innerHTML = '<span class="erro">Digite um email válido (Ex: beatwise@mail.com)</span>';
    }
}

function validarCNPJ() {
    let cnpj = input_cnpj.value;

    if (cnpj.length < 18) {
        validacaoCNPJ = false;
        mensagem1.innerHTML = '<span class="erro">Digite um CNPJ válido (Ex: 12.345.678/0001-90)</span>';
    } else {
        validacaoCNPJ = true;
        mensagem1.innerHTML = '';
    }
}

function validarTelefone() {
    let telefone = input_telefone.value;
    if (telefone.length < 14) {
        validacaoTelefone = false;
        mensagem1.innerHTML = `<span class="erro">Digite um telefone válido (Ex: (11) 12345-6789)</span>`;
    } else {
        validacaoTelefone = true;
        mensagem1.innerHTML = '';
    }
}

function validarNome() {
    let nome = input_nome.value;

    if (nome.length >= 3) {
        validacaoNome = true;
        mensagem2.innerHTML = '';
    } else {
        validacaoNome = false;
        mensagem2.innerHTML = '<span class="erro">Digite um nome válido (mínimo 3 caracteres)</span>';
    }
}

function validarEmail() {
    let email = input_email.value;

    if (email.includes('@') && email.indexOf('@') > 0 && email.lastIndexOf('.') > email.indexOf('@') + 1 && email.lastIndexOf('.') < email.length - 1) {
        validacaoEmail = true;
        mensagem2.innerHTML = '';
    } else {
        validacaoEmail = false;
        mensagem2.innerHTML = '<span class="erro">Digite um email válido (Ex: fulano@mail.com)</span>';
    }
}

function validarSenha() {
    let senha = input_senha.value;
    let temEspecial = false;
    let temNum = false;
    let temMaiuscula = false;
    let temMinuscula = false;

    let especial = ["@", "#", "$", "%", "&", "*", "!", "?", "_", "-"];
    let num = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    let maiuscula = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    let minuscula = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

    for (let i = 0; i < senha.length; i++) {
        let letra = senha[i];
        if (especial.includes(letra)) temEspecial = true;
        if (num.includes(letra)) temNum = true;
        if (maiuscula.includes(letra)) temMaiuscula = true;
        if (minuscula.includes(letra)) temMinuscula = true;
    }
    if (senha.length >= 8 && temEspecial && temNum && temMaiuscula && temMinuscula) {
        validacaoSenha = true;
        mensagem2.innerHTML = '';
    } else {
        validacaoSenha = false;
        mensagem2.innerHTML = `<span class="erro">A senha deve ter no mínimo 8 caracteres, caractere especial, um número, letra maiúscula e minúscula.</span>`;
    }
}

function validarConfirmSenha() {
    let senha = input_senha.value;
    let confirSenha = input_confirmar_senha.value;

    if (senha == confirSenha && senha.length > 0) {
        validacaoConfirmSenha = true;
        mensagem2.innerHTML = '';
    } else {
        mensagem2.innerHTML = `<span class="erro">As senhas não estão iguais!</span>`;
        validacaoConfirmSenha = false;
    }
}

function cadastrar() {
    // Se quiser debugar, descomente a linha abaixo para ver quais validações estão false no console do navegador (F12)
    // console.log({ r: validacaoRazaoSocial, ep: validacaoEmailEmpresa, c: validacaoCNPJ, t: validacaoTelefone, n: validacaoNome, e: validacaoEmail, s: validacaoSenha, cs: validacaoConfirmSenha });

    if (validacaoRazaoSocial && validacaoEmailEmpresa && validacaoCNPJ && validacaoTelefone && validacaoNome && validacaoEmail && validacaoSenha && validacaoConfirmSenha) {
        let nome = input_nome.value;
        let email = input_email.value;
        let senha = input_senha.value;

        let razaoSocial = input_razao_social.value;
        let emailEmpresa = input_email_empresa.value;
        let cnpj = input_cnpj.value;
        let telefone = input_telefone.value;

        fetch("/usuarios/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nomeServer: nome,
                emailServer: email,
                senhaServer: senha,
                razaoSocialServer: razaoSocial,
                emailEmpresaServer: emailEmpresa,
                cnpjServer: cnpj,
                telefoneServer: telefone,
            }),
        })
            .then(function (resposta) {
                console.log("resposta: ", resposta);
                if (resposta.ok) {
                    mensagem2.innerHTML = `<span class="realizado">Seu cadastro foi realizado com sucesso!</span>`;
                    setTimeout(() => {
                        window.location.href = 'login.html';
                    }, 1500);
                } else {
                    throw "Houve um erro ao tentar realizar o cadastro!";
                }
            })
            .catch(function (erro) {
                console.error(erro);
                mensagem2.innerHTML = `<span class="erro">${erro}</span>`;
            });
    } else {
        mensagem2.innerHTML = `<span class="erro">Preencha todos os campos corretamente antes de cadastrar!</span>`;
    }
}
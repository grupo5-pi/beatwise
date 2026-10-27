var emailDaUrl = new URLSearchParams(window.location.search).get("email");
if (emailDaUrl) input_email.value = emailDaUrl;

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

function mostrarErro(texto) {
    mensagem1.innerHTML = `<span class="erro">${texto}</span>`;
}

function criarSenha() {
    var email = input_email.value.trim();
    var codigo = input_codigo.value.trim();
    var senha = input_senha.value;
    var confirmacao = input_confirmar_senha.value;

    if (!emailValido(email)) {
        return mostrarErro("Digite um email válido (Ex: fulano@mail.com)");
    }
    if (codigo.length != 8) {
        return mostrarErro("O código do e-mail tem 8 caracteres.");
    }
    if (!senhaValida(senha)) {
        return mostrarErro("A senha não atende aos requisitos.");
    }
    if (senha != confirmacao) {
        return mostrarErro("A confirmação não coincide com a senha.");
    }

    mensagem1.innerHTML = "";
    btn_criar.disabled = true;

    fetch("/primeiroAcesso/definir-senha", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            emailServer: email,
            codigoServer: codigo,
            senhaServer: senha,
            confirmacaoServer: confirmacao
        })
    }).then(function (resposta) {
        if (resposta.ok) {
            mensagem1.innerHTML = `<span class="realizado">Senha criada! Redirecionando para o login...</span>`;
            setTimeout(function () {
                window.location = "login.html";
            }, 2000);
            return;
        }

        resposta.json().then(function (json) {
            mostrarErro(json.mensagem || "Não foi possível criar a senha.");
            btn_criar.disabled = false;
        }).catch(function () {
            mostrarErro("Não foi possível criar a senha.");
            btn_criar.disabled = false;
        });
    }).catch(function (erro) {
        console.log(erro);
        mostrarErro("Não foi possível criar a senha.");
        btn_criar.disabled = false;
    });
}

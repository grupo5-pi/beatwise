    function autenticar(){
        let email = input_email.value;
        let senha = input_senha.value;

        fetch("/usuarios/autenticar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                emailServer: email,
                senhaServer: senha
            })
        }).then(function (resposta) {
             console.log("ESTOU NO THEN DO entrar()!")

            if (resposta.ok) {
                console.log(resposta);

                resposta.json().then(json => {
                    console.log(json);
                    console.log(JSON.stringify(json));
                    console.log("JSON COMPLETO:", json)
                    sessionStorage.EMAIL_USUARIO = json.email;
                    sessionStorage.NOME_USUARIO = json.nome;
                    sessionStorage.setItem("ID_FUNCIONARIO", json.id_funcionario);
                    sessionStorage.setItem("ID_CARGO", json.id_cargo);
                    sessionStorage.setItem("ID_EMPRESA", json.id_empresa); 
            
                    mensagem1.innerHTML = `<span class="realizado">Login realizado com sucesso!`
                    setTimeout(function () {
                        window.location = "dashboard.html";
                    }, 1000)
            });

            } else {
                mensagem1.innerHTML = `<span class="erro">Senha ou login inválidos!`
                console.log("Houve um erro ao tentar realizar o login!");
                    resposta.text().then(texto => {
                    console.error(texto);
                });
            }

        }).catch(function (erro) {
            console.log(erro);
        });
        return false;
        }
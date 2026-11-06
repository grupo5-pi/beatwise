let idEditando;

function carregarFeats() {
    fetch("/feats/funcionario/" + sessionStorage.ID_FUNCIONARIO).then(function (resposta) {
        if (!resposta.ok) {
            document.getElementById("rec-lista").innerHTML = "<p>Erro ao carregar os feats cadastrados.</p>";
            return;
        }

        resposta.json().then(function (lista) {
            document.getElementById("rec-lista").innerHTML = "";

            if (lista.length == 0) {
                document.getElementById("rec-lista").innerHTML = "<p>Você ainda não salvou nenhuma recomendação.</p>";
                return;
            }

            for (let i = 0; i < lista.length; i++) {
                let f = lista[i];
                let x = f.filtros;

                document.getElementById("rec-lista").innerHTML += `
                    <div class="rec-card" data-id="${f.id}" data-genero="${x.genero ?? ''}" data-energia="${x.energia ?? ''}"
                        data-danca="${x.danca ?? ''}" data-bpm-min="${x.bpmMin ?? ''}" data-bpm-max="${x.bpmMax ?? ''}"
                        data-tom="${x.tom ?? ''}" data-anos="${x.anos ?? ''}">
                        <span class="rec-card-nome"></span>
                        <span class="rec-card-info"></span>
                        <div class="rec-card-acoes">
                            <button type="button" class="rec-botao" onclick="editar(this)">Editar</button>
                            <button type="button" class="rec-botao rec-botao-excluir" onclick="excluir(this)">Excluir</button>
                        </div>
                    </div>`;

                let cards = document.querySelectorAll("#rec-lista .rec-card");
                let card = cards[cards.length - 1];
                card.querySelector(".rec-card-nome").textContent = f.nome;
                card.querySelector(".rec-card-info").textContent = f.artistas.join(", ");
            }
        });
    }).catch(function (erro) {
        console.log(erro);
        document.getElementById("rec-lista").innerHTML = "<p>Não foi possível falar com o servidor.</p>";
    });
}

function excluir(botao) {
    let card = botao.parentElement.parentElement;

    if (confirm('Deseja excluir esta recomendação?')) {
        fetch("/feats/" + card.dataset.id + "?idFuncionario=" + sessionStorage.ID_FUNCIONARIO, {
            method: "DELETE"
        }).then(function (resposta) {
            if (resposta.ok) {
                carregarFeats();
            } else {
                alert("Não foi possível excluir a recomendação.");
            }
        });
    }
}

function mostrarValoresEdicao() {
    edit_energia_valor.textContent = edit_energia.value + '%';
    edit_danca_valor.textContent = edit_danca.value + '%';
}

function editar(botao) {
    let card = botao.parentElement.parentElement;
    idEditando = card.dataset.id;

    input_nome_edicao.value = card.querySelector('.rec-card-nome').textContent;

    edit_genero.value = card.dataset.genero || '';
    edit_energia.value = card.dataset.energia || 50;
    edit_danca.value = card.dataset.danca || 50;
    edit_bpm_min.value = card.dataset.bpmMin || '';
    edit_bpm_max.value = card.dataset.bpmMax || '';
    edit_tom.value = card.dataset.tom || '';
    edit_anos.value = card.dataset.anos || '';

    mostrarValoresEdicao();
    mensagem_edicao.style.display = "none";

    modal_editar.style.display = "flex";
}

function salvarEdicao() {
    let novoNome = input_nome_edicao.value;
    let bpmMin = Number(edit_bpm_min.value);
    let bpmMax = Number(edit_bpm_max.value);

    if (novoNome.trim() == "") {
        mensagem_edicao.textContent = "Dê um nome para a recomendação.";
        mensagem_edicao.style.display = "block";

    } else if (edit_bpm_min.value != "" && edit_bpm_max.value != "" && bpmMin > bpmMax) {
        mensagem_edicao.textContent = "O BPM mínimo não pode ser maior que o máximo.";
        mensagem_edicao.style.display = "block";

    } else {
        fetch("/feats/" + idEditando, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                idFuncionario: sessionStorage.ID_FUNCIONARIO,
                nome: novoNome,
                genero: edit_genero.value,
                energia: edit_energia.value,
                dancabilidade: edit_danca.value,
                bpmMin: edit_bpm_min.value,
                bpmMax: edit_bpm_max.value,
                tonalidade: edit_tom.value,
                intervaloAnos: edit_anos.value
            })
        }).then(function (resposta) {
            if (resposta.ok) {
                modal_editar.style.display = "none";
                carregarFeats();
            } else {
                resposta.json().then(function (json) {
                    mensagem_edicao.textContent = json.mensagem || "Erro ao salvar as alterações.";
                    mensagem_edicao.style.display = "block";
                });
            }
        }).catch(function (erro) {
            console.log(erro);
            mensagem_edicao.textContent = "Não foi possível falar com o servidor.";
            mensagem_edicao.style.display = "block";
        });
    }
}

function cancelarEdicao() {
    modal_editar.style.display = "none";
}

carregarFeats();

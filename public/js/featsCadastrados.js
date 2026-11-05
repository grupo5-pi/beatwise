let cardEditando;

function excluir(botao) {
    let card = botao.parentElement.parentElement;

    if (confirm('Deseja excluir esta recomendação?')) {
        card.remove();
    }
}

function mostrarValoresEdicao() {
    edit_energia_valor.textContent = edit_energia.value + '%';
    edit_danca_valor.textContent = edit_danca.value + '%';
}

function editar(botao) {
    cardEditando = botao.parentElement.parentElement;

    input_nome_edicao.value = cardEditando.querySelector('.rec-card-nome').textContent;

    edit_genero.value = cardEditando.dataset.genero || '';
    edit_energia.value = cardEditando.dataset.energia || 50;
    edit_danca.value = cardEditando.dataset.danca || 50;
    edit_bpm_min.value = cardEditando.dataset.bpmMin || '';
    edit_bpm_max.value = cardEditando.dataset.bpmMax || '';
    edit_tom.value = cardEditando.dataset.tom || '';
    edit_anos.value = cardEditando.dataset.anos || '';

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
        cardEditando.querySelector('.rec-card-nome').textContent = novoNome;

        cardEditando.dataset.genero = edit_genero.value;
        cardEditando.dataset.energia = edit_energia.value;
        cardEditando.dataset.danca = edit_danca.value;
        cardEditando.dataset.bpmMin = edit_bpm_min.value;
        cardEditando.dataset.bpmMax = edit_bpm_max.value;
        cardEditando.dataset.tom = edit_tom.value;
        cardEditando.dataset.anos = edit_anos.value;

        modal_editar.style.display = "none";
    }
}

function cancelarEdicao() {
    modal_editar.style.display = "none";
}
let cardEditando;

function excluir(botao) {
    let card = botao.parentElement.parentElement;

    if (confirm('Deseja excluir esta recomendação?')) {
        card.remove();
    }
}

function editar(botao) {
    cardEditando = botao.parentElement.parentElement;
    input_nome_edicao.value = cardEditando.querySelector('.rec-card-nome').textContent;
    modal_editar.style.display = "flex";
}

function salvarEdicao() {
    let novoNome = input_nome_edicao.value;

    if (novoNome.trim() != "") {
        cardEditando.querySelector('.rec-card-nome').textContent = novoNome;
        modal_editar.style.display = "none";
    }
}

function cancelarEdicao() {
    modal_editar.style.display = "none";
}
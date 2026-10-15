function gerarRecomendacao() {
    etapa_filtros.style.display = "none";
    etapa_resultado.style.display = "block";
}

function novaBusca() {
    etapa_resultado.style.display = "none";
    etapa_filtros.style.display = "block";
}

function salvarRecomendacao() {
    let nome = input_nome_recomendacao.value;

    if (nome.trim() == "") {
        mensagem_recomendacao.style.display = "block";
    } else {
        window.location.href = 'featsCadastrados.html';
    }
}
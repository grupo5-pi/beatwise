let notas = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
let recomendados = [];
let filtrosUsados = {};

function lerFiltros() {
    return {
        genero: document.getElementById("rec-genero").value,
        energia: document.getElementById("rec-energia").value,
        dancabilidade: document.getElementById("rec-danca").value,
        bpmMin: document.getElementById("rec-bpm-min").value,
        bpmMax: document.getElementById("rec-bpm-max").value,
        tonalidade: document.getElementById("rec-tom").value,
        intervaloAnos: document.getElementById("rec-anos").value
    };
}

function mostrarErroFiltros(texto) {
    mensagem_filtros.textContent = texto;
    mensagem_filtros.style.display = "block";
}

function gerarRecomendacao() {
    mensagem_filtros.style.display = "none";
    filtrosUsados = lerFiltros();

    fetch("/feats/recomendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(filtrosUsados)
    }).then(function (resposta) {
        if (resposta.ok) {
            resposta.json().then(function (lista) {
                if (lista.length == 0) {
                    mostrarErroFiltros("Nenhum artista encontrado com esses filtros. Tente ampliar o BPM.");
                    return;
                }

                recomendados = lista;
                document.getElementById("rec-cards").innerHTML = "";

                for (let i = 0; i < lista.length; i++) {
                    let a = lista[i];
                    let tom = a.tonalidade == null ? "" : " · Tom " + notas[a.tonalidade];

                    document.getElementById("rec-cards").innerHTML += `
                        <div class="rec-card" onclick="abrirModalArtista(${a.id})">
                            <span class="rec-card-nome">${a.nome}</span>
                            <span class="rec-card-info">${a.bpm} BPM${tom}</span>
                            <span class="rec-match">${a.compatibilidade}% compatível</span>
                        </div>`;
                }

                etapa_filtros.style.display = "none";
                etapa_resultado.style.display = "block";
            });
        } else {
            resposta.json().then(function (json) {
                mostrarErroFiltros(json.mensagem || "Erro ao gerar a recomendação.");
            });
        }
    }).catch(function (erro) {
        console.log(erro);
        mostrarErroFiltros("Não foi possível falar com o servidor.");
    });
}

function novaBusca() {
    etapa_resultado.style.display = "none";
    etapa_filtros.style.display = "block";
}

function salvarRecomendacao() {
    let nome = input_nome_recomendacao.value;

    if (nome.trim() == "") {
        mensagem_recomendacao.textContent = "Dê um nome para salvar a recomendação.";
        mensagem_recomendacao.style.display = "block";
        return;
    }

    let nomes = [];
    for (let i = 0; i < recomendados.length; i++) {
        nomes.push(recomendados[i].nome);
    }

    fetch("/feats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            idFuncionario: sessionStorage.ID_FUNCIONARIO,
            nome: nome,
            artistas: nomes,
            genero: filtrosUsados.genero,
            energia: filtrosUsados.energia,
            dancabilidade: filtrosUsados.dancabilidade,
            bpmMin: filtrosUsados.bpmMin,
            bpmMax: filtrosUsados.bpmMax,
            tonalidade: filtrosUsados.tonalidade,
            intervaloAnos: filtrosUsados.intervaloAnos
        })
    }).then(function (resposta) {
        if (resposta.ok) {
            window.location.href = "featsCadastrados.html";
        } else {
            resposta.json().then(function (json) {
                mensagem_recomendacao.textContent = json.mensagem || "Erro ao salvar a recomendação.";
                mensagem_recomendacao.style.display = "block";
            });
        }
    }).catch(function (erro) {
        console.log(erro);
        mensagem_recomendacao.textContent = "Não foi possível falar com o servidor.";
        mensagem_recomendacao.style.display = "block";
    });
}

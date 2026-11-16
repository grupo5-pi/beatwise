function formatarNumero(n) {
    if (n >= 1000000000) {
        return (n / 1000000000).toFixed(2).replace(".", ",") + " bi";
    } else if (n >= 1000000) {
        return (n / 1000000).toFixed(1).replace(".", ",") + " mi";
    } else if (n >= 1000) {
        return Math.round(n / 1000) + " mil";
    }
    return String(n);
}

function formatarDuracao(ms) {
    let segundos = Math.round(ms / 1000);
    return Math.floor(segundos / 60) + "min " + (segundos % 60) + "s";
}

function buscarArtista(id) {
    return fetch("/artistas/" + id).then(function (resposta) {
        if (!resposta.ok) {
            throw new Error("Artista não encontrado");
        }
        return resposta.json();
    });
}

function preencherArtista(artista) {
    nome_artista.textContent = artista.nome;

    stat_streams.textContent = formatarNumero(artista.streams);
    stat_views.textContent = formatarNumero(artista.views);
    stat_curtidas.textContent = formatarNumero(artista.curtidas);
    stat_comentarios.textContent = formatarNumero(artista.comentarios);

    info_bpm.textContent = artista.bpm + ' BPM';
    info_duracao.textContent = formatarDuracao(artista.duracaoMs);

    tags_artista.innerHTML = '';
    for (let i = 0; i < artista.generos.length; i++) {
        tags_artista.innerHTML += `<span class="art-tag">${artista.generos[i]}</span>`;
    }
    perfil_sonoro.innerHTML = '';

    let perfil = [
        ['Dançabilidade', artista.perfil.dancabilidade],
        ['Energia', artista.perfil.energia],
        ['Valência', artista.perfil.valencia],
        ['Acústica', artista.perfil.acustica],
        ['Instrumentalidade', artista.perfil.instrumentalidade]
    ];

    for (let i = 0; i < perfil.length; i++) {
        let nome = perfil[i][0];
        let valor = perfil[i][1];

        perfil_sonoro.innerHTML += `
            <div>
                <div class="art-barra-topo">
                    <span>${nome}</span>
                    <span class="art-barra-valor">${valor}%</span>
                </div>
                <div class="art-barra">
                    <div class="art-barra-preenchida" style="width: ${valor}%;"></div>
                </div>
            </div>`;
    }
}

function abrirModalArtista(id) {
    buscarArtista(id).then(function (artista) {
        preencherArtista(artista);
        modal_artista.style.display = 'flex';
    }).catch(function (erro) {
        console.log(erro);
        alert("Não foi possível carregar os detalhes do artista.");
    });
}

function fecharModalArtista() {
    modal_artista.style.display = 'none';
}

function carregarArtista() {
    let id = new URLSearchParams(window.location.search).get("id");

    buscarArtista(id).then(function (artista) {
        preencherArtista(artista);
        let ultimo = artista.ultimoLancamento ? " · último lançamento em " + artista.ultimoLancamento : "";
        info_artista.textContent = artista.totalMusicas + " músicas na base" + ultimo;
        avatar_artista.textContent = artista.nome.charAt(0);
    }).catch(function (erro) {
        console.log(erro);
        nome_artista.textContent = "Artista não encontrado";
    });
}
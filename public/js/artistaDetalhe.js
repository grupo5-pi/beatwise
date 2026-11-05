let artistas = [
    {
        nome: 'Dua Lipa',
        generos: ['Pop', 'Eletrônico'],
        streams: '1,2 bi', views: '515 mi', curtidas: '9,6 mi', comentarios: '205 mil',
        perfil: [['Dançabilidade', 52], ['Energia', 64], ['Valência', 40], ['Acústica', 13], ['Instrumentalidade', 7]],
        bpm: '96 BPM', duracao: '3min 5s'
    },
    {
        nome: 'Luísa Sonza',
        generos: ['Funk', 'Pop'],
        streams: '7,33 bi', views: '6,03 bi', curtidas: '48 mi', comentarios: '2,1 mi',
        perfil: [['Dançabilidade', 72], ['Energia', 86], ['Valência', 46], ['Acústica', 41], ['Instrumentalidade', 4]],
        bpm: '121 BPM', duracao: '3min 46s'
    },
    {
        nome: 'Veigh',
        generos: ['Rap', 'Hip Hop'],
        streams: '14,8 bi', views: '7,6 bi', curtidas: '36 mi', comentarios: '2,6 mi',
        perfil: [['Dançabilidade', 78], ['Energia', 69], ['Valência', 71], ['Acústica', 36], ['Instrumentalidade', 11]],
        bpm: '158 BPM', duracao: '4min 0s'
    }
];

function abrirModalArtista(posicao) {
    let artista = artistas[posicao];

    nome_artista.textContent = artista.nome;

    stat_streams.textContent = artista.streams;
    stat_views.textContent = artista.views;
    stat_curtidas.textContent = artista.curtidas;
    stat_comentarios.textContent = artista.comentarios;

    info_bpm.textContent = artista.bpm;
    info_duracao.textContent = artista.duracao;

    tags_artista.innerHTML = '';
    perfil_sonoro.innerHTML = '';

    for (let i = 0; i < artista.generos.length; i++) {
        tags_artista.innerHTML += `<span class="art-tag">${artista.generos[i]}</span>`;
    }

    for (let i = 0; i < artista.perfil.length; i++) {
        let nome = artista.perfil[i][0];
        let valor = artista.perfil[i][1];

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

    modal_artista.style.display = 'flex';
}

function fecharModalArtista() {
    modal_artista.style.display = 'none';
}
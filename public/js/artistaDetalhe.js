let artistas = [
    {
        nome: 'Artista 1',
        
        generos: ['Pop', 'Eletrônico'],
        streams: '1,04 bi', views: '6,94 bi', curtidas: '62,2 mi', comentarios: '1,7 mi',
        perfil: [['Dançabilidade', 82], ['Energia', 71], ['Valência', 77], ['Acústica', 8], ['Instrumentalidade', 2]],
        bpm: '118 BPM', duracao: '3min 42s'
    },
    {
        nome: 'Artista 2',
        generos: ['Funk', 'Pop'],
        streams: '720 mi', views: '3,2 bi', curtidas: '40,1 mi', comentarios: '980 mil',
        perfil: [['Dançabilidade', 93], ['Energia', 88], ['Valência', 70], ['Acústica', 5], ['Instrumentalidade', 4]],
        bpm: '128 BPM', duracao: '2min 58s'
    },
    {
        nome: 'Artista 3',
        generos: ['Rap', 'Hip Hop'],
        streams: '510 mi', views: '1,8 bi', curtidas: '25,4 mi', comentarios: '640 mil',
        perfil: [['Dançabilidade', 64], ['Energia', 74], ['Valência', 48], ['Acústica', 12], ['Instrumentalidade', 3]],
        bpm: '95 BPM', duracao: '3min 15s'
    }
];

function carregarArtista() {
    let posicao = sessionStorage.ARTISTA_SELECIONADO;

    if (posicao == undefined) {
        posicao = 0;
    }

    let artista = artistas[posicao];

    nome_artista.textContent = artista.nome;
    info_artista.textContent = artista.info;

    stat_streams.textContent = artista.streams;
    stat_views.textContent = artista.views;
    stat_curtidas.textContent = artista.curtidas;
    stat_comentarios.textContent = artista.comentarios;

    info_bpm.textContent = artista.bpm;
    info_duracao.textContent = artista.duracao;

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
}
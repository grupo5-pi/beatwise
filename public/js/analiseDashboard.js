let analiseAtiva = null;

let filtrosDashboard = [
    { chave: "dancabilidade", nome: "Dançabilidade", max: 1 },
    { chave: "energia", nome: "Energia", max: 1 },
    { chave: "tonalidade", nome: "Tonalidade", max: 11 },
    { chave: "acustica", nome: "Acústica", max: 1 },
    { chave: "vivicidade", nome: "Vivacidade", max: 1 },
    { chave: "valenciaPositividade", nome: "Valência", max: 1 },
    { chave: "tempoBPM", nome: "BPM", max: 250 }
];

function buscarAnaliseDaUrl() {
    let id = new URLSearchParams(window.location.search).get("analise");
    let salvas = localStorage.getItem("metricas_" + sessionStorage.ID_FUNCIONARIO);

    if (!id || !salvas) return;

    let lista = JSON.parse(salvas);
    for (let i = 0; i < lista.length; i++) {
        if (lista[i].id == id) {
            analiseAtiva = lista[i];
        }
    }
}

function musicaPassaNoFiltro(musica) {
    if (analiseAtiva == null) return true;

    for (let i = 0; i < filtrosDashboard.length; i++) {
        let chave = filtrosDashboard[i].chave;
        let faixa = analiseAtiva.faixas[chave];

        if (faixa && (musica[chave] < faixa[0] || musica[chave] > faixa[1])) {
            return false;
        }
    }

    return true;
}

function musicasDaAnalise() {
    return musicasExemplo.filter(musicaPassaNoFiltro);
}

function tagsDaAnalise() {
    let tags = [];

    if (analiseAtiva.periodo != "todos") {
        tags.push(analiseAtiva.anoInicio + " – " + analiseAtiva.anoFim);
    }

    for (let i = 0; i < analiseAtiva.generos.length; i++) {
        tags.push(analiseAtiva.generos[i]);
    }

    for (let i = 0; i < filtrosDashboard.length; i++) {
        let f = filtrosDashboard[i];
        let faixa = analiseAtiva.faixas[f.chave];

        if (faixa) {
            if (f.max == 1) {
                let media = (faixa[0] + faixa[1]) / 2;
                let nivel = "média";
                if (media >= 0.66) nivel = "alta";
                if (media <= 0.33) nivel = "baixa";
                tags.push(f.nome + " " + nivel);
            } else {
                tags.push(f.nome + " " + faixa[0] + " – " + faixa[1]);
            }
        }
    }

    if (tags.length == 0) {
        tags.push("Sem filtros");
    }

    let html = "";
    for (let i = 0; i < tags.length; i++) {
        html += '<span class="analise-tag">' + tags[i] + '</span>';
    }
    return html;
}

function mostrarFaixaAnalise() {
    if (analiseAtiva == null) return;

    let quantidade = musicasDaAnalise().length;

    let html = '<div class="analise-faixa">';
    html += '<div class="analise-info">';
    html += '<span class="analise-titulo">Análise: ' + analiseAtiva.nome + '</span>';
    html += '<div class="analise-tags">' + tagsDaAnalise() + '</div>';
    html += '<span class="analise-contagem">' + quantidade + ' de ' + musicasExemplo.length + ' músicas atendem aos filtros</span>';
    html += '</div>';
    html += '<a class="analise-limpar" href="./dashboardProdutor.html">Limpar filtro</a>';
    html += '</div>';

    document.getElementById("faixa_analise").innerHTML = html;
}

function media(musicas, chave) {
    if (musicas.length == 0) return 0;

    let soma = 0;
    for (let i = 0; i < musicas.length; i++) {
        soma += musicas[i][chave];
    }
    return soma / musicas.length;
}

function aplicarAnaliseNoRadar() {
    let filtradas = musicasDaAnalise();
    let todas = musicasExemplo;

    let bpmFiltradas = media(filtradas, "tempoBPM");
    let bpmTodas = media(todas, "tempoBPM");
    let tomFiltradas = media(filtradas, "tonalidade");
    let tomTodas = media(todas, "tonalidade");
    let energiaFiltradas = media(filtradas, "energia");
    let energiaTodas = media(todas, "energia");
    let valenciaFiltradas = media(filtradas, "valenciaPositividade");
    let valenciaTodas = media(todas, "valenciaPositividade");
    let dancaFiltradas = media(filtradas, "dancabilidade");
    let dancaTodas = media(todas, "dancabilidade");

    dadosRadar = {
        genero: analiseAtiva.nome,
        comparacao: "Perfil musical das músicas da análise x todas as músicas",
        serie: "Perfil das músicas da análise",
        rotulos: ["BPM", "Tonalidade", "Energia", "Valência", "Dançabilidade"],
        valores: [bpmFiltradas / 2.5, tomFiltradas / 11 * 100, energiaFiltradas * 100, valenciaFiltradas * 100, dancaFiltradas * 100],
        valoresReais: [Math.round(bpmFiltradas) + " BPM", "Tom " + Math.round(tomFiltradas), Math.round(energiaFiltradas * 100) + "%", Math.round(valenciaFiltradas * 100) + "%", Math.round(dancaFiltradas * 100) + "%"],
        valoresGeral: [bpmTodas / 2.5, tomTodas / 11 * 100, energiaTodas * 100, valenciaTodas * 100, dancaTodas * 100],
        valoresReaisGeral: [Math.round(bpmTodas) + " BPM", "Tom " + Math.round(tomTodas), Math.round(energiaTodas * 100) + "%", Math.round(valenciaTodas * 100) + "%", Math.round(dancaTodas * 100) + "%"]
    };
}

function aplicarAnaliseNoBpm() {
    let filtradas = musicasDaAnalise();
    let inicio = [80, 90, 100, 110, 120, 130, 140];
    let views = [];
    let qtd = [];

    for (let i = 0; i < inicio.length; i++) {
        let soma = 0;
        let total = 0;

        for (let j = 0; j < filtradas.length; j++) {
            let bpm = filtradas[j].tempoBPM;
            let dentro = bpm >= inicio[i] && bpm < inicio[i] + 10;

            if (i == 0 && bpm < 90) dentro = true;
            if (i == inicio.length - 1 && bpm >= 140) dentro = true;

            if (dentro) {
                soma += filtradas[j].views / 1000000000;
                total++;
            }
        }

        if (total > 0) {
            views.push(Number((soma / total).toFixed(2)));
        } else {
            views.push(0);
        }
        qtd.push(total);
    }

    dadosBpmFaixa = {
        genero: analiseAtiva.nome,
        faixas: dadosBpmFaixa.faixas,
        views: views,
        qtd: qtd,
        retornoEsperado: Number((media(musicasExemplo, "views") / 1000000000).toFixed(2)),
        unidade: "bi"
    };
}

function iniciarAnaliseDashboard() {
    buscarAnaliseDaUrl();

    if (analiseAtiva == null) return;

    mostrarFaixaAnalise();
    document.getElementById("subtitulo_bpm").innerHTML = "Views médias (bilhões) por faixa de BPM";
    aplicarAnaliseNoRadar();
    aplicarAnaliseNoBpm();
}

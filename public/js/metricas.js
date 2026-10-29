let generos = ["Pop", "R&B", "MPB", "Hip-Hop", "Eletrônica", "Funk", "Samba"];

let caracteristicas = [
    { chave: "dancabilidade", nome: "Dançabilidade", min: 0, max: 1, passo: 0.01 },
    { chave: "energia", nome: "Energia", min: 0, max: 1, passo: 0.01 },
    { chave: "tonalidade", nome: "Tonalidade", min: 0, max: 11, passo: 1 },
    { chave: "acustica", nome: "Acústica", min: 0, max: 1, passo: 0.01 },
    { chave: "vivicidade", nome: "Vivacidade", min: 0, max: 1, passo: 0.01 },
    { chave: "valenciaPositividade", nome: "Valência", min: 0, max: 1, passo: 0.01 },
    { chave: "tempoBPM", nome: "BPM", min: 0, max: 250, passo: 1 }
];

let anoAtual = new Date().getFullYear();
let totalBase = 18420;

let analises = [];
let idEditando = null;
let idExcluindo = null;
let periodo = "todos";

function carregarDoNavegador() {
    let salvas = localStorage.getItem("metricas_" + sessionStorage.ID_FUNCIONARIO);

    if (salvas) {
        analises = JSON.parse(salvas);
    } else {
        analises = [
            { id: 1, nome: "Lançamentos – últimos 10 anos", periodo: "10anos", anoInicio: anoAtual - 10, anoFim: anoAtual, generos: [], faixas: {}, data: "2026-09-12" },
            { id: 2, nome: "Campanha Pop – Verão", periodo: "10anos", anoInicio: anoAtual - 10, anoFim: anoAtual, generos: ["Pop"], faixas: { dancabilidade: [0.65, 1], energia: [0.7, 1] }, data: "2026-09-28" },
            { id: 3, nome: "Base completa", periodo: "todos", anoInicio: "", anoFim: "", generos: [], faixas: {}, data: "2026-09-02" },
            { id: 4, nome: "Referência – R&B calmo", periodo: "todos", anoInicio: "", anoFim: "", generos: ["R&B"], faixas: { energia: [0, 0.3] }, data: "2026-10-05" }
        ];

        for (let i = 0; i < analises.length; i++) {
            analises[i].musicas = calcularMusicas(analises[i]);
        }

        salvarNoNavegador();
    }
}

function salvarNoNavegador() {
    localStorage.setItem("metricas_" + sessionStorage.ID_FUNCIONARIO, JSON.stringify(analises));
}

function calcularMusicas(analise) {
    let fator = 1;

    if (analise.periodo == "5anos") {
        fator = fator * 0.35;
    } else if (analise.periodo == "10anos") {
        fator = fator * 0.55;
    } else if (analise.periodo == "personalizado" && analise.anoInicio && analise.anoFim) {
        fator = fator * Math.min(1, (analise.anoFim - analise.anoInicio + 1) / 40);
    }

    if (analise.generos.length > 0) {
        fator = fator * Math.min(1, analise.generos.length * 0.18);
    }

    for (let i = 0; i < caracteristicas.length; i++) {
        let c = caracteristicas[i];
        let faixa = analise.faixas[c.chave];

        if (faixa) {
            fator = fator * Math.max(0.01, (faixa[1] - faixa[0]) / (c.max - c.min));
        }
    }

    return Math.round(totalBase * fator);
}

function montarTags(analise) {
    let tags = [];

    if (analise.periodo != "todos") {
        tags.push(analise.anoInicio + " – " + analise.anoFim);
    }

    for (let i = 0; i < analise.generos.length; i++) {
        tags.push(analise.generos[i]);
    }

    for (let i = 0; i < caracteristicas.length; i++) {
        let c = caracteristicas[i];
        let faixa = analise.faixas[c.chave];

        if (faixa) {
            if (c.max == 1) {
                let media = (faixa[0] + faixa[1]) / 2;
                let nivel = "média";
                if (media >= 0.66) nivel = "alta";
                if (media <= 0.33) nivel = "baixa";
                tags.push(c.nome + " " + nivel);
            } else {
                tags.push(c.nome + " " + faixa[0] + " – " + faixa[1]);
            }
        }
    }

    if (analise.generos.length == 0 && tags.length > 0) {
        tags.push("Todos os gêneros");
    }

    if (tags.length == 0) {
        tags.push("Sem filtros");
    }

    let html = "";
    for (let i = 0; i < tags.length; i++) {
        html += '<span class="tag">' + tags[i] + '</span>';
    }
    return html;
}

function formatarData(data) {
    let partes = data.slice(0, 10).split("-");
    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function listarAnalises() {
    let busca = document.getElementById("busca").value.toLowerCase();
    let ordem = document.getElementById("ordem").value;

    let lista = analises.filter(function (a) {
        return a.nome.toLowerCase().includes(busca);
    });

    if (ordem == "recentes") {
        lista.sort(function (a, b) { return b.data.localeCompare(a.data); });
    } else if (ordem == "antigas") {
        lista.sort(function (a, b) { return a.data.localeCompare(b.data); });
    } else if (ordem == "nome") {
        lista.sort(function (a, b) { return a.nome.localeCompare(b.nome); });
    } else if (ordem == "musicas") {
        lista.sort(function (a, b) { return b.musicas - a.musicas; });
    }

    let html = "";

    for (let i = 0; i < lista.length; i++) {
        let a = lista[i];

        html += '<article class="card-analise">';
        html += '<div class="info">';
        html += '<h3>' + a.nome + '</h3>';
        html += '<div class="tags">' + montarTags(a) + '</div>';
        html += '<small>Criada em ' + formatarData(a.data) + ' · ' + a.musicas.toLocaleString("pt-BR") + ' músicas</small>';
        html += '</div>';
        html += '<div class="acoes">';
        html += '<a class="btn primario" href="./dashboardProdutor.html?analise=' + a.id + '">Ver dashboard</a>';
        html += '<button type="button" class="btn" onclick="editarAnalise(' + a.id + ')">Editar</button>';
        html += '<button type="button" class="btn" onclick="abrirModal(' + a.id + ')">Excluir</button>';
        html += '</div>';
        html += '</article>';
    }

    if (lista.length == 0) {
        html = '<div class="vazio"><p>Nenhuma análise encontrada.</p></div>';
    }

    document.getElementById("lista-analises").innerHTML = html;
    document.getElementById("total").innerHTML = "Total: " + analises.length + " análises";
    document.getElementById("rodape-lista").innerHTML = "Mostrando " + lista.length + " de " + analises.length + " análises";
}

function mostrarLista() {
    idEditando = null;
    document.getElementById("titulo-pagina").innerHTML = "Métricas";
    document.getElementById("aba-lista").classList.add("ativa");
    document.getElementById("aba-nova").classList.remove("ativa");
    document.getElementById("tela-lista").hidden = false;
    document.getElementById("tela-form").hidden = true;
    listarAnalises();
}

function mostrarFormulario(titulo) {
    document.getElementById("titulo-pagina").innerHTML = titulo;
    document.getElementById("tela-lista").hidden = true;
    document.getElementById("tela-form").hidden = false;
    document.getElementById("mensagem-form").innerHTML = "";
}

function novaAnalise() {
    idEditando = null;
    document.getElementById("aba-lista").classList.remove("ativa");
    document.getElementById("aba-nova").classList.add("ativa");
    document.getElementById("btn-excluir-form").hidden = true;

    preencherFormulario({ nome: "", periodo: "todos", anoInicio: "", anoFim: "", generos: [], faixas: {} });
    mostrarFormulario("Nova Análise");
}

function editarAnalise(id) {
    let analise = analises.find(function (a) { return a.id == id; });

    idEditando = id;
    document.getElementById("aba-lista").classList.add("ativa");
    document.getElementById("aba-nova").classList.remove("ativa");
    document.getElementById("btn-excluir-form").hidden = false;

    preencherFormulario(analise);
    mostrarFormulario("Editar Análise");
}

function preencherFormulario(analise) {
    document.getElementById("nome").value = analise.nome;

    escolherPeriodo(analise.periodo);
    if (analise.periodo == "personalizado") {
        document.getElementById("ano-inicio").value = analise.anoInicio;
        document.getElementById("ano-fim").value = analise.anoFim;
    }

    let chips = document.querySelectorAll("#chips-genero .chip");
    for (let i = 0; i < chips.length; i++) {
        chips[i].classList.toggle("ativo", analise.generos.includes(chips[i].innerText));
    }

    for (let i = 0; i < caracteristicas.length; i++) {
        let c = caracteristicas[i];
        let faixa = analise.faixas[c.chave] || [c.min, c.max];
        document.getElementById("min-" + c.chave).value = faixa[0];
        document.getElementById("max-" + c.chave).value = faixa[1];
        atualizarSlider(i);
    }

    atualizarContador();
}

function escolherPeriodo(novoPeriodo) {
    periodo = novoPeriodo;

    let chips = document.querySelectorAll("#chips-periodo .chip");
    for (let i = 0; i < chips.length; i++) {
        chips[i].classList.toggle("ativo", chips[i].dataset.periodo == periodo);
    }

    let inicio = document.getElementById("ano-inicio");
    let fim = document.getElementById("ano-fim");

    inicio.disabled = periodo != "personalizado";
    fim.disabled = periodo != "personalizado";

    if (periodo == "5anos") {
        inicio.value = anoAtual - 5;
        fim.value = anoAtual;
    } else if (periodo == "10anos") {
        inicio.value = anoAtual - 10;
        fim.value = anoAtual;
    } else if (periodo == "todos") {
        inicio.value = "";
        fim.value = "";
    }

    atualizarContador();
}

function trocarGenero(botao) {
    botao.classList.toggle("ativo");
    atualizarContador();
}

function generosMarcados() {
    let marcados = [];
    let chips = document.querySelectorAll("#chips-genero .chip.ativo");
    for (let i = 0; i < chips.length; i++) {
        marcados.push(chips[i].innerText);
    }
    return marcados;
}

function faixasEscolhidas() {
    let faixas = {};

    for (let i = 0; i < caracteristicas.length; i++) {
        let c = caracteristicas[i];
        let min = Number(document.getElementById("min-" + c.chave).value);
        let max = Number(document.getElementById("max-" + c.chave).value);

        if (min > c.min || max < c.max) {
            faixas[c.chave] = [min, max];
        }
    }

    return faixas;
}

function desenharSliders() {
    let html = "";

    for (let i = 0; i < caracteristicas.length; i++) {
        let c = caracteristicas[i];
        let limites = 'min="' + c.min + '" max="' + c.max + '" step="' + c.passo + '"';

        html += '<div class="faixa">';
        html += '<span class="rotulo">' + c.nome + '</span>';
        html += '<div class="duplo">';
        html += '<div class="trilho"><div class="preenchido" id="preenchido-' + c.chave + '"></div></div>';
        html += '<input type="range" class="min" id="min-' + c.chave + '" ' + limites + ' value="' + c.min + '" oninput="moverSlider(' + i + ', \'min\')">';
        html += '<input type="range" class="max" id="max-' + c.chave + '" ' + limites + ' value="' + c.max + '" oninput="moverSlider(' + i + ', \'max\')">';
        html += '</div>';
        html += '<div class="valores"><span id="texto-min-' + c.chave + '"></span><span id="texto-max-' + c.chave + '"></span></div>';
        html += '</div>';
    }

    document.getElementById("sliders").innerHTML = html;

    for (let i = 0; i < caracteristicas.length; i++) {
        atualizarSlider(i);
    }
}

function moverSlider(i, lado) {
    let c = caracteristicas[i];
    let inputMin = document.getElementById("min-" + c.chave);
    let inputMax = document.getElementById("max-" + c.chave);

    if (Number(inputMin.value) > Number(inputMax.value)) {
        if (lado == "min") {
            inputMin.value = inputMax.value;
        } else {
            inputMax.value = inputMin.value;
        }
    }

    atualizarSlider(i);
    atualizarContador();
}

function atualizarSlider(i) {
    let c = caracteristicas[i];
    let min = Number(document.getElementById("min-" + c.chave).value);
    let max = Number(document.getElementById("max-" + c.chave).value);
    let inicio = (min - c.min) / (c.max - c.min) * 100;
    let fim = (max - c.min) / (c.max - c.min) * 100;

    let preenchido = document.getElementById("preenchido-" + c.chave);
    preenchido.style.left = inicio + "%";
    preenchido.style.width = (fim - inicio) + "%";

    document.getElementById("min-" + c.chave).style.zIndex = inicio > 90 ? 4 : 3;

    let casas = c.passo < 1 ? 2 : 0;
    document.getElementById("texto-min-" + c.chave).innerHTML = "Mín: " + min.toFixed(casas);
    document.getElementById("texto-max-" + c.chave).innerHTML = "Máx: " + max.toFixed(casas);
}

function limparCaracteristicas() {
    for (let i = 0; i < caracteristicas.length; i++) {
        let c = caracteristicas[i];
        document.getElementById("min-" + c.chave).value = c.min;
        document.getElementById("max-" + c.chave).value = c.max;
        atualizarSlider(i);
    }
    atualizarContador();
}

function lerFormulario() {
    return {
        nome: document.getElementById("nome").value.trim(),
        periodo: periodo,
        anoInicio: Number(document.getElementById("ano-inicio").value),
        anoFim: Number(document.getElementById("ano-fim").value),
        generos: generosMarcados(),
        faixas: faixasEscolhidas()
    };
}

function atualizarContador() {
    let analise = lerFormulario();
    let semFiltro = analise.periodo == "todos" && analise.generos.length == 0 && Object.keys(analise.faixas).length == 0;

    if (semFiltro) {
        document.getElementById("contador-rotulo").innerHTML = "Músicas na base (sem filtros)";
    } else {
        document.getElementById("contador-rotulo").innerHTML = "Músicas encontradas";
    }

    document.getElementById("contador-valor").innerHTML = calcularMusicas(analise).toLocaleString("pt-BR");
}

function salvar(evento) {
    evento.preventDefault();

    let analise = lerFormulario();
    let mensagem = document.getElementById("mensagem-form");

    if (analise.nome.length < 3) {
        mensagem.innerHTML = "Dê um nome à análise (mínimo de 3 caracteres).";
        return;
    }

    if (analise.periodo == "personalizado") {
        if (!analise.anoInicio || !analise.anoFim) {
            mensagem.innerHTML = "Preencha os anos de início e fim do período.";
            return;
        }
        if (analise.anoInicio > analise.anoFim || analise.anoFim > anoAtual) {
            mensagem.innerHTML = "Informe um período válido (até " + anoAtual + ").";
            return;
        }
    }

    if (analise.periodo == "todos") {
        analise.anoInicio = "";
        analise.anoFim = "";
    }

    analise.musicas = calcularMusicas(analise);

    if (idEditando == null) {
        let maiorId = 0;
        for (let i = 0; i < analises.length; i++) {
            if (analises[i].id > maiorId) maiorId = analises[i].id;
        }
        analise.id = maiorId + 1;
        analise.data = new Date().toISOString();
        analises.push(analise);
    } else {
        for (let i = 0; i < analises.length; i++) {
            if (analises[i].id == idEditando) {
                analise.id = idEditando;
                analise.data = analises[i].data;
                analises[i] = analise;
            }
        }
    }

    salvarNoNavegador();
    mostrarLista();
}

function abrirModal(id) {
    let analise = analises.find(function (a) { return a.id == id; });

    idExcluindo = id;
    document.getElementById("modal-texto").innerHTML = 'A análise "' + analise.nome + '" e o dashboard gerado a partir dela serão excluídos permanentemente. Essa ação não pode ser desfeita.';
    document.getElementById("modal-excluir").hidden = false;
}

function fecharModal() {
    idExcluindo = null;
    document.getElementById("modal-excluir").hidden = true;
}

function confirmarExclusao() {
    analises = analises.filter(function (a) {
        return a.id != idExcluindo;
    });

    salvarNoNavegador();
    fecharModal();
    mostrarLista();
}

function iniciarPagina() {
    let html = "";
    for (let i = 0; i < generos.length; i++) {
        html += '<button type="button" class="chip" onclick="trocarGenero(this)">' + generos[i] + '</button>';
    }
    document.getElementById("chips-genero").innerHTML = html;

    document.getElementById("ano-inicio").max = anoAtual;
    document.getElementById("ano-fim").max = anoAtual;

    desenharSliders();
    carregarDoNavegador();
    listarAnalises();
}

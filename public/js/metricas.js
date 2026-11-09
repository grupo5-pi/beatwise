let generos = [];
let caracteristicas = [];

let anoAtual = new Date().getFullYear();

let analises = [];
let idEditando = null;
let idExcluindo = null;
let periodo = "todos";
let timerContador = null;

function idFuncionario() {
    return sessionStorage.getItem("ID_FUNCIONARIO");
}

function escapar(texto) {
    return String(texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function mostrarMensagem(texto, tipo) {
    let mensagem = document.getElementById("mensagem-form");
    mensagem.innerHTML = texto;
    mensagem.classList.toggle("erro", tipo == "erro");
}

async function chamarApi(caminho, opcoes) {
    let resposta = await fetch(caminho, opcoes);
    let json = await resposta.json().catch(function () { return {}; });

    if (!resposta.ok) {
        throw new Error(json.mensagem || "Erro na comunicação com o servidor.");
    }
    return json;
}

function enviarJson(metodo, corpo) {
    return {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo)
    };
}

async function carregarAnalises() {
    try {
        analises = await chamarApi("/metricas/funcionario/" + idFuncionario());
    } catch (erro) {
        analises = [];
        document.getElementById("lista-analises").innerHTML =
            '<div class="vazio"><p>' + escapar(erro.message) + '</p></div>';
        return;
    }
    listarAnalises();
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
        let faixa = analise.caracteristicas[c.chave];

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
        html += '<span class="tag">' + escapar(tags[i]) + '</span>';
    }
    return html;
}

function formatarData(data) {
    return new Date(data).toLocaleDateString("pt-BR");
}

function listarAnalises() {
    let busca = document.getElementById("busca").value.toLowerCase();
    let ordem = document.getElementById("ordem").value;

    let lista = analises.filter(function (a) {
        return a.nome.toLowerCase().includes(busca);
    });

    if (ordem == "recentes") {
        lista.sort(function (a, b) { return new Date(b.dataCriacao) - new Date(a.dataCriacao); });
    } else if (ordem == "antigas") {
        lista.sort(function (a, b) { return new Date(a.dataCriacao) - new Date(b.dataCriacao); });
    } else if (ordem == "nome") {
        lista.sort(function (a, b) { return a.nome.localeCompare(b.nome); });
    } else if (ordem == "musicas") {
        lista.sort(function (a, b) { return b.totalMusicas - a.totalMusicas; });
    }

    let html = "";

    for (let i = 0; i < lista.length; i++) {
        let a = lista[i];

        html += '<article class="card-analise">';
        html += '<div class="info">';
        html += '<h3>' + escapar(a.nome) + '</h3>';
        html += '<div class="tags">' + montarTags(a) + '</div>';
        html += '<small>Criada em ' + formatarData(a.dataCriacao) + ' · ' + Number(a.totalMusicas).toLocaleString("pt-BR") + ' músicas</small>';
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
    mostrarMensagem("");
}

function novaAnalise() {
    idEditando = null;
    document.getElementById("aba-lista").classList.remove("ativa");
    document.getElementById("aba-nova").classList.add("ativa");
    document.getElementById("btn-excluir-form").hidden = true;

    preencherFormulario({ nome: "", periodo: "todos", anoInicio: "", anoFim: "", generos: [], caracteristicas: {} });
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
        chips[i].classList.toggle("ativo", analise.generos.includes(chips[i].dataset.genero));
    }

    for (let i = 0; i < caracteristicas.length; i++) {
        let c = caracteristicas[i];
        let faixa = analise.caracteristicas[c.chave] || [c.min, c.max];
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
        marcados.push(chips[i].dataset.genero);
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

function desenharGeneros() {
    let html = "";
    for (let i = 0; i < generos.length; i++) {
        let g = escapar(generos[i].genero);
        html += '<button type="button" class="chip" data-genero="' + g + '" onclick="trocarGenero(this)">' + g + '</button>';
    }

    if (generos.length == 0) {
        html = '<small>Nenhum gênero disponível ainda. Rode a integração do iTunes para preencher os gêneros das músicas.</small>';
    }

    document.getElementById("chips-genero").innerHTML = html;
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

    document.getElementById("texto-min-" + c.chave).innerHTML = "Mín: " + min.toFixed(c.casas);
    document.getElementById("texto-max-" + c.chave).innerHTML = "Máx: " + max.toFixed(c.casas);
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
        caracteristicas: faixasEscolhidas()
    };
}

function atualizarContador() {
    let analise = lerFormulario();
    let semFiltro = analise.periodo == "todos" && analise.generos.length == 0 && Object.keys(analise.caracteristicas).length == 0;

    if (semFiltro) {
        document.getElementById("contador-rotulo").innerHTML = "Músicas na base (sem filtros)";
    } else {
        document.getElementById("contador-rotulo").innerHTML = "Músicas encontradas";
    }

    if (analise.periodo == "personalizado" && (!analise.anoInicio || !analise.anoFim)) {
        document.getElementById("contador-valor").innerHTML = "—";
        return;
    }

    clearTimeout(timerContador);
    timerContador = setTimeout(async function () {
        try {
            let resposta = await chamarApi("/metricas/contagem", enviarJson("POST", analise));
            document.getElementById("contador-valor").innerHTML = Number(resposta.total).toLocaleString("pt-BR");
        } catch (erro) {
            document.getElementById("contador-valor").innerHTML = "—";
        }
    }, 300);
}

async function salvar(evento) {
    evento.preventDefault();

    let analise = lerFormulario();

    if (analise.nome.length < 3) {
        mostrarMensagem("Dê um nome à análise (mínimo de 3 caracteres).", "erro");
        return;
    }

    if (analise.periodo == "personalizado") {
        if (!analise.anoInicio || !analise.anoFim) {
            mostrarMensagem("Preencha os anos de início e fim do período.", "erro");
            return;
        }
        if (analise.anoInicio > analise.anoFim || analise.anoFim > anoAtual) {
            mostrarMensagem("Informe um período válido (até " + anoAtual + ").", "erro");
            return;
        }
    }

    analise.idFuncionario = idFuncionario();

    let botao = document.getElementById("btn-salvar");
    botao.disabled = true;
    mostrarMensagem("Salvando...");

    try {
        if (idEditando == null) {
            await chamarApi("/metricas", enviarJson("POST", analise));
        } else {
            await chamarApi("/metricas/" + idEditando, enviarJson("PUT", analise));
        }
        await carregarAnalises();
        mostrarLista();
    } catch (erro) {
        mostrarMensagem(escapar(erro.message), "erro");
    } finally {
        botao.disabled = false;
    }
}

function abrirModal(id) {
    let analise = analises.find(function (a) { return a.id == id; });

    idExcluindo = id;
    document.getElementById("modal-texto").innerHTML = 'A análise "' + escapar(analise.nome) + '" e o dashboard gerado a partir dela serão excluídos permanentemente. Essa ação não pode ser desfeita.';
    document.getElementById("modal-excluir").hidden = false;
}

function fecharModal() {
    idExcluindo = null;
    document.getElementById("modal-excluir").hidden = true;
}

async function confirmarExclusao() {
    let botao = document.getElementById("btn-confirmar-exclusao");
    botao.disabled = true;

    try {
        await chamarApi("/metricas/" + idExcluindo + "?idFuncionario=" + idFuncionario(), { method: "DELETE" });
        fecharModal();
        await carregarAnalises();
        mostrarLista();
    } catch (erro) {
        document.getElementById("modal-texto").innerHTML = escapar(erro.message);
    } finally {
        botao.disabled = false;
    }
}

async function iniciarPagina() {
    document.getElementById("ano-inicio").max = anoAtual;
    document.getElementById("ano-fim").max = anoAtual;

    document.getElementById("ano-inicio").oninput = atualizarContador;
    document.getElementById("ano-fim").oninput = atualizarContador;

    try {
        let lista = await chamarApi("/metricas/caracteristicas");
        caracteristicas = [];
        for (let chave in lista) {
            let c = lista[chave];
            caracteristicas.push({ chave: chave, nome: c.rotulo, min: c.min, max: c.max, passo: c.passo, casas: c.casas });
        }
        generos = await chamarApi("/metricas/generos");
    } catch (erro) {
        document.getElementById("lista-analises").innerHTML =
            '<div class="vazio"><p>Não foi possível carregar os filtros: ' + escapar(erro.message) + '</p></div>';
        return;
    }

    desenharGeneros();
    desenharSliders();
    await carregarAnalises();
}
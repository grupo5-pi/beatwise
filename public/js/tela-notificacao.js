let titulos = ["Acessos", "Atualizações", "Frequência", "Informativas"];

let subtitulos = [
    "Notificar acessos da sua empresa",
    "Notificar atualizações do sistema",
    "Definir a frequência dos avisos",
    "Receber avisos e comunicados gerais"
];

let opcoes = [
    ["Usuário", "Data", "Horário", "Páginas"],
    ["Novas funcionalidades", "Correções", "Manutenções", "Versões"],
    ["Em tempo real", "Diária", "Semanal", "Mensal"],
    ["Novidades", "Dicas", "Comunicados", "Eventos"]
];

let marcadas = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
];

let aberta = [false, false, false, false];

let salvo = [false, false, false, false];

let SVG_EDITAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>';
let SVG_EXCLUIR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/><path d="M10 10v6M14 10v6"/></svg>';
let SVG_MAIS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 7v10M7 12h10"/></svg>';

function htmlColunaVazia(i) {
    let html = '<div class="coluna coluna-vazia">';
    html += '<div class="descricao-colunas">';
    html += '<span class="titulo">' + titulos[i] + '</span>';
    html += '<span class="descricao">' + subtitulos[i] + '</span>';
    html += '</div>';
    html += '<button class="btn-adicionar" onclick="abrirColuna(' + i + ')">' + SVG_MAIS + '</button>';
    html += '</div>';
    return html;
}

function htmlColunaAberta(i) {
    let bloqueado = "";
    let desabilitado = "";

    if (salvo[i]) {
        bloqueado = " bloqueado";
        desabilitado = " disabled";
    }

    let html = '<div class="coluna">';

    html += '<div class="icones-colunas">';
    html += '<button class="btn-icone" onclick="editarColuna(' + i + ')">' + SVG_EDITAR + '</button>';
    html += '<button class="btn-icone" onclick="excluirColuna(' + i + ')">' + SVG_EXCLUIR + '</button>';
    html += '</div>';

    html += '<div class="descricao-colunas">';
    html += '<span class="titulo">' + titulos[i] + '</span>';
    html += '<span class="descricao">' + subtitulos[i] + '</span>';
    html += '</div>';

    html += '<div class="checks-colunas' + bloqueado + '">';
    for (let j = 0; j < opcoes[i].length; j++) {
        let marcado = "";
        if (marcadas[i][j]) {
            marcado = " checked";
        }

        html += '<label>';
        html += '<input type="checkbox" id="check-' + i + '-' + j + '" onchange="mudarCheck(' + i + ',' + j + ')"' + marcado + desabilitado + '>';
        html += opcoes[i][j];
        html += '</label>';
    }
    html += '</div>';

    html += '<button class="btn-salvar" onclick="salvarColuna(' + i + ')"' + desabilitado + '>Salvar</button>';
    html += '</div>';

    return html;
}

function desenharColunas() {
    let html = "";

    for (let i = 0; i < 4; i++) {
        if (aberta[i]) {
            html += htmlColunaAberta(i);
        } else {
            html += htmlColunaVazia(i);
        }
    }

    document.getElementById("colunas").innerHTML = html;
}

function abrirColuna(i) {
    aberta[i] = true;
    desenharColunas();
}

function mudarCheck(i, j) {
    marcadas[i][j] = document.getElementById("check-" + i + "-" + j).checked;
}

function editarColuna(i) {
    salvo[i] = false;
    desenharColunas();
}

function excluirColuna(i) {
    aberta[i] = false;
    salvo[i] = false;

    for (let j = 0; j < opcoes[i].length; j++) {
        marcadas[i][j] = false;
    }

    desenharColunas();
}

function salvarColuna(i) {
    salvo[i] = true;
    desenharColunas();

    console.log(montarJSON());
}

function montarJSON() {
    let lista = [];

    for (let i = 0; i < 4; i++) {
        if (salvo[i]) {
            let itens = [];

            for (let j = 0; j < opcoes[i].length; j++) {
                itens[j] = { nome: opcoes[i][j], ativo: marcadas[i][j] };
            }

            lista[lista.length] = { tema: titulos[i], opcoes: itens };
        }
    }

    return JSON.stringify(lista);
}

function carregarUsuario() {
    let nome = sessionStorage.getItem('NOME_USUARIO');

    if (nome == null) {
        nome = 'Usuário';
    }

    document.getElementById('saudacao').textContent = 'Olá, ' + nome + '!';
    document.getElementById('nome-usuario').textContent = nome;
}

desenharColunas();

const sidebar = document.getElementById('sidebar');

sidebar.addEventListener('click', () => {
    sidebar.classList.add('expandida');
});

document.addEventListener('click', (evento) => {
    const clicouFora = !sidebar.contains(evento.target);

    if (clicouFora) {
        sidebar.classList.remove('expandida');
    }
});

desenharColunas();
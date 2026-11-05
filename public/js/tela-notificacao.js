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
    ["Diária", "Semanal", "Mensal"],
    ["Novidades", "Dicas", "Comunicados", "Eventos"]
];

let marcadas = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false],
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

// ===================== FETCH =====================

// Monta o objeto de UMA coluna, que é o que vai para o banco
function montarColuna(i) {
    let itens = [];

    for (let j = 0; j < opcoes[i].length; j++) {
        itens[j] = { nome: opcoes[i][j], ativo: marcadas[i][j] };
    }

    return {
        idUsuario: sessionStorage.getItem('ID_USUARIO'),
        tema: titulos[i],
        opcoes: itens
    };
}

// Envia a coluna para o servidor. Só trava a coluna se o servidor confirmar.
function salvarColuna(i) {
    fetch('/notificacoes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(montarColuna(i))
    })
    .then(function (resposta) {
        if (resposta.ok) {
            salvo[i] = true;
            desenharColunas();
        } else {
            alert('Não foi possível salvar. Tente novamente.');
        }
    })
    .catch(function (erro) {
        console.log(erro);
        alert('Erro de conexão com o servidor.');
    });
}

// Ao abrir a página, busca no servidor o que o usuário já tinha salvo
function carregarDoBanco() {
    let idUsuario = sessionStorage.getItem('ID_USUARIO');

    fetch('/notificacoes/' + idUsuario)
    .then(function (resposta) {
        return resposta.json();
    })
    .then(function (lista) {
        // lista = [{ tema: "Acessos", opcoes: [{ nome: "Usuário", ativo: 1 }, ...] }, ...]
        for (let k = 0; k < lista.length; k++) {
            for (let i = 0; i < 4; i++) {
                if (lista[k].tema == titulos[i]) {
                    aberta[i] = true;
                    salvo[i] = true;

                    for (let j = 0; j < opcoes[i].length; j++) {
                        for (let m = 0; m < lista[k].opcoes.length; m++) {
                            if (lista[k].opcoes[m].nome == opcoes[i][j]) {
                                marcadas[i][j] = (lista[k].opcoes[m].ativo == 1);
                            }
                        }
                    }
                }
            }
        }

        desenharColunas();
    })
    .catch(function (erro) {
        console.log(erro);
    });
}

desenharColunas();
carregarDoBanco();
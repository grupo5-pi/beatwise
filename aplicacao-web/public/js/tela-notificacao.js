let titulos = ["Acessos", "Atualizações", "Frequência", "Informativas", "Alertas"];

let subtitulos = [
    "Notificar acessos da sua empresa",
    "Notificar atualizações do sistema",
    "Definir a frequência dos avisos",
    "Receber avisos e comunicados gerais",
    "Receber os alertas da dashboard por e-mail"
];

let opcoes = [
    ["Usuário", "Data", "Horário", "Páginas"],
    ["Novas funcionalidades", "Correções", "Manutenções", "Versões"],
    ["Diária", "Semanal", "Mensal"],
    ["Novidades", "Dicas", "Comunicados", "Eventos"],
    ["Aumentos", "Quedas", "Visualizações", "Curtidas", "Streams"]
];

let marcadas = [
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false],
    [false, false, false, false],
    [true, true, true, true, true]
];

let aberta = [false, false, false, false, false];

let salvo = [false, false, false, false, false];

let chavesTemas = ["acesso", "atualizacoes", "frequencia", "informativas", "alertas"];

let chaveConfig = "notificacaoConfig_" + sessionStorage.getItem('ID_FUNCIONARIO');

let SVG_EDITAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6"/><path d="M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>';
let SVG_EXCLUIR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M6 6l1 14h10l1-14"/><path d="M10 10v6M14 10v6"/></svg>';
let SVG_MAIS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 7v10M7 12h10"/></svg>';

function lerConfigSessao() {
    try {
        return JSON.parse(sessionStorage.getItem(chaveConfig));
    } catch (e) {
        return null;
    }
}

function gravarConfigSessao(config) {
    sessionStorage.setItem(chaveConfig, JSON.stringify(config));
}

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

    for (let i = 0; i < titulos.length; i++) {
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

function limparColunaLocal(i) {
    aberta[i] = false;
    salvo[i] = false;

    for (let j = 0; j < opcoes[i].length; j++) {
        marcadas[i][j] = (i == 4);   // MUDOU: o tema Alertas volta com tudo marcado
    }

    desenharColunas();
}

function excluirColuna(i) {
    let fkFuncionario = sessionStorage.getItem('ID_FUNCIONARIO');
    let config = lerConfigSessao() || {};

    if (fkFuncionario == null || config[chavesTemas[i]] == undefined) {
        limparColunaLocal(i);
        return;
    }

    fetch('/notificacao/excluirTema/' + fkFuncionario + '/' + chavesTemas[i], {
        method: 'DELETE'
    })
    .then(function (resposta) {
        if (resposta.ok) {
            delete config[chavesTemas[i]];
            gravarConfigSessao(config);
            limparColunaLocal(i);
        } else {
            console.log('Erro ao excluir. Status:', resposta.status);
            alert('Não foi possível excluir. Tente novamente.');
        }
    })
    .catch(function (erro) {
        console.log(erro);
        alert('Erro de conexão com o servidor.');
    });
}

function salvarColuna(i) {
    let fkFuncionario = sessionStorage.getItem('ID_FUNCIONARIO');

    if (fkFuncionario == null) {
        alert('Você precisa estar logado para salvar.');
        return;
    }

    fetch('/notificacao/salvarNotificacao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            fkFuncionarioServer: fkFuncionario,
            temaServer: chavesTemas[i],
            opcoesServer: marcadas[i]
        })
    })
    .then(function (resposta) {
        if (resposta.ok) {
            let config = lerConfigSessao() || {};
            config[chavesTemas[i]] = marcadas[i].slice();
            gravarConfigSessao(config);

            salvo[i] = true;
            desenharColunas();
        } else {
            console.log('Erro ao salvar. Status:', resposta.status);
            alert('Não foi possível salvar. Tente novamente.');
        }
    })
    .catch(function (erro) {
        console.log(erro);
        alert('Erro de conexão com o servidor.');
    });
}

function aplicarConfiguracao(config) {
    for (let i = 0; i < chavesTemas.length; i++) {
        let opcoesSalvas = config[chavesTemas[i]];

        if (opcoesSalvas) {
            marcadas[i] = opcoesSalvas.slice();
            aberta[i] = true;
            salvo[i] = true;
        }
    }

    desenharColunas();
}

function carregarConfiguracao() {
    let fkFuncionario = sessionStorage.getItem('ID_FUNCIONARIO');

    if (fkFuncionario == null) {
        return;
    }

    let config = lerConfigSessao();
    if (config != null) {
        aplicarConfiguracao(config);
        return;
    }

    fetch('/notificacao/buscarConfiguracao/' + fkFuncionario)
        .then(function (resposta) {
            if (!resposta.ok) {
                throw new Error('Status ' + resposta.status);
            }
            return resposta.json();
        })
        .then(function (configBanco) {
            gravarConfigSessao(configBanco);
            aplicarConfiguracao(configBanco);
        })
        .catch(function (erro) {
            console.log(erro);
        });
}

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
carregarConfiguracao();
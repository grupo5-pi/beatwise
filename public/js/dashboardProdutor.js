let dadosAlertas = [
    {
        tipo: 'positivo',
        texto: 'Aumento de 12% de visualizações no gênero Funk desde a última atualização - (Gênero top 5 mais escutados) - Spotify'
    },
    {
        tipo: 'negativo',
        texto: 'Queda de 8% nas curtidas do gênero Pop desde a última atualização'
    }
]

let dadosKpiFator = {
    valor: 'Energia ↑↑',
    texto: 'Músicas de sucesso (top 10) têm, em média, 35% mais energia que as de baixo desempenho.'
}

let dadosKpiDuracaoIdeal = {
    valor: '2:30 - 3:30',
    texto: 'Músicas nessa faixa têm streams 2x acima da média (980 mil vs média geral)'
}

let dadosKpiTotalStreams = {
    valor: '100 milhões - 45%',
    texto: 'Esse gênero tem a maior quantia de streams somadas da base.'
}

let dadosBpmFaixa = {
    genero: 'Pop',
    faixas: ['80–90', '90–100', '100–110', '110–120', '120–130', '130–140', '140–150'],
    views: [0.5, 4.8, 3.7, 2.9, 2.1, 4.7, 2.7],
    qtd: [8, 14, 22, 30, 25, 12, 5],
    retornoEsperado: 3
}

// valores / valoresReais -> músicas de sucesso
// valoresGeral / valoresReaisGeral -> todas as músicas (linha de comparação)
// "valores" vai de 0 a 100 (desenha o gráfico), "valoresReais" aparece ao passar o mouse
// OBS: são dados de exemplo, troque pelos dados reais
let dadosRadar = {
    genero: 'Pop',
    rotulos: ['BPM', 'Tonalidade', 'Energia', 'Valência', 'Dançabilidade'],
    valores: [65, 50, 80, 70, 75],
    valoresReais: ['118 BPM', 'Lá menor', '80%', '70%', '75%'],
    valoresGeral: [55, 45, 60, 55, 60],
    valoresReaisGeral: ['108 BPM', 'Dó maior', '60%', '55%', '60%']
}


let graficoBpm;
let graficoRadar;

let modoAnalise = false;

async function carregarDashboardProdutor() {
    let idAnalise = new URLSearchParams(window.location.search).get('analise');
    let musicasDaAnalise = null;

    if (idAnalise) {
        try {
            let resposta = await fetch('/metricas/' + encodeURIComponent(idAnalise) +
                '/dashboard?idFuncionario=' + sessionStorage.getItem('ID_FUNCIONARIO'));
            let json = await resposta.json();

            if (!resposta.ok) {
                throw new Error(json.mensagem || 'Erro ao carregar a análise.');
            }

            modoAnalise = true;
            musicasDaAnalise = json.musicas;
            mostrarIndicadorAnalise(json.analise, json.musicas.length);
            calcularDadosDaAnalise(json.analise, json.musicas);
        } catch (erro) {
            mostrarErroAnalise(erro.message);
        }
    }

    carregarAlertas();
    carregarKpis();
    montarGraficoBpm();
    montarGraficoRadar();
    carregarDispersao(musicasDaAnalise);
}

function carregarAlertas() {
    lista_alertas.innerHTML = '';

    for (let i = 0; i < dadosAlertas.length; i++) {
        let tipo = dadosAlertas[i].tipo;
        let icone = '';

        if (tipo == 'positivo') {
            icone = '✓';
        } else {
            icone = '✗';
        }

        lista_alertas.innerHTML += `
            <div class="dash-alerta dash-alerta-${tipo}">
                <span class="dash-alerta-icone">${icone}</span>
                <span>${dadosAlertas[i].texto}</span>
            </div>`;
    }
}

function carregarKpis() {
    kpi_fator_valor.textContent = dadosKpiFator.valor;
    kpi_fator_texto.textContent = dadosKpiFator.texto;

    kpi_duracao_ideal_valor.textContent = dadosKpiDuracaoIdeal.valor;
    kpi_duracao_ideal_texto.textContent = dadosKpiDuracaoIdeal.texto;

    kpi_total_streams_valor.textContent = dadosKpiTotalStreams.valor;
    kpi_total_streams_texto.textContent = dadosKpiTotalStreams.texto;
}

let pluginTextoRetorno = {
    id: 'textoRetorno',
    afterDatasetsDraw: function (grafico) {
        let ctx = grafico.ctx;
        let y = grafico.scales.y.getPixelForValue(dadosBpmFaixa.retornoEsperado);

        ctx.save();
        ctx.fillStyle = 'white';
        ctx.font = '12px Arial';
        ctx.fillText('Retorno esperado', grafico.chartArea.left + 8, y - 6);
        ctx.restore();
    }
}

function montarGraficoBpm() {
    let corDestaque = '#A855F7';
    let corApagada = '#6D28D9';
    let corBorda = 'rgba(139, 92, 246, 0.28)';

    Chart.defaults.color = corDestaque;

    titulo_bpm.textContent = dadosBpmFaixa.genero.toUpperCase() + ': média de views por faixa de BPM';

    let retorno = dadosBpmFaixa.retornoEsperado;
    let linhaRetorno = [];
    let cores = [];

    for (let i = 0; i < dadosBpmFaixa.views.length; i++) {
        linhaRetorno.push(retorno);

        if (dadosBpmFaixa.views[i] >= retorno) {
            cores.push(corDestaque);
        } else {
            cores.push(corApagada);
        }
    }

    graficoBpm = new Chart(grafico_bpm, {
        type: 'bar',
        data: {
            labels: dadosBpmFaixa.faixas,
            datasets: [
                {
                    type: 'bar',
                    label: 'Views médias (milhões)',
                    data: dadosBpmFaixa.views,
                    backgroundColor: cores,
                    borderRadius: 4,
                    order: 1
                },
                {
                    type: 'line',
                    label: 'Retorno esperado',
                    data: linhaRetorno,
                    borderColor: 'white',
                    borderDash: [6, 6],
                    borderWidth: 2,
                    pointRadius: 0,
                    order: 0
                }
            ]
        },
        plugins: [pluginTextoRetorno],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        afterLabel: function (item) {
                            if (item.datasetIndex == 0) {
                                return 'Músicas na faixa: ' + dadosBpmFaixa.qtd[item.dataIndex];
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true, suggestedMax: 5,
                    ticks: {
                        stepSize: modoAnalise ? undefined : 1,
                        callback: function (valor) {
                            return valor + ' mi';
                        }
                    },
                    grid: { color: corBorda }
                },
                x: { grid: { display: false } }
            }
        }
    })
}

function montarGraficoRadar() {
    let corDestaque = '#A855F7';
    let corBorda = 'rgba(139, 92, 246, 0.28)';

    titulo_radar.textContent = dadosRadar.genero.toUpperCase() + ' - Perfil musical das músicas de sucesso x todas as músicas';

    graficoRadar = new Chart(grafico_radar, {
        type: 'radar',
        data: {
            labels: dadosRadar.rotulos,
            datasets: [
                {
                    label: 'Perfil das músicas de sucesso',
                    data: dadosRadar.valores,
                    backgroundColor: 'rgba(168, 85, 247, 0.3)',
                    borderColor: corDestaque,
                    borderWidth: 2,
                    pointBackgroundColor: corDestaque,
                    pointRadius: 4
                },
                {
                    label: 'Perfil de todas as músicas',
                    data: dadosRadar.valoresGeral,
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    borderColor: 'white',
                    borderDash: [6, 6],
                    borderWidth: 2,
                    pointBackgroundColor: 'white',
                    pointRadius: 4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: { color: 'white' }
                },
                tooltip: {
                    callbacks: {
                        label: function (item) {
                            let valorReal = '';

                            if (item.datasetIndex == 0) {
                                valorReal = dadosRadar.valoresReais[item.dataIndex];
                            } else {
                                valorReal = dadosRadar.valoresReaisGeral[item.dataIndex];
                            }

                            return item.dataset.label + ': ' + valorReal;
                        }
                    }
                }
            },
            scales: {
                r: {
                    min: 0,
                    max: 100,
                    ticks: {
                        display: false,
                        stepSize: 25
                    },
                    grid: { color: corBorda },
                    angleLines: { color: corBorda },
                    pointLabels: {
                        color: 'white',
                        font: { size: 13 }
                    }
                }
            }
        }
    })
}

let ROTULOS_CARACTERISTICAS = {
    dancabilidade: 'Dançabilidade',
    energia: 'Energia',
    tonalidade: 'Tonalidade',
    acustica: 'Acústica',
    vivicidade: 'Vivacidade',
    valenciaPositividade: 'Valência',
    tempoBPM: 'BPM'
};

let NOTAS = ['Dó', 'Dó♯', 'Ré', 'Ré♯', 'Mi', 'Fá', 'Fá♯', 'Sol', 'Sol♯', 'Lá', 'Lá♯', 'Si'];

function escaparHtml(texto) {
    return String(texto)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatarCompacto(valor) {
    return new Intl.NumberFormat('pt-BR', { notation: 'compact', maximumFractionDigits: 1 }).format(valor);
}

function media(lista, campo) {
    let soma = 0;
    let qtd = 0;
    for (let i = 0; i < lista.length; i++) {
        let valor = lista[i][campo];
        if (valor !== null && valor !== undefined && !isNaN(valor)) {
            soma += Number(valor);
            qtd++;
        }
    }
    return qtd > 0 ? soma / qtd : null;
}

function nomeDosGeneros(analise) {
    if (analise.generos.length == 0) return 'Todos os gêneros';
    return analise.generos.join(' / ');
}

function textoFiltrosAnalise(analise) {
    let filtros = [];

    if (analise.periodo != 'todos') {
        filtros.push(analise.anoInicio + ' a ' + analise.anoFim);
    }

    if (analise.generos.length == 0) {
        filtros.push('todos os gêneros');
    } else {
        filtros.push(analise.generos.join(', '));
    }

    for (let chave in analise.caracteristicas) {
        let faixa = analise.caracteristicas[chave];
        let rotulo = ROTULOS_CARACTERISTICAS[chave] || chave;
        filtros.push(rotulo + ' ' + faixa[0] + ' a ' + faixa[1]);
    }

    return filtros.join(' · ');
}

function mostrarIndicadorAnalise(analise, totalMusicas) {
    let indicador = document.getElementById('indicador_analise');

    indicador.innerHTML = `
        <span>
            Métrica aplicada: <strong>${escaparHtml(analise.nome)}</strong>
            <span class="dash-analise-filtros"> · ${escaparHtml(textoFiltrosAnalise(analise))}</span>
        </span>
        <span class="dash-analise-acoes">
            <span>${totalMusicas.toLocaleString('pt-BR')} músicas</span>
            <a href="./dashboardProdutor.html">Remover métrica</a>
        </span>`;
    indicador.hidden = false;
}

function mostrarErroAnalise(mensagem) {
    let indicador = document.getElementById('indicador_analise');
    indicador.classList.add('dash-analise-erro');
    indicador.innerHTML = `<span>Não foi possível aplicar a métrica: ${escaparHtml(mensagem)} Mostrando os dados de exemplo.</span>`;
    indicador.hidden = false;
}

function calcularDadosDaAnalise(analise, musicas) {
    let generoTitulo = nomeDosGeneros(analise);

    dadosAlertas = [];
    if (musicas.length == 0) {
        dadosAlertas.push({ tipo: 'negativo', texto: 'Nenhuma música da base atende aos filtros desta análise.' });
    }

    let comViews = musicas
        .filter(function (m) { return m.views > 0; })
        .sort(function (a, b) { return b.views - a.views; });
    let qtdSucesso = Math.max(1, Math.round(comViews.length * 0.1));
    let sucesso = comViews.slice(0, qtdSucesso);
    let demais = comViews.slice(qtdSucesso);

    dadosKpiFator = calcularFatorDecisivo(sucesso, demais);
    dadosKpiDuracaoIdeal = calcularDuracaoIdeal(musicas);
    dadosKpiTotalStreams = calcularStreamsPorGenero(musicas);
    dadosBpmFaixa = calcularBpmPorFaixa(comViews, generoTitulo);
    dadosRadar = calcularRadar(sucesso, musicas, generoTitulo);
}

function calcularFatorDecisivo(sucesso, demais) {
    if (sucesso.length == 0 || demais.length == 0) {
        return { valor: '—', texto: 'Músicas com views insuficientes para comparar o desempenho.' };
    }

    let campos = ['energia', 'dancabilidade', 'valenciaPositividade', 'acustica', 'vivicidade', 'tempoBPM'];
    let melhor = null;

    for (let i = 0; i < campos.length; i++) {
        let mediaSucesso = media(sucesso, campos[i]);
        let mediaDemais = media(demais, campos[i]);
        if (mediaSucesso === null || !mediaDemais) continue;

        let diferenca = (mediaSucesso - mediaDemais) / mediaDemais * 100;
        if (melhor == null || Math.abs(diferenca) > Math.abs(melhor.diferenca)) {
            melhor = { campo: campos[i], diferenca: diferenca };
        }
    }

    if (melhor == null) {
        return { valor: '—', texto: 'Sem características suficientes para comparar.' };
    }

    let rotulo = ROTULOS_CARACTERISTICAS[melhor.campo];
    let maisOuMenos = melhor.diferenca >= 0 ? 'mais' : 'menos';
    let seta = melhor.diferenca >= 0 ? ' ↑↑' : ' ↓↓';

    return {
        valor: rotulo + seta,
        texto: 'Músicas de sucesso (top 10% em views) têm, em média, ' +
            Math.abs(melhor.diferenca).toFixed(0) + '% ' + maisOuMenos + ' ' +
            rotulo.toLowerCase() + ' que as demais.'
    };
}

function formatarMinutos(segundos) {
    let min = Math.floor(segundos / 60);
    let seg = segundos % 60;
    return min + ':' + (seg < 10 ? '0' : '') + seg;
}

function calcularDuracaoIdeal(musicas) {
    let comStreams = musicas.filter(function (m) { return m.streams > 0 && m.duracaoMs > 0; });
    if (comStreams.length == 0) {
        return { valor: '—', texto: 'Sem dados de duração e streams para esta análise.' };
    }

    let faixas = [[90, 150], [150, 210], [210, 270], [270, 330]];
    let minimoPorFaixa = comStreams.length >= 20 ? 3 : 1;
    let melhor = null;

    for (let i = 0; i < faixas.length; i++) {
        let naFaixa = comStreams.filter(function (m) {
            let segundos = m.duracaoMs / 1000;
            return segundos >= faixas[i][0] && segundos < faixas[i][1];
        });
        if (naFaixa.length < minimoPorFaixa) continue;

        let mediaFaixa = media(naFaixa, 'streams');
        if (melhor == null || mediaFaixa > melhor.media) {
            melhor = { faixa: faixas[i], media: mediaFaixa };
        }
    }

    if (melhor == null) {
        return { valor: '—', texto: 'Poucas músicas em cada faixa de duração para comparar.' };
    }

    return {
        valor: formatarMinutos(melhor.faixa[0]) + ' - ' + formatarMinutos(melhor.faixa[1]),
        texto: 'Músicas nessa faixa têm, em média, ' + formatarCompacto(melhor.media) +
            ' streams (média geral: ' + formatarCompacto(media(comStreams, 'streams')) + ').'
    };
}

function calcularStreamsPorGenero(musicas) {
    let somaPorGenero = {};
    let total = 0;
    let comGenero = 0;

    for (let i = 0; i < musicas.length; i++) {
        let genero = musicas[i].genero;
        if (!genero) continue;

        let streams = Number(musicas[i].streams) || 0;
        somaPorGenero[genero] = (somaPorGenero[genero] || 0) + streams;
        total += streams;
        comGenero++;
    }

    if (comGenero == 0) {
        return { valor: '—', texto: 'Nenhuma música desta análise tem gênero ainda. Rode a integração do iTunes.' };
    }

    let maior = null;
    for (let genero in somaPorGenero) {
        if (maior == null || somaPorGenero[genero] > somaPorGenero[maior]) {
            maior = genero;
        }
    }

    if (total == 0) {
        return { valor: '—', texto: 'Sem dados de streams para esta análise.' };
    }

    let porcentagem = Math.round(somaPorGenero[maior] / total * 100);
    let texto = maior + ' tem a maior soma de streams entre as músicas desta análise';

    if (comGenero < musicas.length) {
        texto += ' (considerando ' + comGenero.toLocaleString('pt-BR') + ' de ' +
            musicas.length.toLocaleString('pt-BR') + ' músicas com gênero identificado)';
    }

    return {
        valor: formatarCompacto(somaPorGenero[maior]) + ' - ' + porcentagem + '%',
        texto: texto + '.'
    };
}

function calcularBpmPorFaixa(comViews, generoTitulo) {
    let faixas = [
        { rotulo: '<80', min: 0, max: 80 },
        { rotulo: '80–90', min: 80, max: 90 },
        { rotulo: '90–100', min: 90, max: 100 },
        { rotulo: '100–110', min: 100, max: 110 },
        { rotulo: '110–120', min: 110, max: 120 },
        { rotulo: '120–130', min: 120, max: 130 },
        { rotulo: '130–140', min: 130, max: 140 },
        { rotulo: '140–150', min: 140, max: 150 },
        { rotulo: '150+', min: 150, max: Infinity }
    ];

    let dados = { genero: generoTitulo, faixas: [], views: [], qtd: [], retornoEsperado: 0 };

    for (let i = 0; i < faixas.length; i++) {
        let naFaixa = comViews.filter(function (m) {
            return m.tempoBPM >= faixas[i].min && m.tempoBPM < faixas[i].max;
        });
        let mediaViews = media(naFaixa, 'views');

        dados.faixas.push(faixas[i].rotulo);
        dados.views.push(mediaViews ? Number((mediaViews / 1e6).toFixed(2)) : 0);
        dados.qtd.push(naFaixa.length);
    }

    let mediaGeral = media(comViews, 'views');
    dados.retornoEsperado = mediaGeral ? Number((mediaGeral / 1e6).toFixed(2)) : 0;

    return dados;
}

function perfilRadar(lista) {
    let bpm = media(lista, 'tempoBPM');
    let energia = media(lista, 'energia');
    let valencia = media(lista, 'valenciaPositividade');
    let danca = media(lista, 'dancabilidade');

    let contagem = {};
    let tom = null;
    for (let i = 0; i < lista.length; i++) {
        let t = lista[i].tonalidade;
        if (t === null || t === undefined) continue;
        contagem[t] = (contagem[t] || 0) + 1;
        if (tom === null || contagem[t] > contagem[tom]) tom = t;
    }

    function porcento(valor) {
        return valor === null ? 0 : Math.round(valor * 100);
    }

    return {
        valores: [
            bpm === null ? 0 : Math.max(0, Math.min(100, Math.round((bpm - 60) / 120 * 100))),
            tom === null ? 0 : Math.round(tom / 11 * 100),
            porcento(energia),
            porcento(valencia),
            porcento(danca)
        ],
        valoresReais: [
            bpm === null ? '—' : Math.round(bpm) + ' BPM',
            tom === null ? '—' : NOTAS[tom],
            porcento(energia) + '%',
            porcento(valencia) + '%',
            porcento(danca) + '%'
        ]
    };
}

function calcularRadar(sucesso, todas, generoTitulo) {
    let perfilSucesso = perfilRadar(sucesso);
    let perfilGeral = perfilRadar(todas);

    return {
        genero: generoTitulo,
        rotulos: ['BPM', 'Tonalidade', 'Energia', 'Valência', 'Dançabilidade'],
        valores: perfilSucesso.valores,
        valoresReais: perfilSucesso.valoresReais,
        valoresGeral: perfilGeral.valores,
        valoresReaisGeral: perfilGeral.valoresReais
    };
}
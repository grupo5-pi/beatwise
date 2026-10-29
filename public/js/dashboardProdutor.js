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

function carregarDashboardProdutor() {
    carregarAlertas();
    carregarKpis();
    montarGraficoBpm();
    montarGraficoRadar();
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
                    label: dadosBpmFaixa.unidade == 'bi' ? 'Views médias (bilhões)' : 'Views médias (milhões)',
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
                        stepSize: 1,
                        callback: function (valor) {
                            return valor + ' ' + (dadosBpmFaixa.unidade || 'mi');
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

    titulo_radar.textContent = dadosRadar.genero.toUpperCase() + ' - ' + (dadosRadar.comparacao || 'Perfil musical das músicas de sucesso x todas as músicas');

    graficoRadar = new Chart(grafico_radar, {
        type: 'radar',
        data: {
            labels: dadosRadar.rotulos,
            datasets: [
                {
                    label: dadosRadar.serie || 'Perfil das músicas de sucesso',
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
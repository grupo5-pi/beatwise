let dadosAlertas = []

let dadosKpiFator = {
    valor: '...',
    texto: 'Carregando...'
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
    faixas: [],
    views: [],
    qtd: [],
    retornoEsperado: 0
}


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
    carregarGeneros();
    montarGraficoRadar();
}

function carregarAlertas() {
    fetch('/dashboardProdutor/alertas').then(function (resposta) {
        if (!resposta.ok) {
            throw new Error('Erro ao carregar os alertas');
        }
        return resposta.json();
    }).then(function (lista) {
        dadosAlertas = lista;
        mostrarAlertas();
    }).catch(function (erro) {
        console.log(erro);
        dadosAlertas = [];
        mostrarAlertas();
    });
}

function mostrarAlertas() {
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
    carregarKpiFator();

    kpi_duracao_ideal_valor.textContent = dadosKpiDuracaoIdeal.valor;
    kpi_duracao_ideal_texto.textContent = dadosKpiDuracaoIdeal.texto;

    kpi_total_streams_valor.textContent = dadosKpiTotalStreams.valor;
    kpi_total_streams_texto.textContent = dadosKpiTotalStreams.texto;
}

function carregarKpiFator() {
    kpi_fator_valor.textContent = dadosKpiFator.valor;
    kpi_fator_texto.textContent = dadosKpiFator.texto;

    fetch('/dashboardProdutor/fatorDecisivo').then(function (resposta) {
        if (!resposta.ok) {
            throw new Error('Erro ao carregar o fator decisivo');
        }
        return resposta.json();
    }).then(function (dados) {
        kpi_fator_valor.textContent = dados.valor;
        kpi_fator_texto.textContent = dados.texto;
    }).catch(function (erro) {
        console.log(erro);
        kpi_fator_valor.textContent = '—';
        kpi_fator_texto.textContent = 'Não foi possível carregar este indicador.';
    });
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
    let corBorda = 'rgba(139, 92, 246, 0.28)';

    Chart.defaults.color = corDestaque;

    graficoBpm = new Chart(grafico_bpm, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    type: 'bar',
                    label: 'Views médias (milhões)',
                    data: [],
                    backgroundColor: [],
                    borderRadius: 4,
                    order: 1
                },
                {
                    type: 'line',
                    label: 'Retorno esperado',
                    data: [],
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
                    beginAtZero: true,
                    ticks: {
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

function carregarGeneros() {
    fetch('/dashboardProdutor/generos').then(function (resposta) {
        if (!resposta.ok) {
            throw new Error('Erro ao carregar os gêneros');
        }
        return resposta.json();
    }).then(function (lista) {
        select_genero_bpm.innerHTML = '';

        if (lista.length == 0) {
            titulo_bpm.textContent = 'Nenhum gênero na base ainda';
            return;
        }

        let padrao = lista[0].genero;

        for (let i = 0; i < lista.length; i++) {
            select_genero_bpm.innerHTML += `<option value="${lista[i].genero}">${lista[i].genero}</option>`;

            if (lista[i].genero == 'Pop') {
                padrao = 'Pop';
            }
        }

        select_genero_bpm.value = padrao;
        carregarGraficoBpm();
    }).catch(function (erro) {
        console.log(erro);
        titulo_bpm.textContent = 'Não foi possível carregar os gêneros';
    });
}

function carregarGraficoBpm() {
    let genero = select_genero_bpm.value;

    fetch('/dashboardProdutor/viewsPorBpm?genero=' + encodeURIComponent(genero)).then(function (resposta) {
        if (!resposta.ok) {
            throw new Error('Erro ao carregar o gráfico');
        }
        return resposta.json();
    }).then(function (dados) {
        dadosBpmFaixa = dados;
        atualizarGraficoBpm();
    }).catch(function (erro) {
        console.log(erro);
        titulo_bpm.textContent = 'Não foi possível carregar o gráfico';
    });
}

function atualizarGraficoBpm() {
    let corDestaque = '#A855F7';
    let corApagada = '#6D28D9';

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

    graficoBpm.data.labels = dadosBpmFaixa.faixas;
    graficoBpm.data.datasets[0].data = dadosBpmFaixa.views;
    graficoBpm.data.datasets[0].backgroundColor = cores;
    graficoBpm.data.datasets[1].data = linhaRetorno;
    graficoBpm.update();
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
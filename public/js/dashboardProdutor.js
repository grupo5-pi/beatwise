let dadosAlertas = []

let dadosKpiFator = {
    valor: '...',
    texto: 'Carregando...'
}

let dadosKpiDuracaoIdeal = {
    valor: '...',
    texto: 'Carregando...'
}

let dadosKpiTotalStreams = {
    valor: '...',
    texto: 'Carregando...'
}

let dadosBpmFaixa = {
    genero: 'Pop',
    faixas: [],
    views: [],
    qtd: [],
    retornoEsperado: 0
}


let dadosRadar = {
    genero: 'Todos os gêneros',
    rotulos: ['BPM', 'Tonalidade', 'Energia', 'Valência', 'Dançabilidade'],
    valores: [],
    valoresReais: [],
    valoresGeral: [],
    valoresReaisGeral: []
}


let graficoBpm;
let graficoRadar;

// Campo do Session Storage onde fica a métrica usada para filtrar a dashboard.
// Formato (todos os campos são opcionais):
// { "nome": "Pop anos 2010", "anoInicio": 2010, "anoFim": 2019, "generos": ["Pop", "Rock"] }
// Para limpar o filtro: sessionStorage.removeItem('METRICA_DASHBOARD')
const CHAVE_METRICA = 'METRICA_DASHBOARD';

function lerMetricaSessao() {
    let bruto = sessionStorage.getItem(CHAVE_METRICA);

    if (bruto == null) {
        return null;
    }

    try {
        return JSON.parse(bruto);
    } catch (erro) {
        console.log('Métrica inválida no Session Storage:', erro);
        return null;
    }
}

function montarQueryMetrica() {
    let metrica = lerMetricaSessao();

    if (metrica == null) {
        return '';
    }

    let parametros = [];

    if (metrica.anoInicio != null && metrica.anoInicio !== '') {
        parametros.push('anoInicio=' + encodeURIComponent(metrica.anoInicio));
    }

    if (metrica.anoFim != null && metrica.anoFim !== '') {
        parametros.push('anoFim=' + encodeURIComponent(metrica.anoFim));
    }

    let generos = metrica.generos;

    if (typeof generos == 'string') {
        generos = generos.split(',');
    }

    if (Array.isArray(generos)) {
        let limpos = [];

        for (let i = 0; i < generos.length; i++) {
            let nome = String(generos[i]).trim();

            if (nome != '') {
                limpos.push(nome);
            }
        }

        if (limpos.length > 0) {
            parametros.push('generos=' + encodeURIComponent(limpos.join(',')));
        }
    }

    if (parametros.length == 0) {
        return '';
    }

    return '?' + parametros.join('&');
}

function carregarDashboardProdutor() {
    carregarAlertas();
    carregarKpis();
    montarGraficoBpm();
    carregarGeneros();
    montarGraficoRadar();
    carregarRadar();
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
    carregarKpiDuracao();
    carregarKpiTotalStreams();
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

function carregarKpiDuracao() {
    kpi_duracao_ideal_valor.textContent = dadosKpiDuracaoIdeal.valor;
    kpi_duracao_ideal_texto.textContent = dadosKpiDuracaoIdeal.texto;

    fetch('/dashboardProdutor/duracaoIdeal').then(function (resposta) {
        if (!resposta.ok) {
            throw new Error('Erro ao carregar a duração ideal');
        }
        return resposta.json();
    }).then(function (dados) {
        kpi_duracao_ideal_valor.textContent = dados.valor;
        kpi_duracao_ideal_texto.textContent = dados.texto;
    }).catch(function (erro) {
        console.log(erro);
        kpi_duracao_ideal_valor.textContent = '—';
        kpi_duracao_ideal_texto.textContent = 'Não foi possível carregar este indicador.';
    });
}

function carregarKpiTotalStreams() {
    kpi_total_streams_valor.textContent = dadosKpiTotalStreams.valor;
    kpi_total_streams_texto.textContent = dadosKpiTotalStreams.texto;

    fetch('/dashboardProdutor/streamsPorGenero' + montarQueryMetrica()).then(function (resposta) {
        if (!resposta.ok) {
            throw new Error('Erro ao carregar o total de streams por gênero');
        }
        return resposta.json();
    }).then(function (dados) {
        kpi_total_streams_valor.textContent = dados.valor;
        kpi_total_streams_texto.textContent = dados.texto;
    }).catch(function (erro) {
        console.log(erro);
        kpi_total_streams_valor.textContent = '—';
        kpi_total_streams_texto.textContent = 'Não foi possível carregar este indicador.';
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

    titulo_radar.textContent = 'Carregando...';

    graficoRadar = new Chart(grafico_radar, {
        type: 'radar',
        data: {
            labels: dadosRadar.rotulos,
            datasets: [
                {
                    label: 'Perfil das músicas de sucesso',
                    data: [],
                    backgroundColor: 'rgba(168, 85, 247, 0.3)',
                    borderColor: corDestaque,
                    borderWidth: 2,
                    pointBackgroundColor: corDestaque,
                    pointRadius: 4
                },
                {
                    label: 'Perfil de todas as músicas',
                    data: [],
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

function carregarRadar() {
    let metrica = lerMetricaSessao();
    let textoMetrica = '';

    if (metrica != null && metrica.nome) {
        textoMetrica = ' | Métrica aplicada: ' + metrica.nome;
    }

    fetch('/dashboardProdutor/radar' + montarQueryMetrica()).then(function (resposta) {
        if (!resposta.ok) {
            throw new Error('Erro ao carregar o radar');
        }
        return resposta.json();
    }).then(function (dados) {
        dadosRadar.genero = dados.genero;

        if (dados.vazio) {
            dadosRadar.valores = [];
            dadosRadar.valoresReais = [];
            dadosRadar.valoresGeral = [];
            dadosRadar.valoresReaisGeral = [];

            atualizarGraficoRadar();
            titulo_radar.textContent = 'Nenhuma música encontrada para a métrica aplicada';
            subtitulo_radar.textContent = 'Características musicais' + textoMetrica;
            return;
        }

        dadosRadar.valores = dados.valores;
        dadosRadar.valoresReais = dados.valoresReais;
        dadosRadar.valoresGeral = dados.valoresGeral;
        dadosRadar.valoresReaisGeral = dados.valoresReaisGeral;

        atualizarGraficoRadar();

        subtitulo_radar.textContent = 'Características musicais - sucesso: ' +
            dados.qtdSucesso.toLocaleString('pt-BR') + ' músicas mais vistas de ' +
            dados.qtdTotal.toLocaleString('pt-BR') + textoMetrica;
    }).catch(function (erro) {
        console.log(erro);
        titulo_radar.textContent = 'Não foi possível carregar o gráfico';
    });
}

function atualizarGraficoRadar() {
    titulo_radar.textContent = dadosRadar.genero.toUpperCase() + ' - Perfil musical das músicas de sucesso x todas as músicas';

    graficoRadar.data.datasets[0].data = dadosRadar.valores;
    graficoRadar.data.datasets[1].data = dadosRadar.valoresGeral;
    graficoRadar.update();
}
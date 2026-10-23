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

let dadosBpmFaixa = {
    genero: 'Pop',
    faixas: ['80–90', '90–100', '100–110', '110–120', '120–130', '130–140', '140–150'],
    views: [0.5, 4.8, 3.7, 2.9, 2.1, 4.7, 2.7],
    qtd: [8, 14, 22, 30, 25, 12, 5],     
    retornoEsperado: 3                    
}


let graficoBpm;

function carregarDashboardProdutor() {
    carregarAlertas();
    carregarKpiFator();
    montarGraficoBpm();
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

function carregarKpiFator() {
    kpi_fator_valor.textContent = dadosKpiFator.valor;
    kpi_fator_texto.textContent = dadosKpiFator.texto;
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
                y: { beginAtZero: true, suggestedMax: 5, 
                        ticks: {
                            stepSize: 1,
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
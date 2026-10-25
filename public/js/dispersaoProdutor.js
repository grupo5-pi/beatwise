function carregarDispersao() {
    const musicas = musicasExemplo;

    const caracteristicas = {
        dancabilidade:        { rotulo: 'Dançabilidade',            min: 0, max: 1 },
        energia:              { rotulo: 'Energia',                  min: 0, max: 1 },
        tonalidade:           { rotulo: 'Tonalidade',               min: 0, max: 11, passo: 1 },
        intensidadeSonora:    { rotulo: 'Intensidade sonora (dB)' },
        acustica:             { rotulo: 'Acústica',                 min: 0, max: 1 },
        instrumentalidade:    { rotulo: 'Instrumentalidade',        min: 0, max: 1 },
        vivicidade:           { rotulo: 'Vivacidade',               min: 0, max: 1 },
        valenciaPositividade: { rotulo: 'Valência',                 min: 0, max: 1 },
        tempoBPM:             { rotulo: 'BPM',                      min: 0, max: 250 }
    };

    const VIEWS_MINIMO = 1e8;
    const VIEWS_MAXIMO = 1e10;

    const COR_TEXTO = '#c4b5fd';
    const COR_PONTOS = 'rgba(168, 85, 247, 0.8)';
    const COR_GRADE = 'rgba(139, 92, 246, 0.28)';
    const COR_MEDIANA = '#ddd6fe';


    function formatarViews(valor) {
        return new Intl.NumberFormat('pt-BR', { notation: 'compact' }).format(valor);
    }

    function formatarNumero(valor) {
        return valor.toLocaleString('pt-BR', { maximumFractionDigits: 2 });
    }

    function calcularMediana(valores) {
        const ordenados = [...valores].sort((a, b) => a - b);
        const meio = Math.floor(ordenados.length / 2);

        if (ordenados.length % 2 === 1) {
            return ordenados[meio];
        }
        return (ordenados[meio - 1] + ordenados[meio]) / 2;
    }


    const seletor = document.getElementById('select_caracteristica');

    for (const chave in caracteristicas) {
        seletor.add(new Option(caracteristicas[chave].rotulo, chave));
    }
    seletor.value = 'energia';


    const grafico = new Chart(document.getElementById('grafico_dispersao'), {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Músicas',
                    backgroundColor: COR_PONTOS,
                    pointRadius: 7,
                    clip: false
                },
                {
                    showLine: true,
                    borderColor: COR_MEDIANA,
                    borderDash: [6, 5],
                    borderWidth: 1.5,
                    pointRadius: 0,
                    pointStyle: 'line'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            color: COR_TEXTO,
            scales: {
                x: {
                    grid: { color: COR_GRADE },
                    ticks: { color: COR_TEXTO },
                    title: { display: true, color: COR_TEXTO }
                },
                y: {
                    type: 'logarithmic',
                    min: VIEWS_MINIMO,
                    max: VIEWS_MAXIMO,
                    grid: { color: COR_GRADE },
                    title: { display: true, text: 'Views', color: COR_TEXTO },
                    ticks: { color: COR_TEXTO, callback: formatarViews },
                    afterBuildTicks: (eixo) => {
                        const marcas = [];
                        for (let views = VIEWS_MINIMO; views <= VIEWS_MAXIMO; views *= 10) {
                            marcas.push({ value: views });
                        }
                        eixo.ticks = marcas;
                    }
                }
            },
            plugins: {
                legend: { labels: { usePointStyle: true } },
                tooltip: {
                    filter: (item) => item.datasetIndex === 0,
                    callbacks: {
                        title: (itens) => itens[0].raw.titulo,
                        label: (item) => [
                            item.raw.artista,
                            `${caracteristicas[seletor.value].rotulo}: ${formatarNumero(item.raw.x)}`,
                            `Views: ${formatarViews(item.raw.y)}`
                        ]
                    }
                }
            }
        }
    });


    function atualizarGrafico() {
        const chave = seletor.value;
        const config = caracteristicas[chave];

        const pontos = musicas.map(musica => ({
            x: Number(musica[chave]),
            y: Number(musica.views),
            titulo: musica.titulo,
            artista: musica.artista
        }));

        const mediana = calcularMediana(pontos.map(ponto => ponto.x));

        grafico.data.datasets[0].data = pontos;

        grafico.data.datasets[1].label = 'Mediana: ' + formatarNumero(mediana);
        grafico.data.datasets[1].data = [
            { x: mediana, y: VIEWS_MINIMO },
            { x: mediana, y: VIEWS_MAXIMO }
        ];

        grafico.options.scales.x.min = config.min;
        grafico.options.scales.x.max = config.max;
        grafico.options.scales.x.ticks.stepSize = config.passo;
        grafico.options.scales.x.title.text = config.rotulo;

        grafico.update();
    }

    seletor.addEventListener('change', atualizarGrafico);
    atualizarGrafico();
}
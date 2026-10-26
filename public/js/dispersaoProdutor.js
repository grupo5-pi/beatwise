function carregarDispersao() {
    const musicas = musicasExemplo;

    const caracteristicas = {
        dancabilidade: {
            rotulo: 'Dançabilidade',
            min: 0,
            max: 0.975
        },
        energia: {
            rotulo: 'Energia',
            min: 0,
            max: 1
        },
        tonalidade: {
            rotulo: 'Tonalidade',
            min: 0,
            max: 11,
            passo: 1
        },
        intensidadeSonora: {
            rotulo: 'Intensidade sonora (dB)',
            min: -46.251,
            max: 0.92
        },
        acustica: {
            rotulo: 'Acústica',
            min: 0,
            max: 0.996
        },
        instrumentalidade: {
            rotulo: 'Instrumentalidade',
            min: 0,
            max: 1,
            transformar: valor => Math.sqrt(valor),
            inverter: valor => valor ** 2
        },
        vivicidade: {
            rotulo: 'Vivacidade',
            min: 0,
            max: 1
        },
        valenciaPositividade: {
            rotulo: 'Valência',
            min: 0,
            max: 0.993
        },
        tempoBPM: {
            rotulo: 'BPM',
            min: 0,
            max: 250
        }
    };

    const VIEWS_MINIMO = 1e8;
    const VIEWS_MAXIMO = 1e10;

    const COR_TEXTO = '#c4b5fd';
    const COR_PONTOS = 'rgba(168, 85, 247, 0.8)';
    const COR_GRADE = 'rgba(139, 92, 246, 0.28)';
    const COR_TENDENCIA = '#ddd6fe';


    function calcularLinhaTendencia(pontos, config) {
        const validos = pontos.filter(ponto =>
            Number.isFinite(ponto.x) &&
            Number.isFinite(ponto.y) &&
            ponto.y > 0
        );

        if (validos.length < 2) return [];

        const n = validos.length;

        const somaX = validos.reduce((s, p) => s + p.x, 0);
        const somaY = validos.reduce(
            (s, p) => s + Math.log10(p.y), 0
        );
        const somaXY = validos.reduce(
            (s, p) => s + p.x * Math.log10(p.y), 0
        );
        const somaX2 = validos.reduce(
            (s, p) => s + p.x ** 2, 0
        );

        const denominador = n * somaX2 - somaX ** 2;

        if (denominador === 0) return [];

        const inclinacao =
            (n * somaXY - somaX * somaY) / denominador;

        const intercepto = (somaY - inclinacao * somaX) / n;

        function calcularY(x) {
            return 10 ** (intercepto + inclinacao * x);
        }

        const yInicial = calcularY(config.min);
        const yFinal = calcularY(config.max);

        return [
            {
                x: config.min,
                y: Math.max(VIEWS_MINIMO, Math.min(VIEWS_MAXIMO, yInicial))
            },
            {
                x: config.max,
                y: Math.max(VIEWS_MINIMO, Math.min(VIEWS_MAXIMO, yFinal))
            }
        ];
    }



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
                    label: 'Linha de tendência',
                    data: [],
                    showLine: true,
                    borderColor: COR_TENDENCIA,
                    borderDash: [6, 5],
                    borderWidth: 2,
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
                legend: {
                    labels: {
                        usePointStyle: true
                    }
                },

                tooltip: {
                    mode: 'nearest',
                    intersect: true,
                    filter: (item) => item.datasetIndex === 0,
                    callbacks: {
                        title: (itens) => {
                            return itens.length > 0
                                ? itens[0].raw.titulo
                                : '';
                        },

                        label: (item) => [
                            `Artista: ${item.raw.artista}`,
                            `${caracteristicas[seletor.value].rotulo}: ${formatarNumero(
                                item.raw.xOriginal ?? item.raw.x
                            )
                            }`,
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

        const pontos = musicas
            .map(musica => {
                const valorOriginal = Number(musica[chave]);

                return {
                    x: Number.isFinite(valorOriginal)
                        ? (config.transformar
                            ? config.transformar(valorOriginal)
                            : valorOriginal)
                        : NaN,
                    xOriginal: valorOriginal,
                    y: Number(musica.views),
                    titulo: musica.titulo,
                    artista: musica.artista
                };
            })
            .filter(ponto =>
                Number.isFinite(ponto.x) &&
                Number.isFinite(ponto.y) &&
                ponto.y > 0
            );

        grafico.data.datasets[0].data = pontos;


        grafico.data.datasets[1].data = calcularLinhaTendencia(pontos, {
            min: config.transformar
                ? config.transformar(config.min)
                : config.min,
            max: config.transformar
                ? config.transformar(config.max)
                : config.max
        });


        grafico.options.scales.x.min = config.transformar
            ? config.transformar(config.min)
            : config.min;

        grafico.options.scales.x.max = config.transformar
            ? config.transformar(config.max)
            : config.max;

        grafico.options.scales.x.ticks.stepSize =
            config.transformar ? undefined : config.passo;

        grafico.options.scales.x.title.text = config.rotulo;

        grafico.options.scales.x.ticks.callback = valor => {
            const original = config.inverter
                ? config.inverter(valor)
                : valor;

            return formatarNumero(original);
        };

        grafico.options.plugins.tooltip.callbacks.label = item => [
            item.raw.artista,
            `${config.rotulo}: ${formatarNumero(item.raw.xOriginal)}`,
            `Views: ${formatarViews(item.raw.y)}`
        ];

        grafico.update();
    }


    seletor.addEventListener('change', atualizarGrafico);
    atualizarGrafico();
}
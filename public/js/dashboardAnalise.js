(function () {
    var estilo = document.createElement('style');
    estilo.textContent = [
        '.dash-analise{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;',
        'padding:12px 16px;margin-bottom:16px;border-radius:12px;font-size:14px;',
        'background:rgba(124,92,255,.14);border:1px solid rgba(124,92,255,.45);color:inherit}',
        '.dash-analise[hidden]{display:none}',
        '.dash-analise-filtros{opacity:.8}',
        '.dash-analise-acoes{display:flex;align-items:center;gap:14px}',
        '.dash-analise-acoes a{color:inherit;text-decoration:underline}',
        '.dash-analise-erro{background:rgba(255,90,90,.14);border-color:rgba(255,90,90,.5)}'
    ].join('');
    document.head.appendChild(estilo);
    var ROTULOS_CARACTERISTICAS = {
        dancabilidade: 'Dançabilidade',
        energia: 'Energia',
        tonalidade: 'Tonalidade',
        acustica: 'Acústica',
        vivicidade: 'Vivacidade',
        valenciaPositividade: 'Valência',
        tempoBPM: 'BPM'
    };

    var NOTAS = ['Dó', 'Dó♯', 'Ré', 'Ré♯', 'Mi', 'Fá', 'Fá♯', 'Sol', 'Sol♯', 'Lá', 'Lá♯', 'Si'];

    var FATORES = [
        { campo: 'energia', nome: 'Energia', comparativo: 'energia' },
        { campo: 'dancabilidade', nome: 'Dançabilidade', comparativo: 'dançabilidade' },
        { campo: 'valenciaPositividade', nome: 'Valência', comparativo: 'valência' },
        { campo: 'acustica', nome: 'Acústica', comparativo: 'acústica' },
        { campo: 'tempoBPM', nome: 'BPM', comparativo: 'BPM' }
    ];

    var VIEWS_MINIMO = 1e8;
    var VIEWS_MAXIMO = 1e10;
    var LIMITE_PONTOS = 1000;


    function escaparHtml(texto) {
        return String(texto)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function media(lista, campo) {
        var soma = 0;
        var qtd = 0;
        for (var i = 0; i < lista.length; i++) {
            var valor = lista[i][campo];
            if (valor !== null && valor !== undefined && !isNaN(valor)) {
                soma += Number(valor);
                qtd++;
            }
        }
        return qtd > 0 ? soma / qtd : null;
    }

    function desvioPadrao(lista, campo) {
        var mediaLista = media(lista, campo);
        if (mediaLista === null) return 0;

        var soma = 0;
        var qtd = 0;
        for (var i = 0; i < lista.length; i++) {
            var valor = lista[i][campo];
            if (valor !== null && valor !== undefined && !isNaN(valor)) {
                soma += Math.pow(Number(valor) - mediaLista, 2);
                qtd++;
            }
        }
        return Math.sqrt(soma / qtd);
    }

    function abreviarNumero(valor) {
        if (valor >= 1000000000) return (valor / 1000000000).toFixed(1).replace('.', ',') + ' bi';
        if (valor >= 1000000) return (valor / 1000000).toFixed(1).replace('.', ',') + ' milhões';
        if (valor >= 1000) return Math.round(valor / 1000) + ' mil';
        return String(Math.round(valor));
    }

    function formatarTempo(segundos) {
        var min = Math.floor(segundos / 60);
        var seg = segundos % 60;
        return min + ':' + (seg < 10 ? '0' : '') + seg;
    }

    function nomeDosGeneros(analise) {
        if (analise.generos.length == 0) return 'Todos os gêneros';
        return analise.generos.join(' / ');
    }

    function textoFiltros(analise) {
        var filtros = [];

        if (analise.periodo != 'todos') {
            filtros.push(analise.anoInicio + ' a ' + analise.anoFim);
        }

        if (analise.generos.length == 0) {
            filtros.push('todos os gêneros');
        } else {
            filtros.push(analise.generos.join(', '));
        }

        for (var chave in analise.caracteristicas) {
            var faixa = analise.caracteristicas[chave];
            var rotulo = ROTULOS_CARACTERISTICAS[chave] || chave;
            filtros.push(rotulo + ' ' + faixa[0] + ' a ' + faixa[1]);
        }

        return filtros.join(' · ');
    }

    function mostrarIndicador(analise, totalMusicas) {
        var indicador = document.getElementById('indicador_analise');

        indicador.innerHTML = `
            <span>
                Métrica aplicada: <strong>${escaparHtml(analise.nome)}</strong>
                <span class="dash-analise-filtros"> · ${escaparHtml(textoFiltros(analise))}</span>
            </span>
            <span class="dash-analise-acoes">
                <span>${totalMusicas.toLocaleString('pt-BR')} músicas</span>
                <a href="./dashboardProdutor.html">Remover métrica</a>
            </span>`;
        indicador.hidden = false;
    }

    function mostrarErro(mensagem) {
        var indicador = document.getElementById('indicador_analise');
        indicador.classList.add('dash-analise-erro');
        indicador.innerHTML = `<span>Não foi possível aplicar a métrica: ${escaparHtml(mensagem)} Mostrando os dados gerais.</span>`;
        indicador.hidden = false;
    }

    function calcularFator(comViews) {
        var base = comViews.filter(function (m) { return m.tempoBPM > 0; });
        var qtdGrupo = Math.min(10, Math.floor(base.length / 2));

        if (qtdGrupo < 1) {
            return { valor: '—', texto: 'Ainda não há dados suficientes para calcular.' };
        }

        var top = base.slice(0, qtdGrupo);
        var baixo = base.slice(base.length - qtdGrupo);
        var escolhido = null;

        for (var i = 0; i < FATORES.length; i++) {
            var f = FATORES[i];
            var mediaTop = media(top, f.campo);
            var mediaBaixo = media(baixo, f.campo);
            var desvio = desvioPadrao(base, f.campo);
            if (mediaTop === null || !(mediaBaixo > 0) || !(desvio > 0)) continue;

            var distancia = Math.abs(mediaTop - mediaBaixo) / desvio;
            if (escolhido == null || distancia > escolhido.distancia) {
                escolhido = { fator: f, distancia: distancia, mediaTop: mediaTop, mediaBaixo: mediaBaixo };
            }
        }

        if (escolhido == null) {
            return { valor: '—', texto: 'Ainda não há dados suficientes para calcular.' };
        }

        var subiu = escolhido.mediaTop >= escolhido.mediaBaixo;
        var percentual = Math.round(Math.abs(escolhido.mediaTop - escolhido.mediaBaixo) / escolhido.mediaBaixo * 100);

        return {
            valor: escolhido.fator.nome + (subiu ? ' ↑↑' : ' ↓↓'),
            texto: 'Músicas de sucesso (top ' + qtdGrupo + ') têm, em média, ' + percentual + '% ' +
                (subiu ? 'mais ' : 'menos ') + escolhido.fator.comparativo + ' que as de baixo desempenho.'
        };
    }

    function calcularDuracaoIdeal(musicas) {
        var blocos = {};
        var totalMusicas = 0;
        var somaStreams = 0;

        for (var i = 0; i < musicas.length; i++) {
            var ms = Number(musicas[i].duracaoMs);
            var streams = Number(musicas[i].streams);
            if (!(ms >= 60000 && ms <= 600000) || !(streams > 0)) continue;

            var bloco = Math.floor(ms / 30000);
            if (!blocos[bloco]) blocos[bloco] = { total: 0, soma: 0 };
            blocos[bloco].total++;
            blocos[bloco].soma += streams;
            totalMusicas++;
            somaStreams += streams;
        }

        var semDados = { valor: '—', texto: 'Ainda não há dados suficientes para calcular.' };
        if (totalMusicas == 0) return semDados;

        var minimo = Math.min(30, Math.max(3, Math.round(totalMusicas / 10)));
        var mediaGeral = somaStreams / totalMusicas;
        var melhor = null;

        for (var chave in blocos) {
            var b = Number(chave);
            var a = blocos[b];
            var c = blocos[b + 1];
            if (!c) continue;

            var qtd = a.total + c.total;
            if (qtd < minimo) continue;

            var mediaJanela = (a.soma + c.soma) / qtd;
            if (melhor == null || mediaJanela > melhor.media) {
                melhor = { bloco: b, media: mediaJanela };
            }
        }

        if (melhor == null) return semDados;

        var inicio = melhor.bloco * 30;
        var vezes = melhor.media / mediaGeral;

        return {
            valor: formatarTempo(inicio) + ' - ' + formatarTempo(inicio + 60),
            texto: 'Músicas nessa faixa têm streams ' + vezes.toFixed(1).replace('.', ',') +
                'x acima da média (' + abreviarNumero(melhor.media) + ' vs ' + abreviarNumero(mediaGeral) + ' da média geral)'
        };
    }

    function calcularStreamsPorGenero(musicas) {
        var somaPorGenero = {};
        var total = 0;
        var comGenero = 0;

        for (var i = 0; i < musicas.length; i++) {
            var genero = musicas[i].genero;
            if (!genero) continue;

            var streams = Number(musicas[i].streams) || 0;
            somaPorGenero[genero] = (somaPorGenero[genero] || 0) + streams;
            total += streams;
            comGenero++;
        }

        if (comGenero == 0) {
            return { valor: '—', texto: 'Nenhuma música desta análise tem gênero ainda.' };
        }
        if (total == 0) {
            return { valor: '—', texto: 'Sem dados de streams para esta análise.' };
        }

        var maior = null;
        for (var g in somaPorGenero) {
            if (maior == null || somaPorGenero[g] > somaPorGenero[maior]) maior = g;
        }

        var texto = maior + ' tem a maior soma de streams entre as músicas desta análise';
        if (comGenero < musicas.length) {
            texto += ' (considerando ' + comGenero.toLocaleString('pt-BR') + ' de ' +
                musicas.length.toLocaleString('pt-BR') + ' músicas com gênero identificado)';
        }

        return {
            valor: abreviarNumero(somaPorGenero[maior]) + ' - ' + Math.round(somaPorGenero[maior] / total * 100) + '%',
            texto: texto + '.'
        };
    }

    function calcularBpmPorFaixa(comViews, generoTitulo) {
        var porFaixa = {};

        for (var i = 0; i < comViews.length; i++) {
            var bpm = Number(comViews[i].tempoBPM);
            if (!(bpm >= 60 && bpm < 180)) continue;

            var faixa = Math.floor(bpm / 10) * 10;
            if (!porFaixa[faixa]) porFaixa[faixa] = [];
            porFaixa[faixa].push(comViews[i]);
        }

        var chaves = Object.keys(porFaixa).map(Number).sort(function (a, b) { return a - b; });
        var dados = { genero: generoTitulo, faixas: [], views: [], qtd: [], retornoEsperado: 0 };

        if (chaves.length > 0) {
            for (var f = chaves[0]; f <= chaves[chaves.length - 1]; f += 10) {
                var naFaixa = porFaixa[f] || [];
                var mediaViews = media(naFaixa, 'views');

                dados.faixas.push(f + '–' + (f + 10));
                dados.views.push(mediaViews ? Math.round(mediaViews / 1e6 * 100) / 100 : 0);
                dados.qtd.push(naFaixa.length);
            }
        }

        var mediaGeral = media(comViews, 'views');
        dados.retornoEsperado = mediaGeral ? Math.round(mediaGeral / 1e6 * 100) / 100 : 0;

        return dados;
    }

    function perfilRadar(lista) {
        var bpm = media(lista, 'tempoBPM');
        var energia = media(lista, 'energia');
        var valencia = media(lista, 'valenciaPositividade');
        var danca = media(lista, 'dancabilidade');

        var contagem = {};
        var tom = null;
        for (var i = 0; i < lista.length; i++) {
            var t = lista[i].tonalidade;
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
        var perfilSucesso = perfilRadar(sucesso);
        var perfilGeral = perfilRadar(todas);

        return {
            genero: generoTitulo,
            rotulos: ['BPM', 'Tonalidade', 'Energia', 'Valência', 'Dançabilidade'],
            valores: perfilSucesso.valores,
            valoresReais: perfilSucesso.valoresReais,
            valoresGeral: perfilGeral.valores,
            valoresReaisGeral: perfilGeral.valoresReais
        };
    }

    function pontosDaDispersao(musicas) {
        return musicas
            .filter(function (m) { return Number(m.views) >= VIEWS_MINIMO && Number(m.views) <= VIEWS_MAXIMO; })
            .sort(function (a, b) { return b.views - a.views; })
            .slice(0, LIMITE_PONTOS)
            .map(function (m) {
                return {
                    titulo: m.titulo,
                    artista: m.artista || '—',
                    views: m.views,
                    dancabilidade: m.dancabilidade,
                    energia: m.energia,
                    tonalidade: m.tonalidade,
                    acustica: m.acustica,
                    vivicidade: m.vivicidade,
                    valenciaPositividade: m.valenciaPositividade,
                    tempoBPM: m.tempoBPM
                };
            });
    }

    function calcularTudo(analise, musicas) {
        var generoTitulo = nomeDosGeneros(analise);

        var comViews = musicas
            .filter(function (m) { return m.views > 0; })
            .sort(function (a, b) { return b.views - a.views; });
        var qtdSucesso = Math.max(1, Math.round(comViews.length * 0.1));

        return {
            alertas: musicas.length == 0
                ? [{ tipo: 'negativo', texto: 'Nenhuma música da base atende aos filtros desta análise.' }]
                : [],
            fator: calcularFator(comViews),
            duracao: calcularDuracaoIdeal(musicas),
            streams: calcularStreamsPorGenero(musicas),
            bpm: calcularBpmPorFaixa(comViews, generoTitulo),
            radar: calcularRadar(comViews.slice(0, qtdSucesso), musicas, generoTitulo),
            generos: [{ genero: generoTitulo, total: musicas.length }],
            dispersao: pontosDaDispersao(musicas)
        };
    }

    function responderComDadosDaAnalise(dados) {
        var respostas = {
            '/dashboardProdutor/alertas': dados.alertas,
            '/dashboardProdutor/fatorDecisivo': dados.fator,
            '/dashboardProdutor/duracaoIdeal': dados.duracao,
            '/dashboardProdutor/generos': dados.generos,
            '/dashboardProdutor/viewsPorBpm': dados.bpm,
            '/dashboardProdutor/dispersao': dados.dispersao
        };
        var fetchOriginal = window.fetch.bind(window);

        window.fetch = function (url, opcoes) {
            var caminho = String(url).split('?')[0];

            if (Object.prototype.hasOwnProperty.call(respostas, caminho)) {
                return Promise.resolve(new Response(JSON.stringify(respostas[caminho]), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                }));
            }
            return fetchOriginal(url, opcoes);
        };
    }

    var idAnalise = new URLSearchParams(window.location.search).get('analise');
    var preparo = idAnalise ? preparar(idAnalise) : null;

    async function preparar(id) {
        try {
            var resposta = await fetch('/metricas/' + encodeURIComponent(id) +
                '/dashboard?idFuncionario=' + sessionStorage.getItem('ID_FUNCIONARIO'));
            var json = await resposta.json();

            if (!resposta.ok) {
                throw new Error(json.mensagem || 'Erro ao carregar a análise.');
            }

            var dados = calcularTudo(json.analise, json.musicas);

            dadosKpiTotalStreams = dados.streams;
            dadosRadar = dados.radar;

            responderComDadosDaAnalise(dados);
            return { analise: json.analise, total: json.musicas.length };
        } catch (erro) {
            return { erro: erro.message };
        }
    }

    var carregarDashboardOriginal = carregarDashboardProdutor;

    carregarDashboardProdutor = async function () {
        if (preparo) {
            var resultado = await preparo;
            if (resultado.erro) {
                mostrarErro(resultado.erro);
            } else {
                mostrarIndicador(resultado.analise, resultado.total);
            }
        }

        return carregarDashboardOriginal();
    };

    var carregarDispersaoOriginal = carregarDispersao;

    carregarDispersao = async function () {
        if (preparo) await preparo;
        return carregarDispersaoOriginal.apply(this, arguments);
    };
})();
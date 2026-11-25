/* sidebar.js — comportamento padrão da sidebar (todas as telas internas)

   1) Expande ao clicar na sidebar; recolhe ao clicar fora ou com Esc.
   2) Preenche o usuário logado, sem nome escrito na mão no HTML:
        #nome-usuario                       → primeiro nome (sidebar)
        #sidebar-foto                       → foto (sidebar)
        [data-usuario="primeiro-nome"]      → primeiro nome (saudações)
        [data-usuario="nome"]               → nome completo
   3) Sem login (sem ID_FUNCIONARIO na sessão) → volta para login.html.

   Uso:  <script src="./js/sidebar.js" defer></script>               */
(function () {
    var ID = sessionStorage.ID_FUNCIONARIO;
    if (!ID) {
        window.location.href = './login.html';
        return;
    }

    function guardar(chave, valor) {
        try { sessionStorage.setItem(chave, valor || ''); } catch (e) { }
    }

    function primeiroNome(nome) {
        return (nome || '').trim().split(/\s+/)[0];
    }

    function aplicar() {
        var nome = sessionStorage.NOME_USUARIO || '';
        var primeiro = primeiroNome(nome);
        var foto = sessionStorage.FOTO_USUARIO || '';

        var elNome = document.getElementById('nome-usuario');
        if (elNome && primeiro) elNome.textContent = primeiro;

        document.querySelectorAll('[data-usuario="primeiro-nome"]').forEach(function (el) {
            el.textContent = primeiro;
        });
        document.querySelectorAll('[data-usuario="nome"]').forEach(function (el) {
            el.textContent = nome;
        });

        var elFoto = document.getElementById('sidebar-foto');
        if (elFoto && foto) elFoto.src = foto;
    }

    /* Outras telas (ex.: perfil, ao salvar) avisam quando nome/foto mudam */
    function atualizarUsuario(novos) {
        if (novos.nome !== undefined) guardar('NOME_USUARIO', novos.nome);
        if (novos.foto !== undefined) guardar('FOTO_USUARIO', novos.foto);
        aplicar();
    }

    async function buscarUsuario() {
        try {
            var resposta = await fetch('/funcionarios/perfil/' + ID);
            if (!resposta.ok) throw new Error('Falha ao buscar o usuário');
            var p = await resposta.json();
            atualizarUsuario({ nome: p.nome, foto: p.foto });
        } catch (erro) {
            console.error(erro);
            aplicar(); /* mantém o que já estava guardado */
        }
    }

    function iniciarMenu() {
        var sidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
        if (!sidebar) return;

        sidebar.addEventListener('click', function () {
            sidebar.classList.add('expandida');
        });

        document.addEventListener('click', function (evento) {
            if (!sidebar.contains(evento.target)) sidebar.classList.remove('expandida');
        });

        document.addEventListener('keydown', function (evento) {
            if (evento.key === 'Escape') sidebar.classList.remove('expandida');
        });
    }

    /* Log: avisa o servidor qual página o usuário abriu */
    function registrarAcesso() {
        var pagina = window.location.pathname.split('/').pop().replace('.html', '');
        fetch('/logs/pagina', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: ID,
                nome: sessionStorage.NOME_USUARIO,
                email: sessionStorage.EMAIL_USUARIO,
                fkCargo: sessionStorage.ID_CARGO,
                pagina: pagina
            })
        }).catch(function () { });
    }

    /* Log de ações: toda chamada à API do site vira um log, com o usuário */
    var fetchOriginal = window.fetch.bind(window);

    // [método, caminho, descrição, (true = conta excluída: não manda o id)]
    var ROTULOS = [
        ['POST', /^\/cadastroFuncionario\/cadastrar/, 'Cadastrou um funcionário'],
        ['PUT', /^\/cadastroFuncionario\/atualizar/, 'Atualizou um funcionário'],
        ['DELETE', /^\/cadastroFuncionario\/excluir/, 'Excluiu um funcionário'],
        ['POST', /^\/feats\/recomendar/, 'Gerou recomendação de feat'],
        ['POST', /^\/feats\/?$/, 'Cadastrou um feat'],
        ['PUT', /^\/feats\//, 'Atualizou um feat'],
        ['DELETE', /^\/feats\//, 'Excluiu um feat'],
        ['POST', /^\/metricas\/?$/, 'Criou uma métrica'],
        ['PUT', /^\/metricas\//, 'Atualizou uma métrica'],
        ['DELETE', /^\/metricas\//, 'Excluiu uma métrica'],
        ['GET', /^\/metricas\/\d+\/dashboard/, 'Abriu o dashboard de uma métrica'],
        ['PUT', /^\/funcionarios\/perfil\/\d+\/nome/, 'Alterou o nome do perfil'],
        ['PUT', /^\/funcionarios\/perfil\/\d+\/senha/, 'Alterou a senha'],
        ['PUT', /^\/funcionarios\/perfil\/\d+\/foto/, 'Alterou a foto do perfil'],
        ['DELETE', /^\/funcionarios\/perfil\/\d+$/, 'Excluiu a própria conta', true],
        ['POST', /^\/notificacao\/salvarNotificacao/, 'Salvou as configurações de notificação'],
        ['DELETE', /^\/notificacao\/excluirTema/, 'Excluiu um tema de notificação'],
        ['GET', /^\/musicas\/pesquisarMusica/, 'Pesquisou uma música'],
        ['GET', /^\/artistas\/\d+/, 'Abriu o detalhe de um artista']
    ];

    // Não logar: o próprio log, login/cadastro (o servidor já loga) e a contagem do formulário
    var IGNORAR = [/^\/logs\//, /^\/usuarios\//, /^\/metricas\/contagem/];

    function registrarAcao(metodo, caminho, status) {
        for (var i = 0; i < IGNORAR.length; i++) {
            if (IGNORAR[i].test(caminho)) return;
        }

        var rotulo = null, semId = false;
        for (var j = 0; j < ROTULOS.length; j++) {
            if (ROTULOS[j][0] === metodo && ROTULOS[j][1].test(caminho)) {
                rotulo = ROTULOS[j][2];
                semId = ROTULOS[j][3] === true;
                break;
            }
        }

        // GET que não está na lista é só carregamento de dados: não loga
        if (!rotulo && metodo === 'GET') return;
        rotulo = rotulo || 'Ação';

        var ok = status >= 200 && status < 400;
        var mensagem = rotulo + (ok ? '' : ' (falhou, status ' + status + ')') + ' - ' + metodo + ' ' + caminho;
        if (semId) mensagem += ' - ' + sessionStorage.NOME_USUARIO + ' (' + sessionStorage.EMAIL_USUARIO + ')';

        fetchOriginal('/logs/acao', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: semId ? '' : ID,
                nome: sessionStorage.NOME_USUARIO,
                email: sessionStorage.EMAIL_USUARIO,
                fkCargo: sessionStorage.ID_CARGO,
                pagina: window.location.pathname.split('/').pop().replace('.html', ''),
                nivel: ok ? 'INFO' : 'WARN',
                mensagem: mensagem
            })
        }).catch(function () { });
    }

    window.fetch = function (entrada, opcoes) {
        var promessa = fetchOriginal.apply(window, arguments);
        try {
            var url = new URL(typeof entrada === 'string' ? entrada : entrada.url, window.location.origin);
            var metodo = ((opcoes && opcoes.method) || (entrada && entrada.method) || 'GET').toUpperCase();
            if (url.origin === window.location.origin) {
                promessa.then(
                    function (resposta) { registrarAcao(metodo, url.pathname, resposta.status); },
                    function () { registrarAcao(metodo, url.pathname, 0); }
                );
            }
        } catch (e) { }
        return promessa;
    };

    window.Sidebar = { atualizarUsuario: atualizarUsuario };

    document.addEventListener('DOMContentLoaded', function () {
        iniciarMenu();
        aplicar();
        buscarUsuario();
        registrarAcesso();
    });
})();

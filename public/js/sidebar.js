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

    window.Sidebar = { atualizarUsuario: atualizarUsuario };

    document.addEventListener('DOMContentLoaded', function () {
        iniciarMenu();
        aplicar();
        buscarUsuario();
    });
})();

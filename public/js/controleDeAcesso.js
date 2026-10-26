function validarAcesso() {
    var cargo = sessionStorage.CARGO_USUARIO;

    if (cargo == 'responsável') {
        window.location = "../dashboardGravadora.html";
        // document.getElementById('dashboard-produtor').style.display = "none";
        // document.getElementById('dashboard-marketing').style.display = "none";
        document.getElementById('recomendacao-feat').style.display = "none";
        document.getElementById('lista-musicas').style.display = "none";
        document.getElementById('metricas').style.display = "none";

    } else if (cargo == 'marketing') {
        window.location = "../dashboardMarketing.html";
        // document.getElementById('dashboard-gravadora').style.display = "none";
        // document.getElementById('dashboard-produtor').style.display = "none";
        document.getElementById('recomendacao-feat').style.display = "none";
        document.getElementById('painel-de-controle').style.display = "none";

    } else if (cargo == 'produtor') {
        window.location = "../dashboardProdutor.html";
        // document.getElementById('dashboard-gravadora').style.display = "none";
        // document.getElementById('dashboard-produtor').style.display = "none";
        document.getElementById('recomendacao-feat').style.display = "none";
        document.getElementById('painel-de-controle').style.display = "none";
    }
}

function limparSessao() {
    sessionStorage.clear();
    window.location = "../login.html";
}
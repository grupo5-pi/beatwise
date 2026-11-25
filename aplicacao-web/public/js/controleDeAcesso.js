function validarAcesso() {
    var cargo = sessionStorage.ID_CARGO;
        // ('Admin'),
        // ('Empresa'), 2 
        // ('Produtor'), 3
        // ('Marketing'); 4


    if (cargo == 2) {
        // document.getElementById('dashboard-gravadora').style.display = "none";
        document.getElementById('dashboard-marketing').style.display = "none";
        document.getElementById('dashboard-produtor').style.display = "none";
        document.getElementById('recomendacao').style.display = "none";
        // document.getElementById('funcionarios').style.display = "none";

    } else if (cargo == 4) {
        document.getElementById('dashboard-gravadora').style.display = "none";
        // document.getElementById('dashboard-marketing').style.display = "none";
        document.getElementById('dashboard-produtor').style.display = "none";
        // document.getElementById('recomendacao').style.display = "none";
        document.getElementById('funcionarios').style.display = "none";

    } else if (cargo == 3) {
        document.getElementById('dashboard-gravadora').style.display = "none";
        document.getElementById('dashboard-marketing').style.display = "none";
        // document.getElementById('dashboard-produtor').style.display = "none";
        // document.getElementById('recomendacao').style.display = "none";
        document.getElementById('funcionarios').style.display = "none";
    }
}
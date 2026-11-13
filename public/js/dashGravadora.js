function retornarDiferencaClipe() {
    return fetch("/dashGravadora/obterDiferencaClipe")
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                console.log("Houve um erro ao buscar os dados das músicas com e sem clipe");
                throw new Error("Houve um erro ao buscar os dados das músicas com e sem clipe");
            }
        }).catch(function (erro) {
            console.log(erro);
            return [];
        });
}
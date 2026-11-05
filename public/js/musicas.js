function retornarMusicas() {
    return fetch("./dados/musicas.json", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (resposta) {

        if (resposta.ok) {
            console.log(resposta);
            return resposta.json();

        } else {
            console.log("Houve um erro ao tentar pegar as músicas");
            throw new Error("Erro ao buscar as músicas");

        }
    })
    .catch(function (erro) {
        console.log(erro);
        return [];
    });
}
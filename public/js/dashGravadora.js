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

function retornarDiferencaTipoAlbum() {
    return fetch("/dashGravadora/obterDiferencaTipoAlbum")
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                console.log("Houve um erro ao buscar os dados de comparação entre tipos de álbuns");
                throw new Error("Houve um erro ao buscar os dados de comparação entre tipos de álbuns");
            }
        }).catch(function (erro) {
            console.log(erro);
            return [];
        });
}

function retornarGeneroEngajamento() {
    return fetch("/dashGravadora/obterGeneroEngajamento")
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                console.log("Houve um erro ao buscar os dados de diferença entre os generos");
                throw new Error("Houve um erro ao buscar os dados de diferença entre os generos");
            }
        }).catch(function (erro) {
            console.log(erro);
            return [];
        });
}
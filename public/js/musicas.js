function retornarAlbum() {
    return fetch("/musicas/obterAlbum")
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                console.log("Houve um erro ao obter os álbuns");
                throw new Error("Erro ao buscar os álbuns");
            }
        }).catch(function (erro) {
            console.log(erro);
            return [];
        });
}

function retornarArtista() {
    return fetch("/musicas/obterArtista")
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                console.log("Houve um erro ao obter os artistas");
                throw new Error("Erro ao buscar os artistas");
            }
        }).catch(function (erro) {
            console.log(erro);
            return [];
        });
}

function retornarMusica(limite) {
    return fetch(`/musicas/obterMusica?limite=${limite}`)
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                console.log("Houve um erro ao obter as músicas");
                throw new Error("Erro ao buscar as músicas");
            }
        }).catch(function (erro) {
            console.log(erro);
            return [];
        });
}

function retornarMusicaArtista() {
    return fetch("/musicas/obterMusicaArtista")
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                console.log("Houve um erro ao obter as relações entre músicas e artistas");
                throw new Error("Erro ao buscar as relações entre músicas e artistas");
            }
        }).catch(function (erro) {
            console.log(erro);
            return [];
        });
}

function retornarSpotify(limite) {
    return fetch(`/musicas/obterSpotify?limite=${limite}`)
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                console.log("Houve um erro ao obter os dados do Spotify");
                throw new Error("Erro ao buscar os dados do Spotify");
            }
        }).catch(function (erro) {
            console.log(erro);
            return [];
        });
}

function retornarYoutube(limite) {
    return fetch(`/musicas/obterYoutube?limite=${limite}`)
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                console.log("Houve um erro ao obter os dados do YouTube");
                throw new Error("Erro ao buscar os dados do YouTube");
            }
        }).catch(function (erro) {
            console.log(erro);
            return [];
        });
}

function retornarTotalMusicas() {
    return fetch("/musicas/obterTotalMusicas")
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                console.log("Houve um erro ao obter a quantidade de músicas");
                throw new Error("Houve um erro ao obter a quantidade de músicas");
            }
        }).catch(function (erro) {
            console.log(erro);
            return [];
        });
}

// Pesquisa
function retornarPesquisaMusica(palavra, limite) {
    return fetch(`/musicas/pesquisarMusica?palavra=${palavra}&limite=${limite}`)
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                console.log("Houve um erro ao pesquisar as músicas");
                throw new Error("Houve um erro ao pesquisar as músicas");
            }
        }).catch(function (erro) {
            console.log(erro);
            return [];
        });
}

function retornarPesquisaYoutube(palavra, limite) {
    return fetch(`/musicas/pesquisarYoutube?palavra=${palavra}&limite=${limite}`)
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                console.log("Houve um erro ao pesquisar as músicas");
                throw new Error("Houve um erro ao pesquisar as músicas");
            }
        }).catch(function (erro) {
            console.log(erro);
            return [];
        });
}

function retornarPesquisaSpotify(palavra, limite) {
    return fetch(`/musicas/pesquisarSpotify?palavra=${palavra}&limite=${limite}`)
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                console.log("Houve um erro ao pesquisar as músicas");
                throw new Error("Houve um erro ao pesquisar as músicas");
            }
        }).catch(function (erro) {
            console.log(erro);
            return [];
        });
}

function retornarTotalPesquisaMusica(palavra) {
    return fetch(`/musicas/contarPesquisaMusica?palavra=${palavra}`)
        .then(function (resposta) {
            if (resposta.ok) {
                return resposta.json();
            } else {
                console.log("Houve um erro ao contar as pesquisas as músicas");
                throw new Error("Houve um erro ao contar as pesquisas as músicas");
            }
        }).catch(function (erro) {
            console.log(erro);
            return [];
        });
}
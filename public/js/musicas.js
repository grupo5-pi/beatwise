function retornarAlbum() {
    return fetch("/musicas/obterAlbum", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (resposta) {
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
    return fetch("/musicas/obterArtista", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (resposta) {
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

function retornarMusica() {
    return fetch("/musicas/obterMusica", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (resposta) {
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
    return fetch("/musicas/obterMusicaArtista", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (resposta) {
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

function retornarSpotify() {
    return fetch("/musicas/obterSpotify", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (resposta) {
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

function retornarYoutube() {
    return fetch("/musicas/obterYoutube", {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function (resposta) {
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
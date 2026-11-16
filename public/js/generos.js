function carregarGeneros(idSelect) {
    return fetch("/feats/generos").then(function (resposta) {
        if (!resposta.ok) return;
        return resposta.json().then(function (lista) {
            let select = document.getElementById(idSelect);
            select.innerHTML = '<option value="">Qualquer gênero</option>';
            for (let i = 0; i < lista.length; i++) {
                select.innerHTML += `<option value="${lista[i]}">${lista[i]}</option>`;
            }
        });
    }).catch(function (erro) {
        console.log(erro);
    });
}
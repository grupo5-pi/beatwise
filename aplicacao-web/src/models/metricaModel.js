
var database = require("../database/config");
var CARACTERISTICAS = require("./caracteristicas").CARACTERISTICAS;

var CAMPOS = `
    md.id, md.nome, md.periodo, md.anoInicio, md.anoFim,
    (SELECT GROUP_CONCAT(g.nome ORDER BY g.nome SEPARATOR ',')
       FROM metricaDashGenero mdg
       JOIN genero g ON g.id = mdg.fkGenero
      WHERE mdg.fkMetricaDash = md.id) AS generos,
    md.caracteristicas, md.totalMusicas, md.dataCriacao
`;

var ORDENACOES = {
    recentes: "md.dataCriacao DESC, md.id DESC",
    antigas: "md.dataCriacao ASC, md.id ASC",
    nome: "md.nome ASC",
    musicas: "md.totalMusicas DESC"
};

function listar(idFuncionario, busca, ordem) {
    var ordenarPor = ORDENACOES[ordem] || ORDENACOES.recentes;

    var instrucaoSql = `
        SELECT ${CAMPOS}
        FROM metricaDash md
        WHERE md.fkFuncionario = ? AND md.nome LIKE ?
        ORDER BY ${ordenarPor};
    `;

    return database.executar(instrucaoSql, [
        idFuncionario,
        "%" + (busca || "") + "%"
    ]);
}

function buscarPorId(id, idFuncionario) {
    var instrucaoSql = `
        SELECT ${CAMPOS}
        FROM metricaDash md
        WHERE md.id = ? AND md.fkFuncionario = ?;
    `;

    return database.executar(instrucaoSql, [id, idFuncionario]);
}

function cadastrar(a, idFuncionario) {
    var instrucaoSql = `
        INSERT INTO metricaDash
            (nome, periodo, anoInicio, anoFim, caracteristicas, totalMusicas, fkFuncionario)
        VALUES (?, ?, ?, ?, ?, ?, ?);
    `;

    var consultas = [{
        instrucao: instrucaoSql,
        valores: [
            a.nome,
            a.periodo,
            a.anoInicio,
            a.anoFim,
            JSON.stringify(a.caracteristicas),
            a.totalMusicas,
            idFuncionario
        ]
    }];

    var consultaGeneros = inserirGeneros(a.generos, null);
    if (consultaGeneros) consultas.push(consultaGeneros);

    return database.executarTransacao(consultas).then(function (resultados) {
        return resultados[0];
    });
}

function atualizar(id, a, idFuncionario) {
    var instrucaoSql = `
        UPDATE metricaDash SET
            nome = ?,
            periodo = ?,
            anoInicio = ?,
            anoFim = ?,
            caracteristicas = ?,
            totalMusicas = ?
        WHERE id = ? AND fkFuncionario = ?;
    `;

    var valores = [
        a.nome,
        a.periodo,
        a.anoInicio,
        a.anoFim,
        JSON.stringify(a.caracteristicas),
        a.totalMusicas,
        id,
        idFuncionario
    ];

    var consultas = [{
        instrucao: "SELECT id FROM metricaDash WHERE id = ? AND fkFuncionario = ? FOR UPDATE;",
        valores: [id, idFuncionario],
        pararSe: function (linhas) {
            return linhas.length === 0;
        }
    }, {
        instrucao: instrucaoSql,
        valores: valores
    }, {
        instrucao: "DELETE FROM metricaDashGenero WHERE fkMetricaDash = ?;",
        valores: [id]
    }];

    var consultaGeneros = inserirGeneros(a.generos, id);
    if (consultaGeneros) consultas.push(consultaGeneros);

    return database.executarTransacao(consultas).then(function (resultados) {
        if (resultados[0].length === 0) return { affectedRows: 0 };
        return Object.assign({}, resultados[1], { affectedRows: 1 });
    });
}

function excluir(id, idFuncionario) {
    var instrucaoSql = `
        DELETE FROM metricaDash
        WHERE id = ? AND fkFuncionario = ?;
    `;

    return database.executar(instrucaoSql, [id, idFuncionario]);
}

function listarGeneros() {
    var instrucaoSql = `
        SELECT
            g.id,
            g.nome AS genero,
            COUNT(m.id) AS total
        FROM genero g
        LEFT JOIN musicaBD m ON m.fkGenero = g.id
        WHERE g.nome <> 'Outros'
        GROUP BY g.id, g.nome
        ORDER BY total DESC, g.nome ASC;
    `;

    return database.executar(instrucaoSql);
}

function inserirGeneros(generos, idMetrica) {
    if (!generos || generos.length === 0) return null;

    var valores = [];
    var referencias = generos.map(function (genero) {
        if (idMetrica === null) {
            valores.push(genero);
            return "(LAST_INSERT_ID(), (SELECT id FROM genero WHERE nome = ?))";
        }

        valores.push(idMetrica, genero);
        return "(?, (SELECT id FROM genero WHERE nome = ?))";
    });

    return {
        instrucao: `
            INSERT INTO metricaDashGenero (fkMetricaDash, fkGenero)
            VALUES ${referencias.join(", ")};
        `,
        valores: valores
    };
}

function montarFiltro(filtros) {
    var condicoes = [];
    var valores = [];

    var faixas = filtros.caracteristicas || {};

    for (var coluna in faixas) {
        if (!CARACTERISTICAS[coluna]) continue;

        condicoes.push("s." + coluna + " BETWEEN ? AND ?");
        valores.push(faixas[coluna][0], faixas[coluna][1]);
    }

    if (filtros.generos && filtros.generos.length) {
        condicoes.push("g.nome IN (?)");
        valores.push(filtros.generos);
    }

    if (filtros.anoInicio && filtros.anoFim) {
        condicoes.push("m.anoLancamento BETWEEN ? AND ?");
        valores.push(filtros.anoInicio, filtros.anoFim);
    }

    return {
        where: condicoes.length ? "WHERE " + condicoes.join(" AND ") : "",
        valores: valores
    };
}

function contarMusicas(filtros) {
    var filtro = montarFiltro(filtros);

    var instrucaoSql = `
        SELECT COUNT(DISTINCT m.id) AS total
        FROM spotifyBD s
        JOIN musicaBD m ON m.id = s.fkMusicaBD
        LEFT JOIN genero g ON g.id = m.fkGenero
        ${filtro.where};
    `;

    return database.executar(instrucaoSql, filtro.valores);
}

function listarMusicasFiltradas(filtros) {
    var filtro = montarFiltro(filtros);

    var instrucaoSql = `
        SELECT
            m.id,
            m.nome AS titulo,
            g.nome AS genero,
            m.anoLancamento,

            (SELECT GROUP_CONCAT(a.nome SEPARATOR ', ')
               FROM musicaArtistaBD ma
               JOIN artistaBD a ON a.id = ma.fkArtistaBD
              WHERE ma.fkMusicaBD = m.id) AS artista,

            s.dancabilidade,
            s.energia,
            s.tonalidade,
            s.acustica,
            s.vivicidade,
            s.valenciaPositividade,
            s.tempoBPM,

            CAST(s.duracaoMs AS DECIMAL(20)) AS duracaoMs,
            CAST(s.fluxo AS DECIMAL(20)) AS streams,

            (SELECT MAX(CAST(y.visitas AS DECIMAL(20)))
               FROM youtubeBD y
              WHERE y.fkMusicaBD = m.id) AS views

        FROM spotifyBD s
        JOIN musicaBD m ON m.id = s.fkMusicaBD
        LEFT JOIN genero g ON g.id = m.fkGenero

        ${filtro.where}

        ORDER BY views DESC;
    `;

    return database.executar(instrucaoSql, filtro.valores);
}

module.exports = {
    listar,
    buscarPorId,
    cadastrar,
    atualizar,
    excluir,
    listarGeneros,
    contarMusicas,
    listarMusicasFiltradas
};
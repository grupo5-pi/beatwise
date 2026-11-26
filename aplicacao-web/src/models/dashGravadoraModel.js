
var database = require("../database/config");


function obterDiferencaClipe() {
    var instrucaoSql = `
        SELECT
            (
                SELECT SUM(curtidas) / NULLIF(SUM(visitas), 0) * 100
                FROM youtubeBD
                WHERE videoOficial = 1
                    AND visitas > 0
            ) AS comClipe,

            (
                SELECT SUM(curtidas) / NULLIF(SUM(visitas), 0) * 100
                FROM youtubeBD
                WHERE videoOficial = 0
                    AND visitas > 0
            ) AS semClipe,

            ABS(
                (
                    SELECT SUM(curtidas) / NULLIF(SUM(visitas), 0) * 100
                    FROM youtubeBD
                    WHERE videoOficial = 1
                        AND visitas > 0
                )
                -
                (
                    SELECT SUM(curtidas) / NULLIF(SUM(visitas), 0) * 100
                    FROM youtubeBD
                    WHERE videoOficial = 0
                        AND visitas > 0
                )
            ) AS porcentagem;
    `;

    return database.executar(instrucaoSql);
}


function obterMelhorGenero() {
    var instrucaoSql = `
        SELECT
            g.nome AS genero,
            AVG(s.fluxo) AS mediaGenero,
            (SELECT AVG(fluxo) FROM spotifyBD) AS mediaGeral,
            (
                (
                    AVG(s.fluxo) -
                    (SELECT AVG(fluxo) FROM spotifyBD)
                )
                /
                NULLIF((SELECT AVG(fluxo) FROM spotifyBD), 0)
            ) * 100 AS porcentagem
        FROM musicaBD m
        JOIN spotifyBD s
            ON s.fkMusicaBD = m.id
        JOIN genero g
            ON g.id = m.fkGenero
        GROUP BY g.id, g.nome
        ORDER BY mediaGenero DESC
        LIMIT 1;
    `;

    return database.executar(instrucaoSql);
}


function obterMelhorPlataforma() {
    var instrucaoSql = `
        SELECT
            spotify,
            youtube,
            CASE
                WHEN youtube > spotify THEN 'YouTube'
                ELSE 'Spotify'
            END AS plataforma,
            (
                ABS(youtube - spotify)
                / NULLIF(LEAST(youtube, spotify), 0)
            ) * 100 AS porcentagem
        FROM (
            SELECT
                (
                    SELECT SUM(fluxo)
                    FROM spotifyBD
                    WHERE fkMusicaBD IN (
                        SELECT fkMusicaBD FROM youtubeBD
                    )
                ) AS spotify,

                (
                    SELECT SUM(visitas)
                    FROM youtubeBD
                    WHERE fkMusicaBD IN (
                        SELECT fkMusicaBD FROM spotifyBD
                    )
                ) AS youtube
        ) AS totais;
    `;

    return database.executar(instrucaoSql);
}


function obterFeatSolo() {
    var instrucaoSql = `
        SELECT
            engajamentoFeat,
            engajamentoSolo,
            CASE
                WHEN engajamentoFeat > engajamentoSolo THEN 'Feat'
                ELSE 'Solo'
            END AS vencedor,
            (
                ABS(engajamentoFeat - engajamentoSolo)
                / NULLIF(LEAST(engajamentoFeat, engajamentoSolo), 0)
            ) * 100 AS porcentagem
        FROM (
            SELECT
                SUM(
                    CASE
                        WHEN qtd.artistas > 1
                        THEN COALESCE(y.curtidas, 0) +
                             COALESCE(y.comentarios, 0)
                    END
                )
                /
                NULLIF(
                    SUM(
                        CASE
                            WHEN qtd.artistas > 1 THEN y.visitas
                        END
                    ), 0
                ) * 100 AS engajamentoFeat,

                SUM(
                    CASE
                        WHEN qtd.artistas = 1
                        THEN COALESCE(y.curtidas, 0) +
                             COALESCE(y.comentarios, 0)
                    END
                )
                /
                NULLIF(
                    SUM(
                        CASE
                            WHEN qtd.artistas = 1 THEN y.visitas
                        END
                    ), 0
                ) * 100 AS engajamentoSolo

            FROM youtubeBD y
            JOIN (
                SELECT
                    fkMusicaBD,
                    COUNT(*) AS artistas
                FROM musicaArtistaBD
                GROUP BY fkMusicaBD
            ) AS qtd
                ON qtd.fkMusicaBD = y.fkMusicaBD
        ) AS engajamento;
    `;

    return database.executar(instrucaoSql);
}


function obterTipoAlbum() {
    var instrucaoSql = `
        SELECT
            categoria,
            SUM(fluxo) AS total,
            ROUND(
                SUM(fluxo) * 100 /
                NULLIF(SUM(SUM(fluxo)) OVER (), 0),
                1
            ) AS porcentagem
        FROM (
            SELECT
                CONCAT(
                    CASE
                        WHEN art.qtd > 1 THEN 'Feat'
                        ELSE 'Solo'
                    END,
                    ' - ',
                    CASE
                        WHEN alb.qtd = 1 THEN 'Single'
                        ELSE 'Álbum'
                    END
                ) AS categoria,
                s.fluxo
            FROM spotifyBD s
            JOIN musicaBD m
                ON m.id = s.fkMusicaBD
            JOIN (
                SELECT
                    fkMusicaBD,
                    COUNT(*) AS qtd
                FROM musicaArtistaBD
                GROUP BY fkMusicaBD
            ) AS art
                ON art.fkMusicaBD = m.id
            JOIN (
                SELECT
                    fkAlbumBD,
                    COUNT(*) AS qtd
                FROM musicaBD
                GROUP BY fkAlbumBD
            ) AS alb
                ON alb.fkAlbumBD = m.fkAlbumBD
        ) AS base
        GROUP BY categoria;
    `;

    return database.executar(instrucaoSql);
}


function obterDiferencaTipoAlbum() {
    var instrucaoSql = `
        SELECT
            CASE
                WHEN spotify.tipoAlbum = 'single' THEN 'single'
                ELSE 'Álbum'
            END AS categoria,
            SUM(spotify.fluxo) AS spotify,
            SUM(youtube.visitas) AS youtube
        FROM spotifyBD spotify
        JOIN youtubeBD youtube
            ON youtube.fkMusicaBD = spotify.fkMusicaBD
        GROUP BY categoria;
    `;

    return database.executar(instrucaoSql);
}


function obterGeneroEngajamento() {
    var instrucaoSql = `
        SELECT
            g.nome AS genero,
            ROUND(
                (
                    SUM(y.curtidas) + SUM(y.comentarios)
                )
                / NULLIF(SUM(y.visitas), 0) * 100,
                2
            ) AS engajamento
        FROM musicaBD m
        JOIN genero g
            ON g.id = m.fkGenero
        JOIN youtubeBD y
            ON y.fkMusicaBD = m.id
        WHERE g.nome IS NOT NULL
            AND g.nome <> 'Outros'
        GROUP BY g.id, g.nome
        HAVING SUM(y.visitas) > 0
        ORDER BY engajamento DESC
        LIMIT 8;
    `;

    return database.executar(instrucaoSql);
}


module.exports = {
    obterDiferencaClipe,
    obterMelhorGenero,
    obterMelhorPlataforma,
    obterFeatSolo,
    obterTipoAlbum,
    obterDiferencaTipoAlbum,
    obterGeneroEngajamento
};

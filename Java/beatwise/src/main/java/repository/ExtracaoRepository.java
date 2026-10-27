package repository;

import logs.LogExtracaoExcel;
import logs.LogSite;
import org.springframework.jdbc.core.JdbcTemplate;

public class ExtracaoRepository {
    private final JdbcTemplate jdbcTemplate;

    public ExtracaoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void saveAlbum(String nome) {
        jdbcTemplate.update(
                "INSERT INTO albumBD (nome) VALUES (?);", nome);
    }

    public void saveArtista(String nome) {
        jdbcTemplate.update(
                "INSERT INTO artistaBD (nome) VALUES (?);", nome);
    }

    public void saveMusica(String nome, Integer album) {
        jdbcTemplate.update(
                "INSERT INTO musicaBD (nome, fkAlbumBD) VALUES (?, ?);", nome, album);
    }

    public void saveMusicaArtista(Integer artista, Integer musica) {
        jdbcTemplate.update(
                "INSERT INTO musicaArtistaBD (fkArtistaBD, fkMusicaBD) VALUES (?, ?);", artista, musica);
    }

    public void saveSpotify(
            Integer musica,
            String url,
            Double dancabilidade,
            Double energia,
            Double tonalidade,
            Double intensidadeSonora,
            Double acustica,
            Double instrumentalidade,
            Double vivicidade,
            Double valenciaPositividade,
            Double tempoBPM,
            Double duracaoMs,
            String fluxo) {

        jdbcTemplate.update(
                "INSERT INTO spotifyBD (fkMusicaBD, url, dancabilidade, energia, tonalidade, " +
                        "intensidadeSonora, acustica, instrumentalidade, vivicidade, " +
                        "valenciaPositividade, tempoBPM, duracaoMs, fluxo) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
                musica, url, dancabilidade, energia, tonalidade, intensidadeSonora,
                acustica, instrumentalidade, vivicidade, valenciaPositividade,
                tempoBPM, duracaoMs, fluxo);
    }

    public void saveYoutube(
            Integer musica,
            String url,
            String titulo,
            String canal,
            Double visitas,
            Double curtidas,
            Double comentarios,
            String descricao,
            Boolean licenciado,
            Boolean videoOficial) {

        jdbcTemplate.update(
                "INSERT INTO youtubeBD (fkMusicaBD, url, titulo, canal, visitas, " +
                        "curtidas, comentarios, descricao, licenciado, videoOficial) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
                musica, url, titulo, canal, visitas, curtidas, comentarios,
                descricao, licenciado, videoOficial);
    }
}

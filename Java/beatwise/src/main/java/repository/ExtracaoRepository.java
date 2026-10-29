package repository;

import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class ExtracaoRepository {
    private final JdbcTemplate jdbcTemplate;

    public ExtracaoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    // Inserts
    public void saveAlbum(String nome) {
        if (selectAlbum(nome) == null) {
            jdbcTemplate.update(
                    "INSERT INTO albumBD (nome) VALUES (?);", nome);
        }
    }

    public void saveArtista(String nome) {
        if (selectArtista(nome) == null) {
            jdbcTemplate.update(
                    "INSERT INTO artistaBD (nome) VALUES (?);", nome);
        }
    }

    public void saveMusica(String nome, Integer album) {
        jdbcTemplate.update(
                "INSERT INTO musicaBD (nome, fkAlbumBD) VALUES (?, ?);", nome, album);
    }

    public void saveMusicaArtista(Integer artista, Integer musica) {
        jdbcTemplate.update(
                "INSERT  IGNORE INTO musicaArtistaBD (fkArtistaBD, fkMusicaBD) VALUES (?, ?);", artista, musica);
    }

    public void saveSpotify(
            Integer musica,
            String url,
            Double dancabilidade,
            Double energia,
            Integer tonalidade,
            Double intensidadeSonora,
            Double acustica,
            Double instrumentalidade,
            Double vivicidade,
            Double valenciaPositividade,
            Double tempoBPM,
            Long duracaoMs,
            Long stream) {

        jdbcTemplate.update(
                "INSERT INTO spotifyBD (fkMusicaBD, url, dancabilidade, energia, tonalidade, " +
                        "intensidadeSonora, acustica, instrumentalidade, vivicidade, " +
                        "valenciaPositividade, tempoBPM, duracaoMs, fluxo) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
                musica, url, dancabilidade, energia, tonalidade, intensidadeSonora,
                acustica, instrumentalidade, vivicidade, valenciaPositividade,
                tempoBPM, duracaoMs, stream);
    }

    public void saveYoutube(
            Integer musica,
            String url,
            String titulo,
            String canal,
            Long visitas,
            Integer curtidas,
            Integer comentarios,
            String descricao,
            Boolean licenciado,
            Boolean videoOficial) {

        jdbcTemplate.update(
                "INSERT INTO youtubeBD (fkMusicaBD, url, titulo, canal, visitas, " +
                        "curtidas, comentarios, descricao, licenciado, videoOficial) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
                musica, url, titulo, canal, visitas, curtidas, comentarios,
                "Não usamos a descrição", licenciado, videoOficial);
    }


    // SELECTS
    public Integer selectMusica(String nome, Integer album) {
        List<Integer> resultados = jdbcTemplate.query(
                "SELECT id FROM musicaBD WHERE nome = ? AND fkAlbumBD = ?",
                (rs, rowNum) -> rs.getInt("id"),
                nome, album
        );

        return resultados.isEmpty() ? null : resultados.getFirst();
    }

    public Integer selectAlbum(String nome) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT id FROM albumBD where ? = nome", Integer.class, nome);

        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }

    public Integer selectArtista(String nome) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT id FROM artistaBD where ? = nome", Integer.class, nome);

        } catch (EmptyResultDataAccessException e) {
            return null;
        }
    }
}

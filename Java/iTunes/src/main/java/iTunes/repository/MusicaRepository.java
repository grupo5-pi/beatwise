package iTunes.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import iTunes.dto.MusicaBancoDto;


import java.util.List;

public class MusicaRepository {
    private final JdbcTemplate jdbcTemplate;

    public MusicaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<MusicaBancoDto> selectMusicas(Integer limite) {
        return jdbcTemplate.query(
                "SELECT musicaBD.id, musicaBD.nome, MIN(artistaBD.nome) AS artista " +
                        "FROM musicaBD " +
                        "JOIN musicaArtistaBD ON musicaArtistaBD.fkMusicaBD = musicaBD.id " +
                        "JOIN artistaBD ON artistaBD.id = musicaArtistaBD.fkArtistaBD " +
                        "GROUP BY musicaBD.id, musicaBD.nome " +
                        "ORDER BY musicaBD.id LIMIT ?",
                (rs, rowNum) -> new MusicaBancoDto(
                        rs.getInt("id"),
                        rs.getString("artista"),
                        rs.getString("nome")),
                limite
        );
    }

    public List<MusicaBancoDto> selectMusicasPendentes(Integer limite) {
        return jdbcTemplate.query(
                "SELECT musicaBD.id, musicaBD.nome, MIN(artistaBD.nome) AS artista " +
                        "FROM musicaBD " +
                        "JOIN musicaArtistaBD ON musicaArtistaBD.fkMusicaBD = musicaBD.id " +
                        "JOIN artistaBD ON artistaBD.id = musicaArtistaBD.fkArtistaBD " +
                        "WHERE musicaBD.statusItunes = 0 " +
                        "GROUP BY musicaBD.id, musicaBD.nome " +
                        "ORDER BY musicaBD.id LIMIT ?",
                (rs, rowNum) -> new MusicaBancoDto(
                        rs.getInt("id"),
                        rs.getString("artista"),
                        rs.getString("nome")),
                limite
        );
    }

    public void atualizarGenero(Integer id, String genero) {

        jdbcTemplate.update(
                """
                UPDATE musicaBD
                SET genero = ?,
                    statusItunes = 1
                WHERE id = ?
                """,
                genero,
                id
        );
    }

    public void marcarNaoEncontrada(Integer id) {

        jdbcTemplate.update(
                """
                UPDATE musicaBD
                SET statusItunes = 2
                WHERE id = ?
                """,
                id
        );
    }
}


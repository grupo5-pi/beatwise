package repository;

import logs.Log;
import logs.LogApachePoi;
import logs.LogSite;
import org.springframework.jdbc.core.JdbcTemplate;

public class LogRepository {
    private final JdbcTemplate jdbcTemplate;

    public LogRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void saveSite(LogSite log) {
        jdbcTemplate.update(
                "INSERT INTO logSite (data, nivel, mensagem, origem, fkUsuario) VALUES (?, ?, ?, ?, ?)", log.getDataLog(), log.getNivel(), log.getMensagem(), log.getOrigem(), log.getIdUsuario());
    }
    public void saveApache(LogApachePoi log) {
        jdbcTemplate.update(
                "INSERT INTO logApache (data, nivel, mensagem) VALUES (?, ?, ?)", log.getDataLog(), log.getNivel(), log.getMensagem());
    }

}

package repository;

import logs.Log;
import org.springframework.jdbc.core.JdbcTemplate;

public class LogRepository {
    private final JdbcTemplate jdbcTemplate;

    public LogRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void save(Log log) {
        jdbcTemplate.update(
                "INSERT INTO log (data, nivel, mensagem, origem) VALUES (?, ?, ?, ?)", log.getDataLog(), log.getNivel(), log.getMensagem(), log.getOrigem());
    }
}

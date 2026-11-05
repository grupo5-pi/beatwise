package repository;

import logs.LogExtracaoExcel;
import logs.LogSite;
import org.springframework.jdbc.core.JdbcTemplate;

public class LogRepository {
    private final JdbcTemplate jdbcTemplate;

    public LogRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void saveSite(LogSite log) {
        jdbcTemplate.update(
                "INSERT INTO log_site (alerta, data, descricao, pagina, fkFuncionario) VALUES (?, ?, ?, ?, ?)", log.getNivel(), log.getDataLog(), log.getMensagem(), log.getOrigem(), log.getIdUsuario());
    }
    public void saveApache(LogExtracaoExcel log) {
        jdbcTemplate.update(
                "INSERT INTO log_apache (alerta, data, descricao) VALUES (?, ?, ?)", log.getNivel(), log.getDataLog(), log.getMensagem());
    }

}

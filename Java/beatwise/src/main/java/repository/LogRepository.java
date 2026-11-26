package repository;

import logs.LogExtracaoExcel;
import logs.LogSite;
import logs.Usuario;
import org.springframework.jdbc.core.JdbcTemplate;

public class LogRepository {
    private final JdbcTemplate jdbcTemplate;

    public LogRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void saveSite(LogSite log) {
        Usuario u = log.getUsuario();

        jdbcTemplate.update(
                "INSERT INTO log_site (aviso, data, descricao, pagina, fkFuncionario, nomeUsuario, emailUsuario, cargoUsuario) " +
                        "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                log.getNivel(), log.getDataLog(), log.getMensagem(), log.getOrigem(),
                u != null ? u.getId() : null,
                u != null ? u.getNome() : null,
                u != null ? u.getEmail() : null,
                u != null ? u.getCargo() : null);
    }

    public void saveApache(LogExtracaoExcel log) {
        jdbcTemplate.update(
                "INSERT INTO log_apache (alerta, data, descricao) VALUES (?, ?, ?)",
                log.getNivel(), log.getDataLog(), log.getMensagem());
    }
}

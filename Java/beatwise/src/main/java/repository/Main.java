package repository;

import logs.Log;
import logs.LogExtracaoExcel;
import logs.LogSite;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

public class Main {
    public static void main(String[] args) {
        ConexaoBD conexao = new ConexaoBD();
        JdbcTemplate jdbcTemplate = conexao.getJdbcTemplate();
        LogRepository repository = new LogRepository(jdbcTemplate);

        Log log1 = new Log("WARNER", "Banco caiu");
        LogExtracaoExcel log2 = new LogExtracaoExcel("INFO", "Os dados foram lidos", repository);
        LogSite log3 = new LogSite("WARNER", "Login realizado", 1, "Login", repository);

        System.out.println(log1.exibirLog() + "\n");
        System.out.println(log2.exibirLog() + "\n");
        System.out.println(log3.exibirLog() + "\n");

        log2.registrarLog();
        log3.registrarLog();
    }
}

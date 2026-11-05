package repository;

import io.github.cdimascio.dotenv.Dotenv;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.jdbc.core.JdbcTemplate;

public class ConexaoBD {

    private final JdbcTemplate jdbcTemplate;
    private final BasicDataSource basicDataSource;

    Dotenv env = Dotenv.load();

    public ConexaoBD() {
        BasicDataSource basicDataSource = new BasicDataSource();
        basicDataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        basicDataSource.setUrl("jdbc:mysql://localhost:3306/beatwise");
        basicDataSource.setUsername(env.get("DB_USER"));
        basicDataSource.setPassword(env.get("DB_PASSWORD"));

        this.basicDataSource = basicDataSource;
        this.jdbcTemplate = new JdbcTemplate(basicDataSource);
    }

    public BasicDataSource getBasicDataSource() {
        return basicDataSource;
    }

    public JdbcTemplate getJdbcTemplate() {
        return jdbcTemplate;
    }
}

package repository;

import logs.LogSite;
import logs.Usuario;

public class Main {
    public static void main(String[] args) {
        LogRepository repository = new LogRepository(new ConexaoBD().getJdbcTemplate());

        // O id tem que existir na tabela funcionario (ex.: 1 = Administrador)
        Usuario usuario = new Usuario(1, "Administrador", "admin@beatwise.com", "Admin");

        new LogSite("INFO", "Acessou a página de cadastro", null, "cadastro", repository).registrarLog();
        new LogSite("INFO", "Cadastro realizado", usuario, "cadastro", repository).registrarLog();
        new LogSite("INFO", "Login realizado", usuario, "login", repository).registrarLog();
    }
}

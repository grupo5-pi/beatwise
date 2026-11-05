package com.beatwise.mail;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class ConexaoBanco {

    public static Connection abrir() throws SQLException {
        return DriverManager.getConnection(
                Env.exigir("DB_URL"),
                Env.exigir("DB_USER"),
                Env.obter("DB_PASSWORD", "")
        );
    }
}

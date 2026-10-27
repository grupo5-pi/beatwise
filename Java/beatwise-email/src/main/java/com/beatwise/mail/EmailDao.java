package com.beatwise.mail;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class EmailDao {

    private static final int MAXIMO_FALHAS = 5;

    public List<EmailPendente> buscarPendentes() throws SQLException {
        String sql = """
                SELECT t.id, t.tipo, t.codigo, t.expiracao,
                       f.nome, f.email, e.razaoSocial AS empresa
                FROM tokenAcesso t
                JOIN funcionario f ON f.id = t.fkFuncionario
                LEFT JOIN empresa e ON e.id = f.fkEmpresa
                WHERE t.statusEnviado = FALSE
                  AND t.usado = FALSE
                  AND t.falhasEnvio < ?
                  AND t.expiracao > NOW()
                ORDER BY t.id
                """;

        List<EmailPendente> pendentes = new ArrayList<>();

        try (Connection conexao = ConexaoBanco.abrir();
             PreparedStatement comando = conexao.prepareStatement(sql)) {

            comando.setInt(1, MAXIMO_FALHAS);

            try (ResultSet resultado = comando.executeQuery()) {
                while (resultado.next()) {
                    pendentes.add(new EmailPendente(
                            resultado.getInt("id"),
                            resultado.getString("tipo"),
                            resultado.getString("codigo"),
                            resultado.getTimestamp("expiracao").toLocalDateTime(),
                            resultado.getString("nome"),
                            resultado.getString("email"),
                            resultado.getString("empresa")
                    ));
                }
            }
        }

        return pendentes;
    }

    public void marcarComoEnviado(int id) throws SQLException {
        atualizar("UPDATE tokenAcesso SET statusEnviado = TRUE WHERE id = ?", id);
    }

    public void registrarFalha(int id) throws SQLException {
        atualizar("UPDATE tokenAcesso SET falhasEnvio = falhasEnvio + 1 WHERE id = ?", id);
    }

    private void atualizar(String sql, int id) throws SQLException {
        try (Connection conexao = ConexaoBanco.abrir();
             PreparedStatement comando = conexao.prepareStatement(sql)) {
            comando.setInt(1, id);
            comando.executeUpdate();
        }
    }
}

package logs;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpServer;
import repository.ConexaoBD;
import repository.LogRepository;

import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

// Recebe os logs do site em tempo real (POST /log na porta 8081)
public class LogServidor {

    // Molde dos dados que o site manda: o Gson preenche os campos pelo nome
    static class LogDTO {
        String nivel;
        String mensagem;
        String pagina;
        Integer idUsuario;
        String nome;
        String email;
        String cargo;
    }

    public static void main(String[] args) throws Exception {
        LogRepository repository = new LogRepository(new ConexaoBD().getJdbcTemplate());
        Gson gson = new Gson();

        HttpServer servidor = HttpServer.create(new InetSocketAddress(8081), 0);
        servidor.createContext("/log", ex -> {
            int status = 200;

            try {
                // Lê o JSON que o site mandou e transforma direto em objeto
                String corpo = new String(ex.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                LogDTO d = gson.fromJson(corpo, LogDTO.class);

                // Sem id = visitante
                Usuario usuario = null;
                if (d.idUsuario != null) {
                    usuario = new Usuario(d.idUsuario, d.nome, d.email, d.cargo);
                }

                new LogSite(d.nivel, d.mensagem, usuario, d.pagina, repository).registrarLog();

            } catch (Exception e) {
                e.printStackTrace(); // mostra no console do Java o motivo do erro
                status = 500;
            }

            ex.sendResponseHeaders(status, -1);
            ex.close();
        });
        servidor.start();

        System.out.println("Esperando logs do site na porta 8081");
    }
}
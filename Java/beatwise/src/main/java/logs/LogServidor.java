package logs;

import com.sun.net.httpserver.HttpServer;
import repository.ConexaoBD;
import repository.LogRepository;

import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

// Recebe os logs do site em tempo real (POST /log na porta 8081)
public class LogServidor {
    public static void main(String[] args) throws Exception {
        LogRepository repository = new LogRepository(new ConexaoBD().getJdbcTemplate());

        HttpServer servidor = HttpServer.create(new InetSocketAddress(8081), 0);
        servidor.createContext("/log", ex -> {
            int status = 200;

            try {
                // Uma variável para cada dado que o site manda
                String nivel = null;
                String mensagem = null;
                String pagina = null;
                String idUsuario = null;
                String nome = null;
                String email = null;
                String cargo = null;

                // Lê os dados que o site mandou (nivel=INFO&mensagem=...&pagina=...)
                String corpo = new String(ex.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                for (String par : corpo.split("&")) {
                    String[] partes = par.split("=", 2);
                    if (partes.length == 2 && !partes[1].isBlank()) {
                        String valor = URLDecoder.decode(partes[1], StandardCharsets.UTF_8);

                        // Olha o nome do dado e guarda na variável certa
                        switch (partes[0]) {
                            case "nivel" -> nivel = valor;
                            case "mensagem" -> mensagem = valor;
                            case "pagina" -> pagina = valor;
                            case "idUsuario" -> idUsuario = valor;
                            case "nome" -> nome = valor;
                            case "email" -> email = valor;
                            case "cargo" -> cargo = valor;
                        }
                    }
                }

                // Sem id = visitante
                Usuario usuario = null;
                if (idUsuario != null) {
                    usuario = new Usuario(Integer.valueOf(idUsuario), nome, email, cargo);
                }

                new LogSite(nivel, mensagem, usuario, pagina, repository).registrarLog();

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
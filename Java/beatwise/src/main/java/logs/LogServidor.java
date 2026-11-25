package logs;

import com.sun.net.httpserver.HttpServer;
import repository.ConexaoBD;
import repository.LogRepository;

import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

// Recebe os logs do site em tempo real (POST /log na porta 8081)
public class LogServidor {
    public static void main(String[] args) throws Exception {
        LogRepository repository = new LogRepository(new ConexaoBD().getJdbcTemplate());

        HttpServer servidor = HttpServer.create(new InetSocketAddress(8081), 0);
        servidor.createContext("/log", ex -> {
            int status = 200;

            try {
                // Lê os dados que o site mandou (nivel=INFO&mensagem=...&pagina=...)
                Map<String, String> d = new HashMap<>();
                String corpo = new String(ex.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                for (String par : corpo.split("&")) {
                    String[] kv = par.split("=", 2);
                    if (kv.length == 2 && !kv[1].isBlank()) {
                        d.put(kv[0], URLDecoder.decode(kv[1], StandardCharsets.UTF_8));
                    }
                }

                // Sem id = visitante
                Usuario usuario = null;
                if (d.get("idUsuario") != null) {
                    usuario = new Usuario(Integer.valueOf(d.get("idUsuario")), d.get("nome"), d.get("email"), d.get("cargo"));
                }

                new LogSite(d.get("nivel"), d.get("mensagem"), usuario, d.get("pagina"), repository).registrarLog();

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

package logs;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Logs {

    LocalDateTime dataLog;
    String nivel;
    String mensagem;

    public Logs(String nivel, String mensagem) {
        this.dataLog = LocalDateTime.now();
        this.nivel = nivel;
        this.mensagem = mensagem;
    }

    public String exibirLog() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM'/'dd'/'yyyy hh:mm:ss a");
        return "Data: " + dataLog.format(formatter) + "\n" + nivel + ": " + mensagem;
    }
}

package beat.wise;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Logs {

    String nivel;
    String mensagem;
    LocalDateTime dataLog;

    public Logs(String nivel, String mensagem) {
        this.nivel = nivel;
        this.mensagem = mensagem;
        this.dataLog = LocalDateTime.now();
    }

    public String exibirLog() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM'/'dd'/'yyyy hh:mm:ss a");
        return nivel + ": " + mensagem + "\nData: " + dataLog.format(formatter);
    }
}

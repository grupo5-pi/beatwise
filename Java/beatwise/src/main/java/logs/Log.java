package logs;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Log {
    private LocalDateTime dataLog;
    private String nivel;
    private String mensagem;

    public Log(String nivel, String mensagem) {
        this.dataLog = LocalDateTime.now();
        this.nivel = nivel;
        this.mensagem = mensagem;
    }

    public void registrarLog(String nivel, String mensagem) {
        if (nivel != null && mensagem != null) {
            Log log = new Log(nivel, mensagem);

            System.out.println(log.exibirLog());
        }
    }

    public LocalDateTime getDataLog() {
        return dataLog;
    }

    public void setDataLog(LocalDateTime dataLog) {
        this.dataLog = dataLog;
    }

    public String getNivel() {
        return nivel;
    }

    public void setNivel(String nivel) {
        this.nivel = nivel;
    }

    public String getMensagem() {
        return mensagem;
    }

    public void setMensagem(String mensagem) {
        this.mensagem = mensagem;
    }

    public String exibirLog() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM'/'dd'/'yyyy hh:mm:ss a");
        return "[" + getDataLog().format(formatter) + "] [" + getNivel() + "] - " + getMensagem();
    }
}

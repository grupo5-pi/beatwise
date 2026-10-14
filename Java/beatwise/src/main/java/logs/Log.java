package logs;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class Log {
    private LocalDateTime dataLog;
    private String nivel;
    private String mensagem;
    private String origem;

    public Log(String nivel, String mensagem, String origem) {
        this.dataLog = LocalDateTime.now();
        this.nivel = nivel;
        this.mensagem = mensagem;
        this.origem = origem;
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

    public String getOrigem() {
        return origem;
    }

    public void setOrigem(String origem) {
        this.origem = origem;
    }

    public String exibirLog() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM'/'dd'/'yyyy hh:mm:ss a");
        return "Data: " + dataLog.format(formatter) + "\n" + nivel + ": " + mensagem;
    }
}

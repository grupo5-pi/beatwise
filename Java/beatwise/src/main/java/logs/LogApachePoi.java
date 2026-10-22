package logs;

import java.time.format.DateTimeFormatter;

public class LogApachePoi extends Log {
    private Integer idRegistro;

    public LogApachePoi(String nivel, String mensagem, Integer idRegistro) {
        super(nivel, mensagem);
        this.idRegistro = idRegistro;
    }

    public void registrarLog(String nivel, String mensagem, Integer idRegistro) {
        if (nivel != null && mensagem != null || idRegistro != null) {
            LogApachePoi logApachePoi = new LogApachePoi(nivel, mensagem, idRegistro);

            System.out.println(logApachePoi.exibirLog());
        }
    }

    public Integer getIdRegistro() {
        return idRegistro;
    }

    public void setIdRegistro(Integer idRegistro) {
        this.idRegistro = idRegistro;
    }

    @Override
    public String exibirLog() {
        return super.exibirLog() + " : " + getIdRegistro();
    }
}

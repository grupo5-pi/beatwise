package logs;

import java.time.format.DateTimeFormatter;

public class LogSite extends Log{
    private Integer idUsuario;
    private String origem;

    public LogSite(String nivel, String mensagem, Integer idUsuario, String origem) {
        super(nivel, mensagem);
        this.idUsuario = idUsuario;
        this.origem = origem;
    }

    public void registrarLog(String nivel, String mensagem, Integer idUsuario, String origem) {
        if (nivel != null && mensagem != null || idUsuario != null || origem != null) {
            LogSite logSite = new LogSite(nivel, mensagem, idUsuario, origem);

            System.out.println(logSite.exibirLog());
        }
    }

    public String getOrigem() {
        return origem;
    }

    public void setOrigem(String origem) {
        this.origem = origem;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    @Override
    public String exibirLog() {
        return super.exibirLog() + " - [Página: " + getOrigem() + "] - {Usuário: " + getIdUsuario() + "}";
    }
}

package logs;

import repository.LogRepository;

import java.time.format.DateTimeFormatter;

public class LogSite extends Log{
    private Integer idUsuario;
    private String origem;
    private final LogRepository repository;

    public LogSite(String nivel, String mensagem, Integer idUsuario, String origem, LogRepository repository) {
        super(nivel, mensagem);
        this.idUsuario = idUsuario;
        this.origem = origem;
        this.repository = repository;
    }

    public void registrarLog() {
        if (this.getNivel() != null && this.getMensagem() != null || idUsuario != null || origem != null) {

            repository.saveSite(this);
            System.out.println(this.exibirLog());
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

package logs;

import repository.LogRepository;

public class LogSite extends Log {
    private Usuario usuario; // agregação: o log TEM um usuário (null = visitante)
    private String origem;
    private final LogRepository repository;

    public LogSite(String nivel, String mensagem, Usuario usuario, String origem, LogRepository repository) {
        super(nivel, mensagem);
        this.usuario = usuario;
        this.origem = origem;
        this.repository = repository;
    }

    public void registrarLog() {
        if (getNivel() != null && getMensagem() != null && origem != null) {
            repository.saveSite(this);
            System.out.println(exibirLog());
        }
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public String getOrigem() {
        return origem;
    }

    @Override
    public String exibirLog() {
        String quem = "visitante";
        if (usuario != null) {
            quem = (usuario.getNome() != null) ? usuario.getNome() : usuario.getEmail();
            if (usuario.getCargo() != null) quem += " (" + usuario.getCargo() + ")";
        }
        return super.exibirLog() + " - [Página: " + origem + "] - {Usuário: " + quem + "}";
    }
}

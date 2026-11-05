package logs;

import repository.LogRepository;

public class LogExtracaoExcel extends Log {
    private final LogRepository repository;

    public LogExtracaoExcel(String nivel, String mensagem, LogRepository repository) {
        super(nivel, mensagem);
        this.repository = repository;
    }

    public void registrarLog() {
        if (this.getNivel() != null && this.getMensagem() != null) {

            repository.saveApache(this);
            System.out.println(this.exibirLog());
        }
    }

    @Override
    public String exibirLog() {
        return super.exibirLog();
    }
}

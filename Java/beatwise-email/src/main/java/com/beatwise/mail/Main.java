package com.beatwise.mail;

import jakarta.mail.SendFailedException;
import jakarta.mail.internet.AddressException;

import java.time.LocalTime;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class Main {

    public static void main(String[] args) {
        int intervaloSegundos = Integer.parseInt(Env.obter("INTERVALO_SEGUNDOS", "30"));

        EmailService servico;
        try {
            servico = new EmailService();
        } catch (IllegalStateException erro) {
            log("ERRO DE CONFIGURAÇÃO: " + erro.getMessage());
            return;
        }
        EmailDao dao = new EmailDao();

        verificarBanco();

        ScheduledExecutorService agendador = Executors.newSingleThreadScheduledExecutor();
        Runtime.getRuntime().addShutdownHook(new Thread(agendador::shutdown));

        agendador.scheduleWithFixedDelay(
                () -> processarFila(dao, servico),
                0, intervaloSegundos, TimeUnit.SECONDS
        );

        log("Programa de e-mail rodando. Verificando a fila a cada " + intervaloSegundos + "s. (Ctrl+C para parar)");
    }

    private static void processarFila(EmailDao dao, EmailService servico) {
        try {
            List<EmailPendente> pendentes = dao.buscarPendentes();

            for (EmailPendente pedido : pendentes) {
                try {
                    servico.enviar(pedido);
                    dao.marcarComoEnviado(pedido.id());
                    log("E-mail enviado para " + pedido.email() + " (pedido " + pedido.id() + ")");
                } catch (Exception erro) {
                    log("Falha ao enviar para " + pedido.email() + " (pedido " + pedido.id() + "): " + erro.getMessage());

                    if (erroDoEndereco(erro)) {
                        registrarFalha(dao, pedido);
                    } else {
                        log("  (problema de conexão ou de login: o pedido continua na fila)");
                    }
                }
            }
        } catch (Exception erro) {
            log("Erro ao consultar a fila: " + erro.getMessage());
        }
    }

    private static boolean erroDoEndereco(Exception erro) {
        return erro instanceof AddressException || erro instanceof SendFailedException;
    }

    private static void registrarFalha(EmailDao dao, EmailPendente pedido) {
        try {
            dao.registrarFalha(pedido.id());
        } catch (Exception erro) {
            log("Não foi possível registrar a falha do pedido " + pedido.id() + ": " + erro.getMessage());
        }
    }

    private static void verificarBanco() {
        try {
            ConexaoBanco.abrir().close();
            log("Conectado ao banco de dados.");
        } catch (Exception erro) {
            log("ATENÇÃO: não foi possível conectar ao banco: " + erro.getMessage());
        }
    }

    private static void log(String mensagem) {
        System.out.println("[" + LocalTime.now().withNano(0) + "] " + mensagem);
    }
}

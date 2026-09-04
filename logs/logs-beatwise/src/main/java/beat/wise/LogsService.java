package beat.wise;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.logging.Logger;

public class LogsService {

    static List<Logs> historicoLogs = new ArrayList<>();
    static String mensagem = null;
    static String nivel = null;

    static final Logger log = Logger.getLogger(String.valueOf(Logs.class));
    static Scanner scanner = new Scanner(System.in);

    static public void acaoUsuario() {
        System.out.println("Qual página o usuário acessou?");
        System.out.println("1- Home");
        System.out.println("2- Cadastro");
        System.out.println("3- Login");
        System.out.println("4- Sair");
        Integer numero = scanner.nextInt();
        while (numero < 1 || numero > 4) {
            System.out.println("Digite um número correto!");
            numero = scanner.nextInt();
        }

        switch (numero) {
            case 1:
                home();
                break;
            case 2:
                cadastro();
                break;
            case 3:
                login();
                break;
            case 4:
                nivel = "INFORMAÇÕES";
                mensagem = "O usuário encerrou suas atividades no sistema";
                log.info(mensagem);
                historicoLogs.add(new Logs(nivel, mensagem));
                break;
        }
    }

    static public void home() {
        nivel = "INFORMAÇÕES";
        mensagem = "O usuário acessou a página home.";
        log.info(mensagem);
        historicoLogs.add(new Logs(nivel, mensagem));

        System.out.println("O usuário acessou outra página?");
        System.out.println("1- Sim");
        System.out.println("2- Não");
        Integer numero = scanner.nextInt();

        while (numero < 1 || numero > 2) {
            System.out.println("Digite um número correto!");
            numero = scanner.nextInt();
        }

        switch (numero) {
            case 1:
                acaoUsuario();
                break;

            case 2:
                nivel = "INFORMAÇÕES";
                mensagem = "O usuário encerrou suas atividades no sistema";
                log.info(mensagem);
                historicoLogs.add(new Logs(nivel, mensagem));
                break;
        }
    }

    static public void cadastro() {

        nivel = "INFORMAÇÕES";
        mensagem = "O usuário acessou a página de cadastro.";
        log.info(mensagem);
        historicoLogs.add(new Logs(nivel, mensagem));

        System.out.println("O usuário tentou se cadastrar no sistema?");
        System.out.println("1- Sim");
        System.out.println("2- Não");
        Integer numero = scanner.nextInt();

        while (numero < 1 || numero > 2) {
            System.out.println("Digite um número correto!");
            numero = scanner.nextInt();
        }

        switch (numero) {
            case 1:
                System.out.println("O usuário conseguiu se cadastrar no sistema?");
                System.out.println("1- Sim");
                System.out.println("2- Não");
                numero = scanner.nextInt();

                while (numero < 1 || numero > 2) {
                    System.out.println("Digite um número correto!");
                    numero = scanner.nextInt();
                }

                switch (numero) {
                    case 1:
                        nivel = "INFORMAÇÕES";
                        mensagem = "O usuário se cadastrou no sistema!";
                        log.info(mensagem);
                        historicoLogs.add(new Logs(nivel, mensagem));
                        break;

                    case 2:
                        nivel = "ADVERTÊNCIA";
                        mensagem = "O usuário não conseguiu se cadastrar no sistema.";
                        log.warning(mensagem);
                        historicoLogs.add(new Logs(nivel, mensagem));
                        break;
                }
                break;

            case 2:
                System.out.println("O usuário acessou outra página?");
                System.out.println("1- Sim");
                System.out.println("2- Não");
                numero = scanner.nextInt();

                while (numero < 1 || numero > 2) {
                    System.out.println("Digite um número correto!");
                    numero = scanner.nextInt();
                }

                switch (numero) {
                    case 1:
                        acaoUsuario();
                        break;

                    case 2:
                        nivel = "INFORMAÇÕES";
                        mensagem = "O usuário encerrou suas atividades no sistema";
                        log.info(mensagem);
                        historicoLogs.add(new Logs(nivel, mensagem));
                        break;
                }
                break;
        }
    }

    static public void login() {
        nivel = "INFORMAÇÕES";
        mensagem = "O usuário acessou a página de cadastro.";
        log.info(mensagem);
        historicoLogs.add(new Logs(nivel, mensagem));

        System.out.println("O usuário tentou realizar login no sistema?");
        System.out.println("1- Sim");
        System.out.println("2- Não");
        Integer numero = scanner.nextInt();

        while (numero < 1 || numero > 2) {
            System.out.println("Digite um número correto!");
            numero = scanner.nextInt();
        }

        switch (numero) {
            case 1:
                System.out.println("O usuário acessou outra página?");
                System.out.println("1- Sim");
                System.out.println("2- Não");
                numero = scanner.nextInt();

                while (numero < 1 || numero > 2) {
                    System.out.println("Digite um número correto!");
                    numero = scanner.nextInt();
                }

                switch (numero) {
                    case 1:
                        nivel = "INFORMAÇÕES";
                        mensagem = "O usuário realizou um login no sistema!";
                        log.info(mensagem);
                        historicoLogs.add(new Logs(nivel, mensagem));
                        break;

                    case 2:
                        nivel = "ADVERTÊNCIA";
                        mensagem = "O usuário não conseguiu realizar corretamente o login no sistema.";
                        log.warning(mensagem);
                        historicoLogs.add(new Logs(nivel, mensagem));
                        break;
                }
                break;

            case 2:
                System.out.println("O usuário acessou outra página?");
                System.out.println("1- Sim");
                System.out.println("2- Não");
                numero = scanner.nextInt();

                while (numero < 1 || numero > 2) {
                    System.out.println("Digite um número correto!");
                    numero = scanner.nextInt();
                }

                switch (numero) {
                    case 1:
                        acaoUsuario();
                        break;

                    case 2:
                        nivel = "INFORMAÇÕES";
                        mensagem = "O usuário encerrou suas atividades no sistema.";
                        log.info(mensagem);
                        historicoLogs.add(new Logs(nivel, mensagem));
                        break;
                }
                break;
        }
    }

    static public void listarLogs() {

        for (Logs historicoLog : historicoLogs) {
            System.out.println(historicoLog.exibirLog());
        }
    }
}

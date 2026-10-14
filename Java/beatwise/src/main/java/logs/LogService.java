package logs;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.logging.Logger;

public class LogService {
    private static List<Log> historicoLogs = new ArrayList<>();

    public static void registrarLog(String nivel, String mensagem, String origem) {
        Log log = new Log(nivel, mensagem, origem);
        historicoLogs.add(log);

        System.out.println(log.exibirLog());
    }
}

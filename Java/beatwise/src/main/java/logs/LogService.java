package logs;

import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;
import java.util.logging.Logger;

public class LogService {

    public static void registrarLog(String nivel, String mensagem, String origem) {
        if (nivel != null && mensagem != null && origem != null) {
            Log log = new Log(nivel, mensagem, origem);

            System.out.println(log.exibirLog());
        }
    }
}

package logs;

public class Main {
    public static void main(String[] args) {
        Log log1 = new Log("WARNER", "Banco caiu");
        LogApachePoi log2 = new LogApachePoi("INFO", "Os dados foram lidos", 2);
        LogSite log3 = new LogSite("WARNER", "Login realizado", 5, "Login");

        System.out.println(log1.exibirLog() + "\n");
        System.out.println(log2.exibirLog() + "\n");
        System.out.println(log3.exibirLog() + "\n");
    }
}
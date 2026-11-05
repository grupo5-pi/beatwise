package com.beatwise.mail;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

public class Env {

    private static final Map<String, String> ARQUIVO = lerArquivoEnv();

    public static String obter(String chave) {
        String doSistema = System.getenv(chave);
        if (doSistema != null && !doSistema.isBlank()) {
            return doSistema;
        }
        return ARQUIVO.get(chave);
    }

    public static String obter(String chave, String padrao) {
        String valor = obter(chave);
        return valor != null ? valor : padrao;
    }

    public static String exigir(String chave) {
        String valor = obter(chave);
        if (valor == null) {
            throw new IllegalStateException("A configuração '" + chave + "' não foi encontrada no .env");
        }
        return valor;
    }

    private static Map<String, String> lerArquivoEnv() {
        Map<String, String> valores = new HashMap<>();
        Path arquivo = Path.of(".env");

        if (!Files.exists(arquivo)) {
            return valores;
        }

        try {
            for (String linha : Files.readAllLines(arquivo)) {
                linha = linha.trim();
                int posicaoIgual = linha.indexOf('=');

                if (linha.isEmpty() || linha.startsWith("#") || posicaoIgual < 1) {
                    continue;
                }

                String chave = linha.substring(0, posicaoIgual).trim();
                String valor = linha.substring(posicaoIgual + 1).trim();

                boolean entreAspas = valor.length() >= 2
                        && (valor.startsWith("\"") && valor.endsWith("\"")
                        || valor.startsWith("'") && valor.endsWith("'"));
                if (entreAspas) {
                    valor = valor.substring(1, valor.length() - 1);
                }

                valores.put(chave, valor);
            }
        } catch (IOException erro) {
            throw new IllegalStateException("Não foi possível ler o arquivo .env", erro);
        }

        return valores;
    }
}

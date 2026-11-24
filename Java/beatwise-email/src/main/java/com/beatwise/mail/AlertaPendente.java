package com.beatwise.mail;

public record AlertaPendente(
        int id,
        String conteudo,
        String nome,
        String email
) {
}

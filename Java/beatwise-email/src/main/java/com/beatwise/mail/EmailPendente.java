package com.beatwise.mail;

import java.time.LocalDateTime;

public record EmailPendente(
        int id,
        String tipo,
        String codigo,
        LocalDateTime expiracao,
        String nome,
        String email,
        String empresa
) {
}

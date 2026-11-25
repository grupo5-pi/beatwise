package com.beatwise.mail;

import jakarta.activation.DataHandler;
import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.AddressException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.util.ByteArrayDataSource;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class EmailService {

    private static final DateTimeFormatter FORMATO_DATA = DateTimeFormatter.ofPattern("dd/MM/yyyy 'às' HH:mm");
    private static final Pattern MARCADOR = Pattern.compile("\\{\\{(\\w+)\\}\\}");

    private record Textos(String assunto, String titulo, String introducao, String botao) {
    }

    private static final String MODELO_HTML = """
            <div style="background-color:#0A0A0A;padding:30px 0;font-family:Arial,Helvetica,sans-serif;color:#e5e7eb;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"
                     style="max-width:100%;background-color:#130a24;border:1px solid #3b2a63;border-radius:12px;overflow:hidden;">

                <!-- CABEÇALHO -->
                <tr>
                  <td align="center" style="background-color:#0e0221;padding:26px 20px;border-bottom:3px solid #A855F7;">
                    {{cabecalho}}
                  </td>
                </tr>

                <!-- CONTEÚDO -->
                <tr>
                  <td style="padding:40px 30px;text-align:center;">
                    <h2 style="color:#ffffff;font-size:21px;margin:0 0 12px;">{{titulo}}</h2>
                    <p style="color:#c4b5fd;font-size:15px;line-height:1.6;margin:0 0 28px;">{{introducao}}</p>

                    <!-- CÓDIGO -->
                    <table border="0" cellpadding="0" cellspacing="0" align="center"
                           style="background-color:#1a0f2e;border:2px dashed #A855F7;border-radius:10px;">
                      <tr>
                        <td style="padding:18px 38px;text-align:center;">
                          <span style="font-family:'Courier New',Courier,monospace;font-size:34px;font-weight:bold;color:#ffffff;letter-spacing:8px;">{{codigo}}</span>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:30px 0 0;">
                      <a href="{{link}}" style="background-color:#7C3AED;color:#ffffff;text-decoration:none;font-weight:bold;padding:13px 28px;border-radius:8px;display:inline-block;">{{botao}}</a>
                    </p>

                    <p style="color:#a78bfa;font-size:13px;margin:26px 0 8px;">Este código vale até {{validade}} e só pode ser usado uma vez.</p>
                    <p style="color:#8b7bb8;font-size:13px;line-height:1.5;margin:0;">Se você não esperava este e-mail, pode ignorá-lo. Nenhuma alteração será feita na sua conta.</p>
                  </td>
                </tr>

                <!-- RODAPÉ -->
                <tr>
                  <td align="center" style="background-color:#0e0221;padding:18px;border-top:1px solid #3b2a63;">
                    <p style="margin:0;color:#7c6aa8;font-size:12px;">© {{ano}} BeatWise. Todos os direitos reservados.</p>
                  </td>
                </tr>
              </table>
            </div>
            """;

    private static final String MODELO_TEXTO = """
            BeatWise

            {{titulo}}

            {{introducao}}

            Código: {{codigo}}

            {{botao}}: {{link}}

            Este código vale até {{validade}} e só pode ser usado uma vez.
            Se você não esperava este e-mail, pode ignorá-lo.
            """;

    private record Alerta(String tipo, String texto) {
    }

    private static final String MODELO_HTML_ALERTAS = """
            <div style="background-color:#0A0A0A;padding:30px 0;font-family:Arial,Helvetica,sans-serif;color:#e5e7eb;">
              <table align="center" border="0" cellpadding="0" cellspacing="0" width="600"
                     style="max-width:100%;background-color:#130a24;border:1px solid #3b2a63;border-radius:12px;overflow:hidden;">

                <!-- CABEÇALHO -->
                <tr>
                  <td align="center" style="background-color:#0e0221;padding:26px 20px;border-bottom:3px solid #A855F7;">
                    {{cabecalho}}
                  </td>
                </tr>

                <!-- CONTEÚDO -->
                <tr>
                  <td style="padding:36px 30px;text-align:center;">
                    <h2 style="color:#ffffff;font-size:21px;margin:0 0 12px;">{{titulo}}</h2>
                    <p style="color:#c4b5fd;font-size:15px;line-height:1.6;margin:0 0 22px;">{{introducao}}</p>

                    <!-- ALERTAS -->
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:separate;border-spacing:0 8px;">
                      {{alertas}}
                    </table>

                    <p style="margin:26px 0 0;">
                      <a href="{{link}}" style="background-color:#7C3AED;color:#ffffff;text-decoration:none;font-weight:bold;padding:13px 28px;border-radius:8px;display:inline-block;">{{botao}}</a>
                    </p>

                    <p style="color:#8b7bb8;font-size:13px;line-height:1.5;margin:26px 0 0;">Você recebe este e-mail porque ativou os alertas na tela de Notificações do BeatWise. Para mudar o que recebe, acesse essa tela.</p>
                  </td>
                </tr>

                <!-- RODAPÉ -->
                <tr>
                  <td align="center" style="background-color:#0e0221;padding:18px;border-top:1px solid #3b2a63;">
                    <p style="margin:0;color:#7c6aa8;font-size:12px;">© {{ano}} BeatWise. Todos os direitos reservados.</p>
                  </td>
                </tr>
              </table>
            </div>
            """;

    private static final String MODELO_TEXTO_ALERTAS = """
            BeatWise

            {{titulo}}

            {{introducao}}

            {{alertas}}

            {{botao}}: {{link}}

            Você recebe este e-mail porque ativou os alertas na tela de Notificações do BeatWise.
            """;

    private final String linkDashboard;

    private final Session sessao;
    private final String remetente;
    private final String linkPrimeiroAcesso;
    private final byte[] logo;

    private static final String CABECALHO_COM_LOGO =
            "<img src=\"cid:logo\" alt=\"BeatWise\" width=\"240\" "
                    + "style=\"display:block;border:0;max-width:100%;height:auto;margin:0 auto;\">";
    private static final String CABECALHO_SEM_LOGO =
            "<h1 style=\"margin:0;color:#ffffff;font-size:26px;letter-spacing:2px;\">"
                    + "Beat<span style=\"color:#A855F7;\">Wise</span></h1>";

    public EmailService() {
        this.remetente = Env.exigir("EMAIL");

        boolean seguro = Boolean.parseBoolean(Env.obter("SMTP_SEGURO", "true"));

        Properties props = new Properties();
        props.put("mail.smtp.host", Env.obter("SMTP_HOST", "smtp.gmail.com"));
        props.put("mail.smtp.port", Env.obter("SMTP_PORT", "587"));

        props.put("mail.smtp.connectiontimeout", "10000");
        props.put("mail.smtp.timeout", "10000");
        props.put("mail.smtp.writetimeout", "10000");

        if (seguro) {
            String senha = Env.exigir("EMAIL_PASSWORD");
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            this.sessao = Session.getInstance(props, new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(remetente, senha);
                }
            });
        } else {
            this.sessao = Session.getInstance(props);
        }

        String enderecoSite = Env.obter("APP_URL", "http://localhost:3333");
        if (enderecoSite.endsWith("/")) {
            enderecoSite = enderecoSite.substring(0, enderecoSite.length() - 1);
        }
        this.linkPrimeiroAcesso = enderecoSite + "/primeiroAcesso.html";
        this.linkDashboard = enderecoSite + "/dashboardProdutor.html";
        this.logo = carregarLogo();
    }

    private byte[] carregarLogo() {
        try (InputStream entrada = EmailService.class.getResourceAsStream("/logo.png")) {
            if (entrada == null) {
                System.out.println("AVISO: logo.png não encontrado em src/main/resources. Os e-mails sairão sem imagem.");
                return null;
            }
            return entrada.readAllBytes();
        } catch (IOException erro) {
            System.out.println("AVISO: não foi possível ler o logo.png (" + erro.getMessage() + "). Os e-mails sairão sem imagem.");
            return null;
        }
    }

    public void enviar(EmailPendente pedido) throws MessagingException {
        Textos textos = escolherTextos(pedido);
        String validade = pedido.expiracao().format(FORMATO_DATA);

        Map<String, String> html = Map.of(
                "titulo", escapar(textos.titulo()),
                "introducao", escapar(textos.introducao()),
                "codigo", escapar(pedido.codigo()),
                "link", escapar(linkPrimeiroAcesso),
                "botao", escapar(textos.botao()),
                "validade", escapar(validade),
                "ano", String.valueOf(Year.now().getValue()),
                "cabecalho", logo != null ? CABECALHO_COM_LOGO : CABECALHO_SEM_LOGO
        );
        Map<String, String> texto = Map.of(
                "titulo", textos.titulo(),
                "introducao", textos.introducao(),
                "codigo", pedido.codigo(),
                "link", linkPrimeiroAcesso,
                "botao", textos.botao(),
                "validade", validade
        );

        MimeBodyPart parteTexto = new MimeBodyPart();
        parteTexto.setText(preencher(MODELO_TEXTO, texto), "UTF-8");

        MimeBodyPart parteHtml = new MimeBodyPart();
        parteHtml.setContent(preencher(MODELO_HTML, html), "text/html; charset=utf-8");

        MimeMultipart conteudo = new MimeMultipart("alternative");
        conteudo.addBodyPart(parteTexto);
        conteudo.addBodyPart(parteHtml);

        MimeMessage mensagem = new MimeMessage(sessao);
        try {
            mensagem.setFrom(new InternetAddress(remetente, "BeatWise", "UTF-8"));
        } catch (UnsupportedEncodingException erro) {
            throw new MessagingException("Nome do remetente inválido", erro);
        }
        mensagem.setRecipient(Message.RecipientType.TO, validarDestinatario(pedido.email()));
        mensagem.setSubject(textos.assunto(), "UTF-8");
        mensagem.setContent(logo != null ? comLogo(conteudo) : conteudo);

        Transport.send(mensagem);
    }

    public void enviarAlerta(AlertaPendente pedido) throws MessagingException {
        List<Alerta> alertas = lerAlertas(pedido.conteudo());
        if (alertas.isEmpty()) {
            return;
        }

        String nome = primeiroNome(pedido.nome());
        String saudacao = nome.isEmpty() ? "Olá!" : "Olá, " + nome + "!";

        String assunto = alertas.size() == 1
                ? "BeatWise: 1 novo alerta na sua dashboard"
                : "BeatWise: " + alertas.size() + " novos alertas na sua dashboard";
        String titulo = "Novos alertas na dashboard";
        String introducao = saudacao + " A base de dados do BeatWise foi atualizada e surgiram alertas para você:";
        String botao = "Abrir a dashboard";

        StringBuilder linhasHtml = new StringBuilder();
        StringBuilder linhasTexto = new StringBuilder();
        for (Alerta alerta : alertas) {
            boolean positivo = "positivo".equals(alerta.tipo());
            String cor = positivo ? "#22c55e" : "#ef4444";
            String seta = positivo ? "▲" : "▼";

            linhasHtml.append("<tr><td style=\"padding:12px 14px;background-color:#1a0f2e;border-left:4px solid ")
                    .append(cor)
                    .append(";border-radius:6px;text-align:left;font-size:14px;line-height:1.5;color:#e5e7eb;\">")
                    .append("<span style=\"color:").append(cor).append(";font-weight:bold;\">").append(seta).append("</span> ")
                    .append(escapar(alerta.texto()))
                    .append("</td></tr>");
            linhasTexto.append(positivo ? "(+) " : "(-) ").append(alerta.texto()).append("\n");
        }

        Map<String, String> html = Map.of(
                "titulo", escapar(titulo),
                "introducao", escapar(introducao),
                "alertas", linhasHtml.toString(),
                "link", escapar(linkDashboard),
                "botao", escapar(botao),
                "ano", String.valueOf(Year.now().getValue()),
                "cabecalho", logo != null ? CABECALHO_COM_LOGO : CABECALHO_SEM_LOGO
        );
        Map<String, String> texto = Map.of(
                "titulo", titulo,
                "introducao", introducao,
                "alertas", linhasTexto.toString().stripTrailing(),
                "link", linkDashboard,
                "botao", botao
        );

        MimeBodyPart parteTexto = new MimeBodyPart();
        parteTexto.setText(preencher(MODELO_TEXTO_ALERTAS, texto), "UTF-8");

        MimeBodyPart parteHtml = new MimeBodyPart();
        parteHtml.setContent(preencher(MODELO_HTML_ALERTAS, html), "text/html; charset=utf-8");

        MimeMultipart conteudo = new MimeMultipart("alternative");
        conteudo.addBodyPart(parteTexto);
        conteudo.addBodyPart(parteHtml);

        MimeMessage mensagem = new MimeMessage(sessao);
        try {
            mensagem.setFrom(new InternetAddress(remetente, "BeatWise", "UTF-8"));
        } catch (UnsupportedEncodingException erro) {
            throw new MessagingException("Nome do remetente inválido", erro);
        }
        mensagem.setRecipient(Message.RecipientType.TO, validarDestinatario(pedido.email()));
        mensagem.setSubject(assunto, "UTF-8");
        mensagem.setContent(logo != null ? comLogo(conteudo) : conteudo);

        Transport.send(mensagem);
    }

    private List<Alerta> lerAlertas(String conteudo) {
        List<Alerta> alertas = new ArrayList<>();
        if (conteudo == null) {
            return alertas;
        }
        for (String linha : conteudo.split("\\R")) {
            if (linha.isBlank()) {
                continue;
            }
            String[] partes = linha.split("\t", 2);
            if (partes.length == 2 && !partes[1].isBlank()) {
                alertas.add(new Alerta(partes[0].trim(), partes[1].trim()));
            }
        }
        return alertas;
    }

    private MimeMultipart comLogo(MimeMultipart alternativas) throws MessagingException {
        MimeBodyPart corpo = new MimeBodyPart();
        corpo.setContent(alternativas);

        MimeBodyPart imagem = new MimeBodyPart();
        imagem.setDataHandler(new DataHandler(new ByteArrayDataSource(logo, "image/png")));
        imagem.setContentID("<logo>");
        imagem.setDisposition(MimeBodyPart.INLINE);
        imagem.setFileName("logo-beatwise.png");

        MimeMultipart relacionado = new MimeMultipart("related");
        relacionado.addBodyPart(corpo);
        relacionado.addBodyPart(imagem);
        return relacionado;
    }

    private InternetAddress validarDestinatario(String email) throws MessagingException {
        if (email == null || email.isBlank()) {
            throw new AddressException("O funcionário não tem e-mail cadastrado");
        }
        InternetAddress destino = new InternetAddress(email.trim(), true);
        destino.validate();
        return destino;
    }

    private Textos escolherTextos(EmailPendente pedido) {
        String nome = primeiroNome(pedido.nome());
        String saudacao = nome.isEmpty() ? "Olá!" : "Olá, " + nome + "!";

        if ("REDEFINICAO".equals(pedido.tipo())) {
            return new Textos(
                    "BeatWise: código para redefinir sua senha",
                    "Redefinição de senha",
                    saudacao + " Recebemos um pedido para redefinir a senha da sua conta no BeatWise. "
                            + "Use o código abaixo para criar uma nova senha:",
                    "Criar nova senha"
            );
        }

        String empresa = pedido.empresa() == null ? "" : pedido.empresa().trim();
        String cadastro = empresa.isEmpty()
                ? "Seu cadastro no BeatWise foi realizado."
                : "Seu cadastro na empresa " + empresa + " foi realizado no BeatWise.";

        return new Textos(
                "Bem-vindo(a) ao BeatWise! Ative seu acesso",
                "Ative seu acesso",
                saudacao + " " + cadastro + " Use o código abaixo para criar sua senha e acessar o sistema:",
                "Criar minha senha"
        );
    }

    private String primeiroNome(String nomeCompleto) {
        if (nomeCompleto == null || nomeCompleto.isBlank()) {
            return "";
        }
        return nomeCompleto.trim().split("\\s+")[0];
    }

    private String preencher(String modelo, Map<String, String> valores) {
        Matcher encontrado = MARCADOR.matcher(modelo);
        StringBuilder resultado = new StringBuilder();

        while (encontrado.find()) {
            String valor = valores.getOrDefault(encontrado.group(1), "");
            encontrado.appendReplacement(resultado, Matcher.quoteReplacement(valor));
        }
        encontrado.appendTail(resultado);

        return resultado.toString();
    }

    private String escapar(String texto) {
        if (texto == null) {
            return "";
        }
        return texto.replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}
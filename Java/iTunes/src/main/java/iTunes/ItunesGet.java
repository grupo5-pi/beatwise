package iTunes;

import com.fasterxml.jackson.databind.ObjectMapper;
import iTunes.dto.ItunesListaDto;
import iTunes.dto.ItunesMusicaDto;
import iTunes.dto.MusicaBancoDto;
import iTunes.repository.ConexaoBD;
import iTunes.repository.MusicaRepository;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.List;

public class ItunesGet {

    public static void main(String[] args) {
        ConexaoBD conexao = new ConexaoBD();
        MusicaRepository musicaRepository = new MusicaRepository(conexao.getJdbcTemplate());
        List<MusicaBancoDto> musicasBanco = musicaRepository.selectMusicasPendentes(100);

        try (HttpClient client = HttpClient.newHttpClient()) {

            ObjectMapper mapper = new ObjectMapper();

            for (MusicaBancoDto musicaBanco : musicasBanco) {
                String termo = URLEncoder.encode(
                        musicaBanco.getArtista() + " " + musicaBanco.getFaixa(), StandardCharsets.UTF_8
                );
                String url = "https://itunes.apple.com/search?term=" + termo + "&media=music&entity=song&limit=5";

                URI uri = URI.create(url);

                HttpRequest request = HttpRequest.newBuilder()
                        .uri(uri)
                        .build();

                HttpResponse<String> response = client.send(request,
                        HttpResponse.BodyHandlers.ofString());

                ItunesListaDto resposta = mapper.readValue(response.body(), ItunesListaDto.class);

                ItunesMusicaDto musicaEncontrada = null;

                for (ItunesMusicaDto musica : resposta.getResults()) {
                    boolean artistaIgual =
                            padronizar(musica.getArtistName())
                                    .contains(padronizar(musicaBanco.getArtista()));
                    boolean faixaIgual =
                            padronizar(musica.getTrackName())
                                    .contains(padronizar(musicaBanco.getFaixa()));
                    if (artistaIgual && faixaIgual) {
                        musicaEncontrada = musica;
                        break;
                    }
                }

                if (musicaEncontrada != null) {
                    Integer ano = extrairAno(musicaEncontrada.getReleaseDate());

                    System.out.println("MATCH -> " + musicaBanco.getFaixa()
                            + " | " + musicaEncontrada.getPrimaryGenreName()
                            + " | " + ano);

                    musicaRepository.atualizarGeneroEAno(
                            musicaBanco.getId(),
                            musicaEncontrada.getPrimaryGenreName(),
                            ano
                    );
                } else {
                    System.out.println("SEM MATCH -> " + musicaBanco.getFaixa());
                    System.out.println("   banco : " + musicaBanco.getArtista() + " | " + musicaBanco.getFaixa());

                    for (ItunesMusicaDto musica : resposta.getResults()) {
                        System.out.println("   iTunes: " + musica.getArtistName() + " | " + musica.getTrackName());
                    }
                    musicaRepository.marcarNaoEncontrada(musicaBanco.getId());
                }
                Thread.sleep(3500);
            }
        } catch (IOException | InterruptedException e) {
            e.printStackTrace();
        }
    }

    private static Integer extrairAno(String releaseDate) {
        if (releaseDate == null || releaseDate.length() < 4) {
            return null;
        }
        try {
            return Integer.valueOf(releaseDate.substring(0, 4));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private static String limparNome(String nome) {
        return nome
                .replaceAll("\\(.*?\\)", "")
                .replaceAll("\\[.*?\\]", "")
                .replaceAll("\\s-\\s.*$", "")
                .trim();
    }

    private static String padronizar(String texto) {
        return limparNome(texto).toLowerCase().replaceAll("[^\\p{L}\\p{N}]", "");
    }
}
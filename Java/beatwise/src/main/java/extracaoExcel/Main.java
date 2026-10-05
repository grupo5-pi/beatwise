package extracaoExcel;

import java.util.List;

public class Main {

    public static void main(String[] args) {
        String nomeArquivo = "SpotifyYoutubeDataset.xlsx";

        // Extraindo as músicas do arquivo
        LeitorExcel leitorExcel = new LeitorExcel();
        List<Musica> musicasExtraidas = leitorExcel.extrairMusica(nomeArquivo);

        System.out.println("Músicas extraídas:");
        for (Musica musica : musicasExtraidas) {
            System.out.println(musica);
        }
    }
}
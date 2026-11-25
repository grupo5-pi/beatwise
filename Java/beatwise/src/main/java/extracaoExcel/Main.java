package extracaoExcel;

import java.util.List;

public class Main {

    public static void main(String[] args) {
        String nomeBucket = "s3-beatwise";
        String chaveArquivo = "SpotifyYoutubeDataset.xlsx";

        // Extraindo as músicas do arquivo
        LeitorExcel leitorExcel = new LeitorExcel();
        List<Musica> musicasExtraidas = leitorExcel.extrairMusica(nomeBucket, chaveArquivo);

//        System.out.println("Músicas extraídas:");
//        for (Musica musica : musicasExtraidas) {
//            System.out.println(musica);
//        }
    }
}
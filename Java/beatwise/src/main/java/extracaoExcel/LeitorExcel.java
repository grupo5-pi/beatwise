package extracaoExcel;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class LeitorExcel {

    public List<Musica> extrairMusica(String nomeArquivo) {
        List<Musica> musicasExtraidas = new ArrayList<>();

        try (
              InputStream arquivo = new FileInputStream(nomeArquivo);
              Workbook workbook = new XSSFWorkbook(arquivo) // caso seja .xls troque para HSSFWorkbook
        ) {

            System.out.printf("Iniciando leitura do arquivo %s%n inserção no banco de dados da BeatWise", nomeArquivo);

            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                if (row.getRowNum() == 0) {
                    printarCabecalho(row);
                    continue;
                }

                // Extraindo valor das células e criando objeto Música
                System.out.println("Lendo linha " + row.getRowNum());

                Integer id = row.getCell(0) != null ? (int) row.getCell(0).getNumericCellValue() : null;
                String artist = row.getCell(1) != null ? row.getCell(1).getStringCellValue() : null;
                String urlSpotify = row.getCell(2) != null ? row.getCell(2).getStringCellValue() : null;
                String track = row.getCell(3) != null ? row.getCell(3).getStringCellValue() : null;
                String album = row.getCell(4) != null ? row.getCell(4).getStringCellValue() : null;
                String albumType = row.getCell(5) != null ? row.getCell(5).getStringCellValue() : null;
                String uri = row.getCell(6) != null ? row.getCell(6).getStringCellValue() : null;
                Integer danceability = row.getCell(7) != null ? (int) row.getCell(7).getNumericCellValue() : null;
                Integer energy = row.getCell(8) != null ? (int) row.getCell(8).getNumericCellValue() : null;
                Integer key = row.getCell(9) != null ? (int) row.getCell(9).getNumericCellValue() : null;
                Integer loudness = row.getCell(10) != null ? (int) row.getCell(10).getNumericCellValue() : null;
                Integer speechiness = row.getCell(11) != null ? (int) row.getCell(11).getNumericCellValue() : null;
                Double acousticness = row.getCell(12) != null ? (double) row.getCell(12).getNumericCellValue() : null;
                Double instrumentalness = row.getCell(13) != null ? (double) row.getCell(13).getNumericCellValue() : null;
                Integer liveness = row.getCell(14) != null ? (int) row.getCell(14).getNumericCellValue() : null;
                Integer valence = row.getCell(15) != null ? (int) row.getCell(15).getNumericCellValue() : null;
                Integer tempo = row.getCell(16) != null ? (int) row.getCell(16).getNumericCellValue() : null;
                Integer durationMs = row.getCell(17) != null ? (int) row.getCell(17).getNumericCellValue() : null;
                String urlYoutube = row.getCell(18) != null ? row.getCell(18).getStringCellValue() : null;
                String title = row.getCell(19) != null ? row.getCell(19).getStringCellValue() : null;
                String channel = row.getCell(20) != null ? row.getCell(20).getStringCellValue() : null;
                Long views = row.getCell(21) != null ? (long) row.getCell(21).getNumericCellValue() : null;
                Integer likes = row.getCell(22) != null ? (int) row.getCell(22).getNumericCellValue() : null;
                Integer comments = row.getCell(23) != null ? (int) row.getCell(23).getNumericCellValue() : null;
                String description = row.getCell(24) != null ? row.getCell(24).getStringCellValue() : null;
                Boolean licensed = row.getCell(25) != null ? row.getCell(25).getBooleanCellValue() : null;
                Boolean officialVideo = row.getCell(26) != null ? row.getCell(26).getBooleanCellValue() : null;
                Long stream = row.getCell(27) != null ? (long) row.getCell(27).getNumericCellValue() : null;

                Musica musica = new Musica(id, artist, urlSpotify, track, album, albumType, uri, danceability, energy, key, loudness, speechiness, acousticness, instrumentalness, liveness, valence, tempo, durationMs, urlYoutube, title, channel, views, likes, comments, description, licensed, officialVideo, stream);
                musicasExtraidas.add(musica);
            }

            printarLinhas();
            System.out.println("Leitura do arquivo finalizada");
            printarLinhas();

            return musicasExtraidas;
        } catch (IOException e) {
            return musicasExtraidas;
        }
    }

    private void printarCabecalho(Row row) {
        printarLinhas();
        System.out.println("Lendo cabeçalho");
        for (int i = 0; i < 10; i++) {
            String coluna = row.getCell(i).getStringCellValue();
            System.out.println("Coluna " + i + ": " + coluna);
        }
        printarLinhas();
    }

    private void printarLinhas() {
        System.out.println("-".repeat(20));
    }
}

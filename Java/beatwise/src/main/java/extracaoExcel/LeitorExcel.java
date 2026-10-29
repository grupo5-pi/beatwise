package extracaoExcel;

import logs.LogExtracaoExcel;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.jdbc.core.JdbcTemplate;
import repository.ConexaoBD;
import repository.ExtracaoRepository;
import repository.LogRepository;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

public class LeitorExcel {

    public List<Musica> extrairMusica(String nomeArquivo) {
        List<Musica> musicasExtraidas = new ArrayList<>();

        ConexaoBD conexao = new ConexaoBD();
        JdbcTemplate jdbcTemplate = conexao.getJdbcTemplate();
        LogRepository repository = new LogRepository(jdbcTemplate);
        ExtracaoRepository extracaoRepository = new ExtracaoRepository(jdbcTemplate);

        try (
              InputStream arquivo = new FileInputStream(nomeArquivo);
              Workbook workbook = new XSSFWorkbook(arquivo) // caso seja .xls troque para HSSFWorkbook
        ) {

            System.out.printf("Iniciando leitura do arquivo %s, para inserção no banco de dados da BeatWise", nomeArquivo);

            Sheet sheet = workbook.getSheetAt(0);

            Integer contador = 1;
            for (Row row : sheet) {
                if (row.getRowNum() == 0) {
                    printarCabecalho(row);
                    continue;
                }

                // Extraindo valor das células e criando objeto Música
//                System.out.println("Lendo linha " + row.getRowNum());

                Integer id = row.getCell(0) != null ? (int) row.getCell(0).getNumericCellValue() : null;
                String artist = row.getCell(1) != null ? row.getCell(1).getStringCellValue() : null;
                String urlSpotify = row.getCell(2) != null ? row.getCell(2).getStringCellValue() : null;
                String track = row.getCell(3) != null ? row.getCell(3).getStringCellValue() : null;
                String album = row.getCell(4) != null ? row.getCell(4).getStringCellValue() : null;
                String albumType = row.getCell(5) != null ? row.getCell(5).getStringCellValue() : null;
                String uri = row.getCell(6) != null ? row.getCell(6).getStringCellValue() : null;
                Double danceability = row.getCell(7) != null ? tratarDecimal(row.getCell(7).getNumericCellValue()) : null;
                Double energy = row.getCell(8) != null ? tratarDecimal(row.getCell(8).getNumericCellValue()) : null;
                Integer key = row.getCell(9) != null ? (int) row.getCell(9).getNumericCellValue() / 10 : null;
                Double loudness = row.getCell(10) != null ? row.getCell(10).getNumericCellValue() : null;
                Double speechiness = row.getCell(11) != null ? tratarDecimal(row.getCell(11).getNumericCellValue()) : null;
                Double acousticness = row.getCell(12) != null ? tratarDecimal(row.getCell(12).getNumericCellValue()) : null;
                Double instrumentalness = row.getCell(13) != null ? tratarDecimal(row.getCell(13).getNumericCellValue()) : null;
                Double liveness = row.getCell(14) != null ? tratarDecimal(row.getCell(14).getNumericCellValue()) : null;
                Double valence = row.getCell(15) != null ? tratarDecimal(row.getCell(15).getNumericCellValue()) : null;
                Double tempo = row.getCell(16) != null ? row.getCell(16).getNumericCellValue() / 1000 : null;
                Long durationMs = row.getCell(17) != null ? (long) row.getCell(17).getNumericCellValue() / 10 : null;
                String urlYoutube = row.getCell(18) != null ? row.getCell(18).getStringCellValue() : null;
                String title = row.getCell(19) != null ? row.getCell(19).getStringCellValue() : null;
                String channel = row.getCell(20) != null ? row.getCell(20).getStringCellValue() : null;
                Long views = row.getCell(21) != null ? (long) row.getCell(21).getNumericCellValue() / 10 : null;
                Integer likes = row.getCell(22) != null ? (int) row.getCell(22).getNumericCellValue() / 10 : null;
                Integer comments = row.getCell(23) != null ? (int) row.getCell(23).getNumericCellValue() / 10 : null;
                String description = row.getCell(24) != null ? row.getCell(24).getStringCellValue() : null;
                Boolean licensed = row.getCell(25) != null ? row.getCell(25).getBooleanCellValue() : null;
                Boolean officialVideo = row.getCell(26) != null ? row.getCell(26).getBooleanCellValue() : null;
                Long stream = row.getCell(27) != null ? (long) row.getCell(27).getNumericCellValue() : null;

                Musica musica = new Musica(extracaoRepository, id, artist, urlSpotify, track, album, albumType, uri, danceability, energy, key, loudness, speechiness, acousticness, instrumentalness, liveness, valence, tempo, durationMs, urlYoutube, title, channel, views, likes, comments, description, licensed, officialVideo, stream);
                musicasExtraidas.add(musica);

                musica.inserirMusica(); // Salvar no banco de dados

                contador++; // Quantidade de registros
                if (contador % 1000 == 0) {
                    LogExtracaoExcel logExtracaoExcel = new LogExtracaoExcel("INFO", "Leitura e inserção de registros no banco de dados: [" + contador + " registros]", repository);
                    logExtracaoExcel.registrarLog();
                }
            }

            printarLinhas();
            System.out.println("Leitura do arquivo finalizada");
            printarLinhas();

            LogExtracaoExcel logExtracaoExcel = new LogExtracaoExcel("INFO", "A leitura do arquivo excel foi reaizada com sucesso!", repository);
            logExtracaoExcel.registrarLog();

            return musicasExtraidas;
        } catch (IOException e) {

            LogExtracaoExcel logExtracaoExcel = new LogExtracaoExcel("WARNING", "Ocorreu um erro ao realizar a leitura dos arquivos!", repository);
            logExtracaoExcel.registrarLog();
            System.out.println(e);

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

    private Double tratarDecimal(Double valor) {
        if (valor < 0) {
            return valor;
        }
        while (valor >= 1) {
            valor /= 10.0;
        }
        return valor;
    }
}

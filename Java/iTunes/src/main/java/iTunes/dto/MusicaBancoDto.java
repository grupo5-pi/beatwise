package iTunes.dto;

public class MusicaBancoDto {
    private Integer id;
    private String artista;
    private String faixa;

    public MusicaBancoDto(Integer id, String artista, String faixa) {
        this.id = id;
        this.artista = artista;
        this.faixa = faixa;
    }

    public MusicaBancoDto() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getArtista() {
        return artista;
    }

    public void setArtista(String artista) {
        this.artista = artista;
    }

    public String getFaixa() {
        return faixa;
    }

    public void setFaixa(String faixa) {
        this.faixa = faixa;
    }

    @Override
    public String toString() {
        return "MusicaBancoDto{" +
                "id=" + id +
                ", artista='" + artista + '\'' +
                ", faixa='" + faixa + '\'' +
                '}';
    }
}

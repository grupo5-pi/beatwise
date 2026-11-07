package iTunes.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ItunesMusicaDto {
    private String trackName;
    private String artistName;
    private String collectionName;
    private String primaryGenreName;

    public ItunesMusicaDto(String trackName, String artistName, String collectionName, String primaryGenreName) {
        this.trackName = trackName;
        this.artistName = artistName;
        this.collectionName = collectionName;
        this.primaryGenreName = primaryGenreName;
    }

    public ItunesMusicaDto() {
    }

    public String getTrackName() {
        return trackName;
    }

    public void setTrackName(String trackName) {
        this.trackName = trackName;
    }

    public String getArtistName() {
        return artistName;
    }

    public void setArtistName(String artistName) {
        this.artistName = artistName;
    }

    public String getCollectionName() {
        return collectionName;
    }

    public void setCollectionName(String collectionName) {
        this.collectionName = collectionName;
    }

    public String getPrimaryGenreName() {
        return primaryGenreName;
    }

    public void setPrimaryGenreName(String primaryGenreName) {
        this.primaryGenreName = primaryGenreName;
    }

    @Override
    public String toString() {
        return "ItunesMusicaDto{" +
                "trackName='" + trackName + '\'' +
                ", artistName='" + artistName + '\'' +
                ", collectionName='" + collectionName + '\'' +
                ", primaryGenreName='" + primaryGenreName + '\'' +
                '}';
    }
}

package extracaoExcel;

import repository.ExtracaoRepository;

public class Musica {
    private final ExtracaoRepository repository;

    private Integer id;
    private String artist;
    private String urlSpotify;
    private String track;
    private String album;
    private String albumType;
    private String uri;
    private Double danceability;
    private Double energy;
    private Integer key;
    private Double loudness;
    private Double speechiness;
    private Double acousticness;
    private Double instrumentalness;
    private Double liveness;
    private Double valence;
    private Double tempo;
    private Long durationMs;
    private String urlYoutube;
    private String title;
    private String channel;
    private Long views;
    private Integer likes;
    private Integer comments;
    private String description;
    private Boolean licensed;
    private Boolean officialVideo;
    private Long stream;

    public Musica(ExtracaoRepository repository) {
        this.repository = repository;
    }

    public Musica(ExtracaoRepository repository, Integer id, String artist, String urlSpotify, String track, String album, String albumType, String uri, Double danceability, Double energy, Integer key, Double loudness, Double speechiness, Double acousticness, Double instrumentalness, Double liveness, Double valence, Double tempo, Long durationMs, String urlYoutube, String title, String channel, Long views, Integer likes, Integer comments, String description, Boolean licensed, Boolean officialVideo, Long stream) {
        this.repository = repository;
        this.id = id;
        this.artist = artist;
        this.urlSpotify = urlSpotify;
        this.track = track;
        this.album = album;
        this.albumType = albumType;
        this.uri = uri;
        this.danceability = danceability;
        this.energy = energy;
        this.key = key;
        this.loudness = loudness;
        this.speechiness = speechiness;
        this.acousticness = acousticness;
        this.instrumentalness = instrumentalness;
        this.liveness = liveness;
        this.valence = valence;
        this.tempo = tempo;
        this.durationMs = durationMs;
        this.urlYoutube = urlYoutube;
        this.title = title;
        this.channel = channel;
        this.views = views;
        this.likes = likes;
        this.comments = comments;
        this.description = description;
        this.licensed = licensed;
        this.officialVideo = officialVideo;
        this.stream = stream;
    }

    // Metodo de inserir no banco
    public void inserirMusica() {
        repository.saveAlbum(album);

        repository.saveArtista(artist);

        repository.saveMusica(track, repository.selectAlbum(album));

        repository.saveMusicaArtista(repository.selectArtista(artist), repository.selectMusica(track, repository.selectAlbum(album)));

        repository.saveSpotify(
                repository.selectMusica(track, repository.selectAlbum(album)),
                urlSpotify,
                danceability,
                energy,
                key,
                loudness,
                acousticness,
                instrumentalness,
                liveness,
                valence,
                tempo,
                durationMs,
                stream
        );

        repository.saveYoutube(
                repository.selectMusica(track, repository.selectAlbum(album)),
                urlYoutube,
                title,
                channel,
                views,
                likes,
                comments,
                description,
                licensed,
                officialVideo
        );
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getArtist() {
        return artist;
    }

    public void setArtist(String artist) {
        this.artist = artist;
    }

    public String getUrlSpotify() {
        return urlSpotify;
    }

    public void setUrlSpotify(String urlSpotify) {
        this.urlSpotify = urlSpotify;
    }

    public String getTrack() {
        return track;
    }

    public void setTrack(String track) {
        this.track = track;
    }

    public String getAlbum() {
        return album;
    }

    public void setAlbum(String album) {
        this.album = album;
    }

    public String getAlbumType() {
        return albumType;
    }

    public void setAlbumType(String albumType) {
        this.albumType = albumType;
    }

    public String getUri() {
        return uri;
    }

    public void setUri(String uri) {
        this.uri = uri;
    }

    public Double getDanceability() {
        return danceability;
    }

    public void setDanceability(Double danceability) {
        this.danceability = danceability;
    }

    public Double getEnergy() {
        return energy;
    }

    public void setEnergy(Double energy) {
        this.energy = energy;
    }

    public Integer getKey() {
        return key;
    }

    public void setKey(Integer key) {
        this.key = key;
    }

    public Double getLoudness() {
        return loudness;
    }

    public void setLoudness(Double loudness) {
        this.loudness = loudness;
    }

    public Double getSpeechiness() {
        return speechiness;
    }

    public void setSpeechiness(Double speechiness) {
        this.speechiness = speechiness;
    }

    public Double getAcousticness() {
        return acousticness;
    }

    public void setAcousticness(Double acousticness) {
        this.acousticness = acousticness;
    }

    public Double getInstrumentalness() {
        return instrumentalness;
    }

    public void setInstrumentalness(Double instrumentalness) {
        this.instrumentalness = instrumentalness;
    }

    public Double getLiveness() {
        return liveness;
    }

    public void setLiveness(Double liveness) {
        this.liveness = liveness;
    }

    public Double getValence() {
        return valence;
    }

    public void setValence(Double valence) {
        this.valence = valence;
    }

    public Double getTempo() {
        return tempo;
    }

    public void setTempo(Double tempo) {
        this.tempo = tempo;
    }

    public Long getDurationMs() {
        return durationMs;
    }

    public void setDurationMs(Long durationMs) {
        this.durationMs = durationMs;
    }

    public String getUrlYoutube() {
        return urlYoutube;
    }

    public void setUrlYoutube(String urlYoutube) {
        this.urlYoutube = urlYoutube;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public Long getViews() {
        return views;
    }

    public void setViews(Long views) {
        this.views = views;
    }

    public Integer getLikes() {
        return likes;
    }

    public void setLikes(Integer likes) {
        this.likes = likes;
    }

    public Integer getComments() {
        return comments;
    }

    public void setComments(Integer comments) {
        this.comments = comments;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getLicensed() {
        return licensed;
    }

    public void setLicensed(Boolean licensed) {
        this.licensed = licensed;
    }

    public Boolean getOfficialVideo() {
        return officialVideo;
    }

    public void setOfficialVideo(Boolean officialVideo) {
        this.officialVideo = officialVideo;
    }

    public Long getStream() {
        return stream;
    }

    public void setStream(Long stream) {
        this.stream = stream;
    }

    @Override
    public String toString() {
        return "Musica{" +
                "id=" + id +
                ", artist='" + artist + '\'' +
                ", urlSpotify='" + urlSpotify + '\'' +
                ", track='" + track + '\'' +
                ", album='" + album + '\'' +
                ", albumType='" + albumType + '\'' +
                ", uri='" + uri + '\'' +
                ", danceability=" + danceability +
                ", energy=" + energy +
                ", key=" + key +
                ", loudness=" + loudness +
                ", speechiness=" + speechiness +
                ", acousticness=" + acousticness +
                ", instrumentalness=" + instrumentalness +
                ", liveness=" + liveness +
                ", valence=" + valence +
                ", tempo=" + tempo +
                ", durationMs=" + durationMs +
                ", urlYoutube='" + urlYoutube + '\'' +
                ", title='" + title + '\'' +
                ", channel='" + channel + '\'' +
                ", views=" + views +
                ", likes=" + likes +
                ", comments=" + comments +
                ", description='" + description + '\'' +
                ", licensed=" + licensed +
                ", officialVideo=" + officialVideo +
                ", stream=" + stream +
                '}';
    }
}
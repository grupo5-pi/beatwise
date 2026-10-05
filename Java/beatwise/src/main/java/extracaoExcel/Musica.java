package extracaoExcel;

public class Musica {

    private Integer id;
    private String artist;
    private String urlSpotify;
    private String track;
    private String album;
    private String albumType;
    private String uri;
    private Integer danceability;
    private Integer energy;
    private Integer key;
    private Integer loudness;
    private Integer speechiness;
    private Double acousticness;
    private Double instrumentalness;
    private Integer liveness;
    private Integer valence;
    private Integer tempo;
    private Integer durationMs;
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

    public Musica() {
    }

    public Musica(Integer id, String artist, String urlSpotify, String track, String album, String albumType, String uri, Integer danceability, Integer energy, Integer key, Integer loudness, Integer speechiness, Double acousticness, Double instrumentalness, Integer liveness, Integer valence, Integer tempo, Integer durationMs, String urlYoutube, String title, String channel, Long views, Integer likes, Integer comments, String description, Boolean licensed, Boolean officialVideo, Long stream) {
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

    public Integer getDanceability() {
        return danceability;
    }

    public void setDanceability(Integer danceability) {
        this.danceability = danceability;
    }

    public Integer getEnergy() {
        return energy;
    }

    public void setEnergy(Integer energy) {
        this.energy = energy;
    }

    public Integer getKey() {
        return key;
    }

    public void setKey(Integer key) {
        this.key = key;
    }

    public Integer getLoudness() {
        return loudness;
    }

    public void setLoudness(Integer loudness) {
        this.loudness = loudness;
    }

    public Integer getSpeechiness() {
        return speechiness;
    }

    public void setSpeechiness(Integer speechiness) {
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

    public Integer getLiveness() {
        return liveness;
    }

    public void setLiveness(Integer liveness) {
        this.liveness = liveness;
    }

    public Integer getValence() {
        return valence;
    }

    public void setValence(Integer valence) {
        this.valence = valence;
    }

    public Integer getTempo() {
        return tempo;
    }

    public void setTempo(Integer tempo) {
        this.tempo = tempo;
    }

    public Integer getDurationMs() {
        return durationMs;
    }

    public void setDurationMs(Integer durationMs) {
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
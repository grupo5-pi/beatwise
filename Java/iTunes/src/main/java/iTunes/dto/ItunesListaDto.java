package iTunes.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ItunesListaDto {

    private Integer resultCount;
    private List<ItunesMusicaDto> results;

    public ItunesListaDto() {}

    public Integer getResultCount() {
        return resultCount;
    }

    public void setResultCount(Integer resultCount) {
        this.resultCount = resultCount;
    }

    public List<ItunesMusicaDto> getResults() {
        return results;
    }

    public void setResults(List<ItunesMusicaDto> results) {
        this.results = results;
    }
}
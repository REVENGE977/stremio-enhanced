import SeriesInfo from "./SeriesInfo";
import MetaDetails from "./MetaDetails";

interface PlayerState {
    seriesInfoDetails: SeriesInfo | null;
    metaDetails: MetaDetails;
    stream?: { content: { url: string; subtitles?: { url: string; lang: string }[] } };
    subtitles?: { url: string; lang: string }[];
}

export default PlayerState;
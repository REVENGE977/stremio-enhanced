import SeriesInfo from "./SeriesInfo";
import MetaDetails from "./MetaDetails";

interface PlayerState {
    seriesInfoDetails: SeriesInfo | null;
    metaDetails: MetaDetails;
    stream?: { content: { url: string } };
}

export default PlayerState;
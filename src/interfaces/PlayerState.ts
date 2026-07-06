import SeriesInfo from "./SeriesInfo";
import MetaDetails from "./MetaDetails";

interface PlayerState {
    seriesInfoDetails: SeriesInfo | null;
    metaDetails: MetaDetails;
    stream?: { content: { url: string } };
    nextVideo?: { deepLinks: { metaDetailsStreams: string, metaDetailsVideos: string, player: string }};
    subtitles?: { id: string, lang: string, url: string, addonSubtitleId?: string, origin: string }[];
}

export default PlayerState;
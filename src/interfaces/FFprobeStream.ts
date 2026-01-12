interface FFprobeStream {
    index: number;
    codec_name?: string;
    tags?: {
        language?: string;
        title?: string;
    };
};

export default FFprobeStream;
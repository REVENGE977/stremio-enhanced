import Helpers from "./Helpers";
import { getLogger } from "./logger";
import PlaybackState from "./PlaybackState";

const logger = getLogger("EmbeddedSubtitles");

class EmbeddedSubtitles {
    private static extractedAlready = false;

    private static patchReactDom() {
        // prevents React from crashing when we add subtitle tracks from DOM, which we need to do if Stremio fails to load embedded subtitles natively for some reason.
        if (!(window as any)._patchedReactDom) {
            const originalRemoveChild = Node.prototype.removeChild;
            Node.prototype.removeChild = function<T extends Node>(child: T): T {
                try {
                    // If the browser knows this isn't a child, silently reject to save React
                    if (child && child.parentNode !== this) {
                        return child;
                    }
                    return originalRemoveChild.call(this, child) as T;
                } catch (e) {
                    return child;
                }
            };

            const originalInsertBefore = Node.prototype.insertBefore;
            Node.prototype.insertBefore = function<T extends Node>(newNode: T, refNode: Node | null): T {
                try {
                    if (refNode && refNode.parentNode !== this) {
                        return newNode;
                    }
                    return originalInsertBefore.call(this, newNode, refNode) as T;
                } catch (e) {
                    return newNode;
                }
            };
            (window as any)._patchedReactDom = true;
        }
    }

    public static async checkWatching() {
        this.patchReactDom();

        if (!location.href.includes('#/player')) {
            this.extractedAlready = false; 
            return;
        }
        
        await Helpers.waitForElm('video');
        const video = document.querySelector("video") as HTMLVideoElement;
        if (!video) return;
        
        video.addEventListener("loadedmetadata", async () => {
            if (this.extractedAlready) return;
            this.extractedAlready = true;
            
            if (video.textTracks.length === 0) {
                logger.info("No native embedded subtitles found. Initializing JIT HLS Subtitle Fetcher...");
                
                Helpers.createToast(
                    "extractingAlertToast",
                    "Extracting subtitles...",
                    "Fetching embedded subtitles from server, please wait.",
                    "info"
                );

                try {
                    await this.initializeJITSubtitles(video);
                } catch (err) {
                    logger.error(`Failed to initialize JIT subtitles: ${err}`);
                }
            } else {
                logger.info("Embedded subtitles natively loaded. No need to use workaround.");
            }
        });
    }

    private static async getStreamURL(): Promise<string | undefined> {
        const playerState = await PlaybackState.getPlayerState();
        if (!playerState) {
            logger.error("Failed to get player state.");
            return undefined;
        }
        return playerState.stream?.content?.url;
    }

    private static async initializeJITSubtitles(video: HTMLVideoElement) {
        const streamURL = await this.getStreamURL();
        if (!streamURL) throw new Error("No stream URL available.");

        const urlObj = new URL(streamURL);
        let serverBase = "http://127.0.0.1:11470";
        if (urlObj.hostname === "127.0.0.1" || urlObj.hostname === "localhost") {
            serverBase = `${urlObj.protocol}//${urlObj.host}`;
        }
        
        const hlsId = "enhanced_subs_" + Math.random().toString(36).substring(2, 10);
        const queryParams = new URLSearchParams();
        queryParams.append("mediaURL", streamURL);
        queryParams.append("maxAudioChannels", "8");
        ['h264', 'h265', 'hevc', 'vp9'].forEach(c => queryParams.append('videoCodecs', c));
        ['aac', 'mp3', 'opus'].forEach(c => queryParams.append('audioCodecs', c));

        const masterUrl = streamURL.includes('.m3u8') 
            ? streamURL 
            : `${serverBase}/hlsv2/${hlsId}/master.m3u8?${queryParams.toString()}`;

        const masterRes = await fetch(masterUrl);
        if (!masterRes.ok) throw new Error(`Master playlist returned ${masterRes.status}`);
        
        const masterText = await masterRes.text();
        const subLines = masterText.split('\n').filter(l => l.startsWith('#EXT-X-MEDIA:TYPE=SUBTITLES'));
        
        if (subLines.length === 0) {
            Helpers.createToast("noEmbeddedSubsToast", "No embedded subtitles", "No subtitle tracks found in stream.", "info");
            return;
        }

        let tracksAdded = 0;
        const dummyBlobUrl = URL.createObjectURL(new Blob(["WEBVTT\n\n"], { type: "text/vtt" }));
        
        const fragment = document.createDocumentFragment();
        let isFirstTrack = true;
        let isFullyInitialized = false;

        for (const subLine of subLines) {
            const uriMatch = subLine.match(/URI="([^"]+)"/);
            const langMatch = subLine.match(/LANGUAGE="([^"]+)"/);
            const nameMatch = subLine.match(/NAME="([^"]+)"/);
            
            if (!uriMatch) continue;

            const subPlaylistUrl = new URL(uriMatch[1], masterUrl).toString();
            const subPlaylistRes = await fetch(subPlaylistUrl);
            if (!subPlaylistRes.ok) continue;

            const lines = (await subPlaylistRes.text()).split('\n');
            const segments: { url: string, start: number, end: number, fetched: boolean }[] = [];
            let currentTime = 0;
            
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].startsWith('#EXTINF:')) {
                    const duration = parseFloat(lines[i].split(':')[1].split(',')[0]);
                    const segmentUri = lines[i + 1].trim();
                    
                    segments.push({
                        url: new URL(segmentUri, subPlaylistUrl).toString(),
                        start: currentTime,
                        end: currentTime + duration,
                        fetched: false
                    });
                    currentTime += duration;
                }
            }

            const trackEl = document.createElement("track");
            trackEl.kind = "subtitles";
            trackEl.label = nameMatch ? nameMatch[1] : "Embedded";
            trackEl.srclang = langMatch ? langMatch[1] : "en";
            trackEl.src = dummyBlobUrl; 
            
            if (isFirstTrack) {
                trackEl.default = true; // Wakes up Stremio UI to add the subs to the subtitles menu
                isFirstTrack = false;
            }

            fragment.appendChild(trackEl);
            tracksAdded++;
            
            setTimeout(() => {
                const track = trackEl.track;
                if (!track) return;
                
                let isFetching = false;
                
                video.addEventListener('timeupdate', async () => {
                    if (!isFullyInitialized) return;
                    if (track.mode !== 'showing') return; 
                    if (isFetching) return; 

                    const lookaheadTime = video.currentTime + 10; 
                    const neededSegments = segments.filter(seg => 
                        !seg.fetched && 
                        seg.start <= lookaheadTime && 
                        seg.end >= video.currentTime - 2
                    );

                    if (neededSegments.length > 0) {
                        isFetching = true;

                        for (const seg of neededSegments) {
                            if (seg.start > video.currentTime + 20 || seg.end < video.currentTime - 5) continue;

                            seg.fetched = true; 
                            
                            try {
                                const res = await fetch(seg.url);
                                if (!res.ok) throw new Error(`Server ${res.status}`);
                                const vttText = await res.text();
                                this.injectVttCues(vttText, track);
                            } catch (err) {
                                logger.error(`Segment at ${seg.start} failed ${err}`);
                                setTimeout(() => { seg.fetched = false; }, 2000);
                                break; 
                            }
                        }
                        isFetching = false;
                    }
                });
            }, 50);
        }

        video.appendChild(fragment);

        setTimeout(() => {
            let defaultSubLang = this.getDefaultSubLang();
            let targetTrack: TextTrack | null = null;

            const domTracks = Array.from(video.querySelectorAll('track'));
            for (const t of domTracks) {
                if (t.track && t.srclang === defaultSubLang) {
                    targetTrack = t.track;
                    break; 
                }
            }

            if (targetTrack) {
                for (let i = 0; i < video.textTracks.length; i++) {
                    const track = video.textTracks[i];
                    
                    if (track === targetTrack) {
                        track.mode = 'showing';
                    } else {
                        track.mode = 'disabled';
                    }
                }
            } 

            isFullyInitialized = true; 
        }, 250);

        logger.info("Initialized JIT subtitle fetcher with " + tracksAdded + " tracks added.");

        Helpers.createToast(
            "embeddedSubsToast", 
            "Subtitles ready", 
            `Loaded ${tracksAdded} embedded subtitle tracks.`, 
            "success"
        );
    }

    private static injectVttCues(vttText: string, track: TextTrack) {
        const blocks = vttText.split(/\n\s*\n/);
        
        for (const block of blocks) {
            const lines = block.trim().split('\n');
            if (lines[0].includes('WEBVTT')) continue;

            const timeLineIndex = lines.findIndex(l => l.includes('-->'));
            if (timeLineIndex === -1) continue;

            const timeLine = lines[timeLineIndex];
            const [startStr, endStr] = timeLine.split(' --> ');
            
            const startTime = this.parseVttTime(startStr);
            const endTime = this.parseVttTime(endStr);
            const text = lines.slice(timeLineIndex + 1).join('\n');

            try {
                track.addCue(new VTTCue(startTime, endTime, text));
            } catch (e) {
                // Ignore overlap cue errors
            }
        }
    }

    private static parseVttTime(timeStr: string): number {
        const parts = timeStr.trim().split(':');
        let seconds = 0;
        if (parts.length === 3) {
            seconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(parts[2]);
        } else if (parts.length === 2) {
            seconds = parseInt(parts[0]) * 60 + parseFloat(parts[1]);
        }
        return seconds;
    }

    private static getDefaultSubLang(): string {
        const profile = JSON.parse(localStorage.getItem("profile") ?? "{}");
        return profile?.settings?.subtitlesLanguage ?? "en";
    }
}

export default EmbeddedSubtitles;
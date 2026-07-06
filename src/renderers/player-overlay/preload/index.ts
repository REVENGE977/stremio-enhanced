import { inputConfig } from "./setup/inputConfig";
import { ControlBar } from "./ui/ControlBar";
import { ProgressSliders } from "./ui/ProgressSliders";
import { PlaybackSpeedMenu } from "./ui/PlaybackSpeedMenu";
import { AudioMenu } from "./ui/AudioMenu";
import { SubtitlesMenu } from "./ui/SubtitlesMenu";

document.addEventListener("DOMContentLoaded", () => {
    // Initialize configurations
    inputConfig.init();

    // Initialize UI Elements
    ControlBar.init();
    ProgressSliders.init();
    PlaybackSpeedMenu.init();
    AudioMenu.init();
    SubtitlesMenu.init();
});
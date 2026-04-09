import { ICONS } from "../constants";

export function getThemeIcon(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon">
        <g><path fill="none" d="M0 0h24v24H0z"></path>
        <path d="${ICONS.THEME}" style="fill: currentcolor;"></path></g></svg>`;
}

export function getPluginIcon(): string {
    return `<svg icon="addons-outline" class="icon" viewBox="0 0 512 512" style="fill: currentcolor;">
        <path d="${ICONS.PLUGIN}" style="stroke:currentcolor;stroke-linecap:round;stroke-linejoin:round;stroke-width:32;fill: currentColor;"></path></svg>`;
}

export function getAboutIcon(): string {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="icon">
        <g><path fill="none" d="M0 0h24v24H0z"></path>
        <path d="${ICONS.ABOUT}" style="fill:currentcolor"></path></g></svg>`;
}
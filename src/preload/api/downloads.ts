import { ipcRenderer } from 'electron';
import { IPC_CHANNELS } from '../../constants';
import type { DownloadMeta, LibraryItem } from '../../utils/DownloadLibrary';
import type { DownloadProgress, DownloadRequest, ImportCandidate } from '../../controllers/downloadController';

type ProgressCallback = (progress: DownloadProgress) => void;

export const downloadsAPI = {
    enqueueDownloads: (requests: DownloadRequest[]): Promise<{ id: string; success: boolean; error?: string }[]> => {
        return ipcRenderer.invoke(IPC_CHANNELS.ENQUEUE_DOWNLOADS, requests);
    },
    getDownloads: (): Promise<DownloadProgress[]> => {
        return ipcRenderer.invoke(IPC_CHANNELS.GET_DOWNLOADS);
    },
    retryDownload: (id: string): Promise<boolean> => {
        return ipcRenderer.invoke(IPC_CHANNELS.RETRY_DOWNLOAD, id);
    },
    getAllDownloaded: (): Promise<LibraryItem[]> => {
        return ipcRenderer.invoke(IPC_CHANNELS.GET_ALL_DOWNLOADED);
    },
    scanImportable: (folders: (string | null)[]): Promise<ImportCandidate[]> => {
        return ipcRenderer.invoke(IPC_CHANNELS.SCAN_IMPORTABLE, folders);
    },
    importDownloaded: (items: { path: string; meta: DownloadMeta }[], folders: (string | null)[]): Promise<number> => {
        return ipcRenderer.invoke(IPC_CHANNELS.IMPORT_DOWNLOADED, items, folders);
    },
    getDiskSpace: (folder?: string | null): Promise<{ free: number; total: number } | null> => {
        return ipcRenderer.invoke(IPC_CHANNELS.GET_DISK_SPACE, folder);
    },
    getDownloaded: (metaId: string): Promise<LibraryItem[]> => {
        return ipcRenderer.invoke(IPC_CHANNELS.GET_DOWNLOADED, metaId);
    },
    deleteDownloaded: (videoId: string): Promise<boolean> => {
        return ipcRenderer.invoke(IPC_CHANNELS.DELETE_DOWNLOADED, videoId);
    },
    getLibraryServerUrl: (): Promise<string> => {
        return ipcRenderer.invoke(IPC_CHANNELS.GET_LIBRARY_SERVER_URL);
    },
    chooseDownloadFolder: (current?: string | null): Promise<string | null> => {
        return ipcRenderer.invoke(IPC_CHANNELS.CHOOSE_DOWNLOAD_FOLDER, current);
    },
    cancelDownload: (id: string): Promise<boolean> => {
        return ipcRenderer.invoke(IPC_CHANNELS.CANCEL_DOWNLOAD, id);
    },
    showDownload: (path: string): Promise<boolean> => {
        return ipcRenderer.invoke(IPC_CHANNELS.SHOW_DOWNLOAD, path);
    },
    getDownloadsPath: (): Promise<string> => {
        return ipcRenderer.invoke(IPC_CHANNELS.GET_DOWNLOADS_PATH);
    },
    onDownloadProgress: (callback: ProgressCallback) => {
        ipcRenderer.on(IPC_CHANNELS.DOWNLOAD_PROGRESS, (_event, progress) => callback(progress));
    },
};

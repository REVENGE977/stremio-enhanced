interface PepperPluginEntry {
    name: string;
    path: string;
    mimeType: string;
    enabled: boolean;
    description?: string;
}

interface PepperPluginConfig {
    plugins: PepperPluginEntry[];
}

export { PepperPluginEntry, PepperPluginConfig };

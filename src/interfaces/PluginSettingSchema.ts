interface PluginOption {
    key: string;
    type: "input" | "toggle" | "select";
    label: string;
    description?: string;
    defaultValue?: any;
    options?: { label: string; value: any }[]; // For select type
}

export default PluginOption;
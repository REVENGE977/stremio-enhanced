import TemplateCache from "../../utils/templateCache";

export async function getToastTemplate(id: string, title: string, message: string, status: "success" | "fail" | "info"): Promise<string> {
    let template = TemplateCache.load(__dirname, 'toast');
    let toastStatus;

    switch(status) {
        case "success":
            toastStatus = "success-eIDTa";
            break;
        case "fail":
            toastStatus = "error-quyOd";
            break;
        case "info":
            toastStatus = "info-KEWq8";
            break;
    }
    
    return template
        .replace("{{ id }}", id)
        .replace("{{ title }}", title)
        .replace("{{ message }}", message)
        .replace("{{ status }}", toastStatus);
}

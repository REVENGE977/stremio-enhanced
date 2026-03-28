import { ipcRenderer } from 'electron';
import { getPromptModalTemplate } from '../../components/prompt-modal/promptModal';
import { IPC_CHANNELS } from '../../constants';

export const alertAPI = {
    showAlert: (alertType: string, title: string, message: string, buttons: string[]) => {
        return ipcRenderer.invoke(IPC_CHANNELS.SHOW_ALERT, alertType, title, message, buttons);
    },
    showPrompt: (promptId: string, title: string, message: string, defaultValue: string = ''): Promise<string | null> => {
        return new Promise((resolve) => {
            const modalId = `prompt-modal-${promptId}`;

            let html = getPromptModalTemplate(promptId, title, message, defaultValue);
            document.body.insertAdjacentHTML('beforeend', html);

            const modal = document.getElementById(modalId);
            const input = document.getElementById(`${modalId}-input`) as HTMLInputElement;
            const cancelBtn = document.getElementById(`${modalId}-cancel`);
            const saveBtn = document.getElementById(`${modalId}-save`);

            if (!modal || !input) {
                resolve(null);
                return;
            }

            input.focus();

            const closeAndRespond = (value: string | null) => {
                modal.remove();
                resolve(value); 
            };

            cancelBtn?.addEventListener('click', () => closeAndRespond(null));
            saveBtn?.addEventListener('click', () => closeAndRespond(input.value));

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') closeAndRespond(input.value);
                if (e.key === 'Escape') closeAndRespond(null);
            });
        });
    }
};
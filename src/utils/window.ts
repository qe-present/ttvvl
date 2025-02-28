import { getAllWebviewWindows } from '@tauri-apps/api/webviewWindow';


export class WindowManager {
    async getWindowByLabel(label: string) {
        const windows = await getAllWebviewWindows();
        return windows.find((win) => win.label === label);
    }
    async closeWindow(label: string) {
        const window = await this.getWindowByLabel(label);
        if (window) {
            window.hide();
        }
    }
}

export default WindowManager;
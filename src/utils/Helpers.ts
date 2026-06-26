import { dialog } from "electron";
import logger from "./logger";
import { SELECTORS, TIMEOUTS } from "../constants";
import { getToastTemplate } from "../components/toast/toast";

class Helpers {        
    public static async showAlert(
        alertType: 'info' | 'warning' | 'error' | 'question' | 'none', 
        title: string, 
        message: string, 
        buttons: string[]
    ): Promise<number> {
        const options: Electron.MessageBoxOptions = {
            type: alertType,
            title,
            message,
            buttons,
            cancelId: buttons.length > 1 ? 1 : 0
        };
        
        try {
            const response = await dialog.showMessageBox(options);
            return response.response;
        } catch (error) {
            logger.error('Error displaying alert: ' + (error as Error).message);
            return -1; 
        }
    }
    
    public static waitForElm(selector: string, timeout: number = TIMEOUTS.ELEMENT_WAIT): Promise<Element> {
        return new Promise((resolve, reject) => {
            const existingElement = document.querySelector(selector);
            if (existingElement) {
                return resolve(existingElement);
            }
            
            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });
            
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Timeout waiting for element with selector: ${selector}`));
            }, timeout);
        });
    }

    public static waitForElmByXPath(xpath: string, timeout: number = TIMEOUTS.ELEMENT_WAIT): Promise<Node> {
        return new Promise((resolve, reject) => {
            const evaluateXPath = (): Node | null => {
                const result = document.evaluate(
                    xpath, 
                    document, 
                    null, 
                    XPathResult.FIRST_ORDERED_NODE_TYPE, 
                    null
                );
                return result.singleNodeValue;
            };
    
            const existingElement = evaluateXPath();
            if (existingElement) {
                return resolve(existingElement);
            }
            
            const observer = new MutationObserver(() => {
                const element = evaluateXPath();
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });
    
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
    
            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Timeout waiting for element with XPath: ${xpath}`));
            }, timeout);
        });
    }    

    public static waitForTitleChange(timeout: number = TIMEOUTS.ELEMENT_WAIT): Promise<string> {
        return new Promise((resolve, reject) => {
            const headElement = document.querySelector('head');
            if (!headElement) {
                return reject(new Error('Head element not found'));
            }

            const observer = new MutationObserver(() => {
                observer.disconnect();
                resolve(document.title);
            });
            
            observer.observe(headElement, {
                subtree: true,
                childList: true,
            });
            
            setTimeout(() => {
                observer.disconnect();
                reject(new Error('Timeout waiting for document.title to change'));
            }, timeout);
        });
    }

    /**
     * Patches React DOM methods in the PAGE context to prevent
     * crashes when the browser modifies DOM nodes during audio track switches.
     * Uses script injection to bypass Electron's contextIsolation.
     */
    public static patchReactDom() {
        if (document.getElementById('enhanced-react-dom-patch')) return;

        const script = document.createElement('script');
        script.id = 'enhanced-react-dom-patch';
        
        script.textContent = `
            if (!window._patchedReactDomPage) {
                var originalRemoveChild = Node.prototype.removeChild;
                var originalInsertBefore = Node.prototype.insertBefore;
                var originalReplaceChild = Node.prototype.replaceChild;

                var isInPlayer = function() {
                    return location.href.includes('#/player');
                };

                Node.prototype.removeChild = function(child) {
                    if (isInPlayer() && child && child.parentNode !== this) {
                        return child;
                    }
                    return originalRemoveChild.call(this, child);
                };

                window._patchedReactDomPage = true;
            }
        `;
        document.head.appendChild(script);
    }

    public static async createToast(toastId: string, title: string, message: string, status: "success" | "fail" | "info", timeoutMs:number = 3000) {
        let template = await getToastTemplate(toastId, title, message, status);
        let toastContainer = document.querySelector(SELECTORS.TOAST_CONTAINER);
        if(toastContainer) {
            toastContainer.insertAdjacentHTML('beforeend', template);
            
            setTimeout(() => {
                document.getElementById(toastId)?.remove();
            }, timeoutMs);
        }
    }

    /**
     * Execute JavaScript in the context of Stremio's core services
     * @param js - JavaScript code to execute
     * @returns Promise with the result of the execution
     */
    public static _eval(js: string): Promise<unknown> {
        return new Promise((resolve, reject) => {
            try {
                const uniqueId = `stremio-enhanced-${Math.random().toString(36).slice(2, 11)}`;
                const script = document.createElement('script');
                
                const handler = (data: Event) => {
                    script.remove();
                    window.removeEventListener(uniqueId, handler); 
                    resolve((data as CustomEvent).detail);
                };

                window.addEventListener(uniqueId, handler);
                
                script.appendChild(
                    document.createTextNode(`
                        (() => {
                            if (!window.__permanentCore) {
                                window.__permanentCore = { getState: null, dispatch: null };
                            }
                            
                            var liveCore = window.core || window.services?.core;
                            if (liveCore) {
                                if (liveCore.getState && !window.__permanentCore.getState) {
                                    window.__permanentCore.getState = liveCore.getState.bind(liveCore);
                                }
                                if (liveCore.dispatch && !window.__permanentCore.dispatch) {
                                    window.__permanentCore.dispatch = liveCore.dispatch.bind(liveCore);
                                }
                            }

                            const executeQuery = () => {
                                var currentCore = window.core || window.services?.core;
                                var activeGetState = currentCore?.getState || window.__permanentCore?.getState;
                                var activeDispatch = currentCore?.dispatch || window.__permanentCore?.dispatch;

                                if (!activeGetState && !activeDispatch) {
                                    setTimeout(executeQuery, 30);
                                    return;
                                }

                                try {
                                    const core = {
                                        getState: activeGetState,
                                        dispatch: activeDispatch
                                    };

                                    var result = eval(\`${js.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`);
                                
                                    if (result instanceof Promise) {
                                        result.then((awaitedResult) => {
                                            window.dispatchEvent(new CustomEvent("${uniqueId}", { detail: awaitedResult }));
                                        }).catch((err) => {
                                            window.dispatchEvent(new CustomEvent("${uniqueId}", { detail: { error: err.message } }));
                                        });
                                    } else {
                                        window.dispatchEvent(new CustomEvent("${uniqueId}", { detail: result }));
                                    }
                                } catch (evalError) {
                                    window.dispatchEvent(new CustomEvent("${uniqueId}", { detail: { error: evalError.message } }));
                                }
                            };

                            executeQuery();
                        })();
                    `),
                );
                    
                document.head.appendChild(script);
            } catch (err) {
                reject(err);
            }
        });
    }

    public static getElementByXpath(path: string): Node | null {
        return document.evaluate(
            path, 
            document, 
            null, 
            XPathResult.FIRST_ORDERED_NODE_TYPE, 
            null
        ).singleNodeValue;
    }

    public static getFileNameFromUrl(url: string): string {
        const parts = url.split('/');
        return parts[parts.length - 1] || '';
    }

    public static formatTime(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    /**
     * Compare two semantic version strings
     * @returns true if version1 > version2
     */
    public static isNewerVersion(version1: string, version2: string): boolean {
        const normalize = (v: string): number[] => 
            v.replace(/^v/, '').split('.').map(n => parseInt(n, 10) || 0);
        
        const v1Parts = normalize(version1);
        const v2Parts = normalize(version2);
        const maxLength = Math.max(v1Parts.length, v2Parts.length);
        
        for (let i = 0; i < maxLength; i++) {
            const v1 = v1Parts[i] ?? 0;
            const v2 = v2Parts[i] ?? 0;
            if (v1 > v2) return true;
            if (v1 < v2) return false;
        }
        return false;
    }
}

export default Helpers;

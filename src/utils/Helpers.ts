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
            buttons
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
        // Prevent injecting the script multiple times
        if (document.getElementById('enhanced-react-dom-patch')) return;

        const script = document.createElement('script');
        script.id = 'enhanced-react-dom-patch';
        
        script.textContent = `
            if (!window._patchedReactDomPage) {
                var originalRemoveChild = Node.prototype.removeChild;
                var originalInsertBefore = Node.prototype.insertBefore;
                var originalReplaceChild = Node.prototype.replaceChild;

                Node.prototype.removeChild = function(child) {
                    try {
                        if (child && child.parentNode !== this) return child;
                        return originalRemoveChild.call(this, child);
                    } catch (e) {
                        console.warn('[Stremio Enhanced] Prevented React removeChild crash');
                        return child;
                    }
                };

                Node.prototype.insertBefore = function(newNode, refNode) {
                    try {
                        if (refNode && refNode.parentNode !== this) {
                            return originalInsertBefore.call(this, newNode, null); 
                        }
                        return originalInsertBefore.call(this, newNode, refNode);
                    } catch (e) {
                        console.warn('[Stremio Enhanced] Prevented React insertBefore crash');
                        return newNode;
                    }
                };

                Node.prototype.replaceChild = function(newChild, oldChild) {
                    try {
                        if (oldChild && oldChild.parentNode !== this) {
                            return originalInsertBefore.call(this, newChild, null);
                        }
                        return originalReplaceChild.call(this, newChild, oldChild);
                    } catch (e) {
                        console.warn('[Stremio Enhanced] Prevented React replaceChild crash');
                        return oldChild;
                    }
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
            toastContainer.innerHTML += template;

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
                const eventName = 'stremio-enhanced';
                const script = document.createElement('script');
                
                const handler = (data: Event) => {
                    script.remove();
                    resolve((data as CustomEvent).detail);
                };

                window.addEventListener(eventName, handler, { once: true });
                
                script.id = eventName;
                script.appendChild(
                    document.createTextNode(`
                        var core = window.services.core;
                        var result = ${js};
                
                        if (result instanceof Promise) {
                            result.then((awaitedResult) => {
                                window.dispatchEvent(new CustomEvent("${eventName}", { detail: awaitedResult }));
                            });
                        } else {
                            window.dispatchEvent(new CustomEvent("${eventName}", { detail: result }));
                        }
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

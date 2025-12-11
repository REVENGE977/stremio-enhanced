import { readFileSync } from "fs";
import { dialog, BrowserWindow } from "electron";
import logger from "./logger";
import { TIMEOUTS } from "../constants";

interface ParsedMetadata {
    [key: string]: string;
}

class Helpers {
    private static instance: Helpers;
    private mainWindow: BrowserWindow | null = null;
    
    private constructor() {}
    
    static getInstance(): Helpers {
        if (!Helpers.instance) {
            Helpers.instance = new Helpers();
        }
        return Helpers.instance;
    }
    
    setMainWindow(mainWindow: BrowserWindow): void {
        this.mainWindow = mainWindow;
    }

    /**
     * Parse metadata from a comment block in the format:
     * /** @key value *\/
     */
    private parseMetadataFromContent(content: string): ParsedMetadata | null {
        const commentBlockRegex = /\/\*\*([\s\S]*?)\*\//;
        const match = content.match(commentBlockRegex);
        
        if (!match?.[1]) {
            return null;
        }

        const metadata: ParsedMetadata = {};
        const metadataRegex = /@(\w+)\s+([^\n\r]+)/g;
        
        for (const [, key, value] of match[1].matchAll(metadataRegex)) {
            metadata[key.trim()] = value.trim();
        }
        
        return Object.keys(metadata).length > 0 ? metadata : null;
    }
    
    extractMetadataFromFile(filePath: string): ParsedMetadata | null {
        try {
            const fileContent = readFileSync(filePath, 'utf8');
            const metadata = this.parseMetadataFromContent(fileContent);
            
            if (!metadata) {
                logger.error('Metadata comments not found in the file: ' + filePath);
            }
            
            return metadata;
        } catch (error) {
            logger.error('Error reading the file: ' + (error as Error).message);
            return null;
        }
    }
    
    extractMetadataFromText(textContent: string): ParsedMetadata | null {
        const metadata = this.parseMetadataFromContent(textContent);
        
        if (!metadata) {
            logger.error('Comment block not found in the provided text');
        }
        
        return metadata;
    }
    
    async showAlert(
        alertType: 'info' | 'warning' | 'error', 
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
            const response = await dialog.showMessageBox(this.mainWindow!, options);
            return response.response;
        } catch (error) {
            logger.error('Error displaying alert: ' + (error as Error).message);
            return -1; 
        }
    }
    
    waitForElm(selector: string, timeout: number = TIMEOUTS.ELEMENT_WAIT): Promise<Element> {
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

    waitForElmByXPath(xpath: string, timeout: number = TIMEOUTS.ELEMENT_WAIT): Promise<Node> {
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

    waitForTitleChange(timeout: number = TIMEOUTS.ELEMENT_WAIT): Promise<string> {
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
     * Execute JavaScript in the context of Stremio's core services
     * @param js - JavaScript code to execute
     * @returns Promise with the result of the execution
     */
    public _eval(js: string): Promise<unknown> {
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

    public getElementByXpath(path: string): Node | null {
        return document.evaluate(
            path, 
            document, 
            null, 
            XPathResult.FIRST_ORDERED_NODE_TYPE, 
            null
        ).singleNodeValue;
    }

    public getFileNameFromUrl(url: string): string {
        const parts = url.split('/');
        return parts[parts.length - 1] || '';
    }

    public formatTime(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
    }

    /**
     * Compare two semantic version strings
     * @returns true if version1 > version2
     */
    public isNewerVersion(version1: string, version2: string): boolean {
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

const helpersInstance = Helpers.getInstance();

export default helpersInstance;

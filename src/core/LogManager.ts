export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

interface LogEntry {
    timestamp: string;
    level: LogLevel;
    message: string;
}

class LogManager {
    private static instance: LogManager;
    private logs: LogEntry[] = [];
    private maxLogs = 1000;
    private originalConsole: any = {};
    private isHooked = false;

    private constructor() {}

    public static getInstance(): LogManager {
        if (!LogManager.instance) {
            LogManager.instance = new LogManager();
        }
        return LogManager.instance;
    }

    public hookConsole(): void {
        if (this.isHooked) return;
        this.isHooked = true;

        const methods: LogLevel[] = ['INFO', 'WARN', 'ERROR', 'DEBUG'];

        methods.forEach(level => {
            const consoleMethod = level.toLowerCase() as keyof Console;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.originalConsole[consoleMethod] = (console as any)[consoleMethod].bind(console);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (console as any)[consoleMethod] = (...args: any[]) => {
                this.addLog(level, args.map(arg =>
                    typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
                ).join(' '));

                // Call original
                this.originalConsole[consoleMethod](...args);
            };
        });

        // Hook log as INFO
        this.originalConsole['log'] = console.log.bind(console);
        console.log = (...args: any[]) => {
            this.addLog('INFO', args.map(arg =>
                typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
            ).join(' '));
            this.originalConsole['log'](...args);
        }
    }

    public addLog(level: LogLevel, message: string): void {
        const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);
        this.logs.push({ timestamp, level, message });
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }
    }

    public showLogs(): void {
        const overlayId = 'stremio-enhanced-logs-overlay';
        if (document.getElementById(overlayId)) return;

        const overlay = document.createElement('div');
        overlay.id = overlayId;
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 99999;
            display: flex;
            flex-direction: column;
            padding: 20px;
            box-sizing: border-box;
            color: #fff;
            font-family: monospace;
        `;

        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            background: #1a1a1a;
            padding: 10px;
            border-radius: 5px;
        `;

        const title = document.createElement('h2');
        title.textContent = 'Logs';
        title.style.margin = '0';

        const controls = document.createElement('div');
        controls.style.display = 'flex';
        controls.style.gap = '10px';

        const filterSelect = document.createElement('select');
        filterSelect.style.cssText = `
            background: #333;
            color: white;
            border: 1px solid #555;
            padding: 5px;
            border-radius: 3px;
        `;
        ['ALL', 'INFO', 'WARN', 'ERROR'].forEach(level => {
            const option = document.createElement('option');
            option.value = level;
            option.textContent = level;
            filterSelect.appendChild(option);
        });

        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy All';
        copyBtn.style.cssText = `
            background: #4a4a4a;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
        `;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.style.cssText = `
            background: #c0392b;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            cursor: pointer;
        `;

        controls.appendChild(filterSelect);
        controls.appendChild(copyBtn);
        controls.appendChild(closeBtn);
        header.appendChild(title);
        header.appendChild(controls);

        const logsContainer = document.createElement('div');
        logsContainer.id = 'logs-container';
        logsContainer.style.cssText = `
            flex: 1;
            overflow-y: auto;
            background: #111;
            padding: 10px;
            border-radius: 5px;
            white-space: pre-wrap;
            word-break: break-all;
            font-size: 12px;
        `;

        overlay.appendChild(header);
        overlay.appendChild(logsContainer);
        document.body.appendChild(overlay);

        const renderLogs = () => {
            const filter = filterSelect.value;
            const filteredLogs = filter === 'ALL'
                ? this.logs
                : this.logs.filter(l => l.level === filter);

            logsContainer.innerHTML = filteredLogs.map(l => {
                const color = l.level === 'ERROR' ? '#ff5555' :
                              l.level === 'WARN' ? '#ffb86c' : '#50fa7b';
                return `<div style="margin-bottom: 2px;"><span style="color: #6272a4">[${l.timestamp}]</span> <span style="color: ${color}">[${l.level}]</span> ${this.escapeHtml(l.message)}</div>`;
            }).join('');
            logsContainer.scrollTop = logsContainer.scrollHeight;
        };

        renderLogs();

        filterSelect.addEventListener('change', renderLogs);

        copyBtn.addEventListener('click', () => {
            const text = this.logs.map(l => `[${l.timestamp}] [${l.level}] ${l.message}`).join('\n');
            const textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("Copy");
            textArea.remove();

            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => copyBtn.textContent = originalText, 2000);
        });

        closeBtn.addEventListener('click', () => {
            overlay.remove();
        });
    }

    private escapeHtml(unsafe: string): string {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }
}

export default LogManager.getInstance();

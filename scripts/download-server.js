const fs = require('fs');
const path = require('path');
const https = require('https');

const SERVER_JS_URL = "https://dl.strem.io/server/v4.20.12/desktop/server.js";
const DEST_DIR = path.join(__dirname, '../dist/nodejs');
const DEST_FILE = path.join(DEST_DIR, 'server.js');
const PACKAGE_JSON_FILE = path.join(DEST_DIR, 'package.json');
const WRAPPER_FILE = path.join(DEST_DIR, 'wrapper.js');

if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
}

console.log(`Downloading server.js from ${SERVER_JS_URL}...`);

const file = fs.createWriteStream(DEST_FILE);
https.get(SERVER_JS_URL, function(response) {
    if (response.statusCode !== 200) {
        console.error(`Failed to download server.js: Status Code ${response.statusCode}`);
        process.exit(1);
    }

    response.pipe(file);
    file.on('finish', function() {
        file.close(() => {
            console.log(`Successfully downloaded server.js to ${DEST_FILE}`);

            // Create wrapper.js
            const wrapperContent = `
const { getDataPath } = require('bridge');
const path = require('path');
const cp = require('child_process');
const EventEmitter = require('events');

// Set APP_PATH to a writable directory provided by the bridge
try {
    process.env.APP_PATH = getDataPath();
    console.log('APP_PATH set to:', process.env.APP_PATH);
} catch (e) {
    console.error('Failed to get data path:', e);
    // Fallback to tmpdir if bridge fails
    process.env.APP_PATH = require('os').tmpdir();
}

// Disable server auto-update
process.env.NO_UPDATE = '1';

// Set dummy paths for ffmpeg/ffprobe to satisfy existence checks
// /system/bin/true usually exists on Android and returns 0
process.env.FFMPEG_BIN = '/system/bin/true';
process.env.FFPROBE_BIN = '/system/bin/true';

// Mock child_process.spawn to prevent crashes if server tries to run ffmpeg
const originalSpawn = cp.spawn;
cp.spawn = function(command, args, options) {
    console.log('Intercepted spawn:', command, args);

    if (command.includes('ffmpeg') || command.includes('ffprobe') || command === process.env.FFMPEG_BIN) {
        console.log('Mocking ffmpeg/ffprobe execution');
        const mockProcess = new EventEmitter();
        mockProcess.stdout = new EventEmitter();
        mockProcess.stderr = new EventEmitter();
        mockProcess.kill = () => {};

        // Simulate immediate exit with success
        setTimeout(() => {
            mockProcess.emit('close', 0);
            mockProcess.emit('exit', 0);
        }, 10);

        return mockProcess;
    }

    return originalSpawn.apply(this, arguments);
};

// Start server
try {
    console.log('Starting Stremio Server...');
    require('./server.js');
} catch (e) {
    console.error("Failed to start server:", e);
}
`;
            fs.writeFileSync(WRAPPER_FILE, wrapperContent);
            console.log(`Created wrapper.js at ${WRAPPER_FILE}`);

            // Create package.json
            const packageJson = {
                "name": "stremio-server",
                "version": "1.0.0",
                "main": "wrapper.js",
                "dependencies": {}
            };
            fs.writeFileSync(PACKAGE_JSON_FILE, JSON.stringify(packageJson, null, 2));
            console.log(`Created package.json at ${PACKAGE_JSON_FILE}`);
        });
    });
}).on('error', function(err) {
    fs.unlink(DEST_FILE, () => {});
    console.error(`Error downloading server.js: ${err.message}`);
    process.exit(1);
});

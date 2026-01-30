const fs = require('fs');
const path = require('path');
const https = require('https');

const SERVER_JS_URL = "https://dl.strem.io/server/v4.20.12/desktop/server.js";
const DEST_DIR = path.join(__dirname, '../android/app/src/main/assets');
const DEST_FILE = path.join(DEST_DIR, 'server.js');

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
        });
    });
}).on('error', function(err) {
    fs.unlink(DEST_FILE, () => {});
    console.error(`Error downloading server.js: ${err.message}`);
    process.exit(1);
});

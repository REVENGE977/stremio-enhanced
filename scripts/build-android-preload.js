const esbuild = require('esbuild');
const path = require('path');

const run = async () => {
    try {
        await esbuild.build({
            entryPoints: ['src/android/preload.ts'],
            bundle: true,
            outfile: 'android/app/src/main/assets/preload.js',
            platform: 'browser',
            target: ['es2020'],
            external: ['electron'],
            sourcemap: 'inline',
            alias: {
                'path': require.resolve('path-browserify'),
            },
            loader: {
                '.html': 'text',
            },
            define: {
                '__dirname': '"/"',
                'process.platform': '"browser"',
                'process.env.APPDATA': '""',
            }
        });
        console.log('Android preload script built successfully');
    } catch (e) {
        console.error('Build failed', e);
        process.exit(1);
    }
};

run();

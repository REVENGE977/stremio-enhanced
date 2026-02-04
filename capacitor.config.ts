import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.revenge977.stremioenhanced',
  appName: 'StremioEnhanced',
  webDir: 'dist',
  server: {
    url: 'https://web.stremio.com',
    allowNavigation: ['web.stremio.com', '*.strem.io', '*.stremio.com']
  },
  android: {
    allowMixedContent: true
  },
  plugins: {
    CapacitorNodeJS: {
      nodeDir: "nodejs",
      startMode: "auto"
    }
  }
};

export default config;

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.gemini.gps.navigator',
  appName: 'Gemini GPS Navigator',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

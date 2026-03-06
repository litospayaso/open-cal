import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.brote.app',
  appName: 'Brote',
  webDir: 'gh-pages',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      backgroundColor: "#000000",
    },
  },
};

export default config;

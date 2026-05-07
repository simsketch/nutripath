import type { CapacitorConfig } from "@capacitor/cli";

const remoteUrl = process.env.CAPACITOR_SERVER_URL ?? "https://nutripath.vercel.app";

const config: CapacitorConfig = {
  appId: "com.nutripath.app",
  appName: "NutriPath",
  webDir: "public",
  server: {
    url: remoteUrl,
    cleartext: false,
  },
  ios: {
    contentInset: "automatic",
  },
};

export default config;

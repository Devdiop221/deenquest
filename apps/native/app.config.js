const IS_DEV = process.env.NODE_ENV === "development";
const IS_PREVIEW = process.env.NODE_ENV === "preview";

export default {
  expo: {
    name: IS_DEV ? "DeenQuest Dev" : "DeenQuest",
    slug: "deenquest",
    version: "1.0.0",
    scheme: "deenquest",
    description: "Islamic educational app with quizzes and stories",
    privacy: "public",
    platforms: ["ios", "android"],

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/favicon.png",
    },

    plugins: [
      "expo-router",
      "expo-secure-store",
      "expo-web-browser",
      "expo-font",
      "expo-av",
      "expo-audio",
      [
        "expo-navigation-bar",
        {
          position: "absolute",
          backgroundColor: "#015055",
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
      tsconfigPaths: true,
    },

    newArchEnabled: true,
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",

    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#F8FFFE",
    },

    assetBundlePatterns: ["**/*"],

    ios: {
      supportsTablet: true,
      bundleIdentifier: IS_DEV ? "com.deenquest.app.dev" : "com.deenquest.app",
      infoPlist: {
        UIBackgroundModes: ["audio"],
        NSAppTransportSecurity: {
          NSAllowsArbitraryLoads: IS_DEV,
        },
        CFBundleDisplayName: IS_DEV ? "DeenQuest Dev" : "DeenQuest",
      },
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#F8FFFE",
      },
      package: IS_DEV ? "com.deenquest.app.dev" : "com.deenquest.app",
      versionCode: 1,
      edgeToEdgeEnabled: true,
      permissions: [
        "INTERNET",
        "ACCESS_NETWORK_STATE",
        "RECORD_AUDIO",
        "MODIFY_AUDIO_SETTINGS",
      ],
    },

    extra: {
      eas: {
        projectId: "9f41f647-d9a1-4da0-9796-c5cdae706f8d",
      },
      serverUrl: process.env.EXPO_PUBLIC_SERVER_URL,
      authUrl: process.env.EXPO_PUBLIC_AUTH_URL,
      environment: process.env.NODE_ENV || "development",
    },

    owner: "devdiop",

    updates: process.env.EXPO_PROJECT_ID
      ? {
          url: `https://u.expo.dev/${process.env.EXPO_PROJECT_ID}`,
          requestHeaders: {
            "expo-channel-name": IS_DEV
              ? "development"
              : IS_PREVIEW
              ? "preview"
              : "production",
          },
        }
      : undefined,

    runtimeVersion: {
      policy: "sdkVersion",
    },
  },
};

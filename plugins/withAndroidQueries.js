const {
  withAndroidManifest,
  AndroidConfig,
} = require("@expo/config-plugins");

/**
 * Plugin para adicionar queries ao AndroidManifest.xml
 * Necessário para o Linking.canOpenURL() funcionar no Android 11+
 */
const withAndroidQueries = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;

    // Adiciona o elemento <queries> se não existir
    if (!androidManifest.manifest.queries) {
      androidManifest.manifest.queries = [];
    }

    // Adiciona o intent para o app Kotlin
    const queriesArray = androidManifest.manifest.queries;
    
    // Verifica se já existe para não duplicar
    const alreadyExists = queriesArray.some(
      (query) =>
        query.intent &&
        query.intent[0] &&
        query.intent[0].data &&
        query.intent[0].data[0] &&
        query.intent[0].data[0].$["android:scheme"] === "appkotlinmotoflow"
    );

    if (!alreadyExists) {
      queriesArray.push({
        intent: [
          {
            action: [{ $: { "android:name": "android.intent.action.VIEW" } }],
            data: [{ $: { "android:scheme": "appkotlinmotoflow" } }],
          },
        ],
      });
    }

    return config;
  });
};

module.exports = withAndroidQueries;

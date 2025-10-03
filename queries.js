// based on https://github.com/expo/config-plugins/issues/123#issuecomment-1746757954

const {
  withAndroidManifest,
  createRunOncePlugin,
} = require('expo/config-plugins')

const queries = {
  package: [{ $: { 'android:name': 'com.kraken.superwallet' } }],
}

/**
 * @param {import('@expo/config-plugins').ExportedConfig} config
 */
const withAndroidManifestService = config => {
  return withAndroidManifest(config, config => {
    config.modResults.manifest = {
      ...config.modResults.manifest,
      queries,
    }

    return config
  })
}

module.exports = createRunOncePlugin(
  withAndroidManifestService,
  'withAndroidManifestService',
  '1.0.0',
)

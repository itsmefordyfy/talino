const { withGradleProperties } = require('expo/config-plugins');

const JVM_ARGS = '-Xmx6g -XX:MaxMetaspaceSize=1g';

/**
 * Gives Gradle a bigger heap. R8 (minify, turned on through expo-build-properties so Play's DEX
 * optimization check passes) runs inside the Gradle daemon and fails with "Java heap space" on
 * the template's 2 GB. (As in CarMind and Ulamin.)
 */
module.exports = function withGradleMemory(config) {
  return withGradleProperties(config, (mod) => {
    const props = mod.modResults.filter((item) => !(item.type === 'property' && item.key === 'org.gradle.jvmargs'));
    props.push({ type: 'property', key: 'org.gradle.jvmargs', value: JVM_ARGS });
    mod.modResults = props;
    return mod;
  });
};

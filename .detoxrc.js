/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js'
    },
    jest: { setupTimeout: 120000 }
  },
  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath: 'ios/build/Build/Products/Debug-iphonesimulator/ExamplePercyDetox.app',
      build:
        'xcodebuild -workspace ios/ExamplePercyDetox.xcworkspace -scheme ExamplePercyDetox -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build'
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build:
        'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd ..',
      reversePorts: [8081]
    }
  },
  devices: {
    simulator: {
      type: 'ios.simulator',
      device: { type: 'iPhone 14 Pro' }
    },
    emulator: {
      type: 'android.emulator',
      device: { avdName: 'Pixel_7_API_34' }
    },
    'browserstack.android': {
      type: 'android.cloud',
      device: { udid: 'BROWSERSTACK' },
      cloudAuthentication: {
        username: process.env.BROWSERSTACK_USERNAME,
        accessKey: process.env.BROWSERSTACK_ACCESS_KEY
      },
      session: {
        server: 'wss://detox.browserstack.com/init',
        name: 'example-percy-detox',
        build: 'example-percy-detox-local',
        project: 'example-percy-detox'
      }
    }
  },
  configurations: {
    'ios.sim.debug': { device: 'simulator', app: 'ios.debug' },
    'android.emu.debug': { device: 'emulator', app: 'android.debug' },
    'android.cloud.debug': { device: 'browserstack.android', app: 'android.debug' }
  }
};

/** @type {Detox.DetoxConfig} */
module.exports = {
  logger: {
    level: process.env.CI ? 'debug' : undefined
  },
  testRunner: {
    args: {
      config: 'e2e/jest.config.js',
      maxWorkers: process.env.CI ? 1 : undefined,
      _: ['e2e']
    }
  },
  artifacts: {
    plugins: {
      log: process.env.CI ? 'failing' : undefined,
      screenshot: process.env.CI ? 'failing' : undefined
    }
  },
  apps: {
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      testBinaryPath:
        'android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk',
      build:
        'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug && cd ..',
      reversePorts: [8081]
    },
    'android.cloud': {
      type: 'android.cloud',
      // `app` and `appClient` are bs:// URLs injected by
      // scripts/write-cloud-config.js after upload to BrowserStack.
      app: process.env.BS_APP_URL || 'bs://PLACEHOLDER_APP',
      appClient: process.env.BS_TEST_URL || 'bs://PLACEHOLDER_TEST'
    }
  },
  devices: {
    emulator: {
      type: 'android.emulator',
      headless: Boolean(process.env.CI),
      gpuMode: process.env.CI ? 'off' : undefined,
      device: { avdName: 'Pixel_7_API_34' },
      reversePorts: [8081]
    },
    'browserstack.android': {
      type: 'android.cloud',
      device: { name: 'Samsung Galaxy S22 Ultra', osVersion: '12.0' }
    }
  },
  configurations: {
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug'
    },
    'android.cloud.debug': {
      device: 'browserstack.android',
      app: 'android.cloud',
      cloudAuthentication: {
        username: process.env.BROWSERSTACK_USERNAME,
        accessKey: process.env.BROWSERSTACK_ACCESS_KEY
      },
      session: {
        server: 'wss://detox.browserstack.com/init',
        name: process.env.BS_SESSION_NAME || 'example-percy-detox',
        build: process.env.BS_BUILD_NAME || 'example-percy-detox-local',
        project: 'example-percy-detox'
      }
    }
  }
};

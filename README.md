# example-percy-detox

A minimal React Native + Detox **todo** app wired to [`@percy/detox`](https://www.npmjs.com/package/@percy/detox) for visual regression testing.

## What's here

```
.
├── App.tsx                       # RN todo UI with testIDs on every element
├── index.js                      # RN entry
├── app.json                      # RN app metadata
├── .detoxrc.js                   # Detox config — iOS sim, Android emu, BrowserStack Android cloud
├── e2e/
│   ├── jest.config.js            # Jest config for Detox runner
│   └── todo.e2e.js               # Percy + Detox tests (device + element screenshots)
├── scripts/
│   └── smoke-e2e.js              # Headless smoke (no simulator needed)
└── .github/workflows/            # CI: lint, Detox matrix, Semgrep, smoke
```

## Prerequisites

- Node ≥ 18
- Xcode (for iOS) / Android Studio + Pixel 7 API 34 AVD (for Android)
- `detox-cli` installed globally: `npm i -g detox-cli`
- A Percy **App-type** project and its `PERCY_TOKEN`

## Run the Detox E2E test locally

### iOS simulator

```sh
npm install
npm run test:e2e:build:ios
export PERCY_TOKEN=<your app-project token>
percy app:exec -- npm run test:e2e:ios
```

### Android emulator

```sh
npm install
npm run test:e2e:build:android
export PERCY_TOKEN=<your app-project token>
percy app:exec -- npm run test:e2e:android
```

### BrowserStack App Automate (Android only)

Upload your `app-debug.apk` and `app-debug-androidTest.apk` to BrowserStack, set
`BROWSERSTACK_USERNAME`, `BROWSERSTACK_ACCESS_KEY`, and `PERCY_TOKEN`, then:

```sh
percy app:exec -- detox test --configuration android.cloud.debug
```

Percy links builds to the BrowserStack session via the `getSessionId` callback —
see `@percy/detox` README for wiring.

## Run the headless smoke (no simulator / no real Detox runtime)

```sh
npm install
export PERCY_TOKEN=<your app-project token>
npm run smoke                    # baseline
PERCY_VARIANT=diff npm run smoke # diff to compare against baseline
```

The headless smoke uses a pure-Node PNG generator and a duck-typed device shape
to exercise the full `@percy/detox` upload path without needing a simulator.

## What the example demonstrates

- **Device screenshots**: `percyScreenshot(device, 'Home | fresh')`
- **Element screenshots**: `percyScreenshot(element(by.id('todo-composer')), 'Element | composer')`
- **Ignore regions via testID**: `{ ignoreRegionIds: ['home-header'] }`
- **Test grouping**: `{ testCase: 'todo-example' }`
- **BrowserStack Detox cloud integration** (Android-only, via `.detoxrc.js` cloud device profile)

## License

MIT

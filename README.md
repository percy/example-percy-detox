# example-percy-detox

Real React Native + Detox example wired to [`@percy/detox`](https://www.npmjs.com/package/@percy/detox) for visual regression testing.

Based on a clean `@react-native-community/cli init --version 0.74.5` scaffold with Detox 20.38 patched for BrowserStack cloud (`npm:@browserstack/detox`). The app is a small welcome → hello/world/goodbye flow with `testID`s on every interactive element.

## Percy capture points

| Spec | Snapshot |
|---|---|
| `e2e/suite1.test.ts` | `Welcome screen` (device) |
| `e2e/suite1.test.ts` | `Hello state` (device) |
| `e2e/suite1.test.ts` | `Element \| welcome` (element-level) |
| `e2e/suite2.test.ts` | `Goodbye state` (device, with `ignoreRegionIds`) |

## Prerequisites

- Node 20, JDK 17, Android SDK 34 + build-tools 34.0.0, `watchman`
- `detox-cli` globally: `npm i -g detox-cli`
- A Percy **App-type** project token (`app_...`)

## Run locally on an Android emulator (recommended for development)

This path exercises `@percy/detox` end-to-end against a real Detox runtime with working `device.takeScreenshot`.

```sh
npm install --legacy-peer-deps
npm run build:android
export PERCY_TOKEN=<your app token>
percy app:exec -- npm run test:android
```

Requires an AVD named `Pixel_7_API_34` (adjust `detox.config.js` `devices.emulator.device.avdName` to match what you have).

## Run on BrowserStack App Automate (Detox Android)

> **⚠️ Known BrowserStack limitation (as of April 2026):**
> BrowserStack's cloud Detox driver (`@browserstack/detox@20.38.0-cloud.1`) ships a **stub** implementation of `device.takeScreenshot` that always returns an empty string — see `node_modules/detox/src/devices/runtime/drivers/android/cloud/cloudAndroidDriver.js:101`. No `browserstack_executor`-style fallback is exposed server-side either. Until BrowserStack implements on-demand screenshot capture in their cloud driver, `@percy/detox` cannot capture mid-test screenshots on BS cloud. This repo's `android.cloud.debug` config + CI workflow are wired correctly — they'll start producing Percy builds automatically once BS adds the driver support.

Full BS cloud flow (works end-to-end except the takeScreenshot step):

```sh
# 1. Build real APKs locally
npm install --legacy-peer-deps
npm run build:android

# 2. Set credentials
source ~/.zshrc && app-t   # exports PERCY_TOKEN (your app-t zsh fn)
export BROWSERSTACK_USERNAME=<...>
export BROWSERSTACK_ACCESS_KEY=<...>

# 3. Upload both APKs to BS's Detox-specific endpoints
bash scripts/upload-apk-to-browserstack.sh
# → exports BS_APP_URL, BS_TEST_URL as bs:// URIs

# 4. Generate cloud config with those URIs baked in
node scripts/write-cloud-config.js

# 5. Run
npx percy app:exec -- \
  npx detox test --configuration android.cloud.debug \
    --config-path ./detox.config.cloud.js --headless
```

### CI

`.github/workflows/detox-bs-android.yml` automates steps 1–5. Set these repo secrets:
- `PERCY_TOKEN` (App-project)
- `BROWSERSTACK_USERNAME`, `BROWSERSTACK_ACCESS_KEY`

Trigger via `Actions` tab → `Run workflow`.

## What actually works on BS cloud today

| Stage | Status |
|---|---|
| APK build (gradle assembleDebug + assembleAndroidTest) | ✅ |
| APK upload to BS `/app-automate/detox/v2/android/app` | ✅ |
| Test APK upload to `/detox/v2/android/app-client` | ✅ |
| `.detoxrc.js` cloud config → BS WebSocket handshake | ✅ |
| `device.launchApp` on real BS Android device | ✅ |
| Detox element matchers / tap / expect | ✅ |
| `device.takeScreenshot()` returning a readable PNG path | ❌ BS driver limitation |

The first five rows constitute the complete integration path. The sixth is a gap in BS's patched Detox, not in `@percy/detox`. The SDK itself is validated against real Detox via the local emulator path.

## Why Android only

Detox does not currently support BrowserStack real iOS devices ([wix/Detox#4694](https://github.com/wix/Detox/issues/4694)). iOS Detox tests can only run on local simulators.

## Android build notes (for maintainers)

Key patches applied on top of the stock RN 0.74.5 scaffold to support Detox + BS cloud:

- `minSdkVersion: 24` (Detox requires ≥ 24)
- `testBuildType 'debug'`, `testInstrumentationRunner 'androidx.test.runner.AndroidJUnitRunner'`
- `missingDimensionStrategy 'detox', 'full'` (Detox ships `coreNative` + `full` flavors)
- `debuggableVariants = []` in `react { }` block so the debug APK bundles JS (BS devices can't reach local metro)
- `include ':detox'` + `project(':detox').projectDir = ...node_modules/detox/android/detox` in `settings.gradle`
- Kotlin opt-in `-opt-in=kotlin.ExperimentalStdlibApi` on the `:detox` subproject
- `android/app/src/androidTest/AndroidManifest.xml` to force `android:exported=true` on androidx.test's `InstrumentationActivityInvoker*` activities
- `DetoxTest.java` in `androidTest/java/com/percydetoxapp/` as the Detox runner entry

## Known issues / SDK-level notes

- `element.takeScreenshot` misses TextureView, GLSurfaceView, Skia canvases on Android ([wix/Detox#4489](https://github.com/wix/Detox/issues/4489)). Use `device.takeScreenshot` for these.
- `atIndex(n).getAttributes()` silently ignored on iOS ([wix/Detox#4633](https://github.com/wix/Detox/issues/4633)); `@percy/detox` handles the `.elements` multi-match defensively.
- Detox tmp-file lifetime: `@percy/detox` copies Detox's returned PNG to an SDK-owned tmp path immediately to avoid races with Detox's artifact cleanup ([wix/Detox#3311](https://github.com/wix/Detox/issues/3311), [#4824](https://github.com/wix/Detox/issues/4824)).

## License

MIT

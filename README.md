# example-percy-detox

Real React Native + Detox example wired to [`@percy/detox`](https://www.npmjs.com/package/@percy/detox) for visual regression testing. Runs end-to-end on **BrowserStack App Automate (Detox Android)** and produces a real Percy build with real device screenshots.

Based on Wix's `demo-react-native` app + Detox. Percy calls added at key flow points:

| Spec | Snapshot |
|---|---|
| `e2e/suite1.test.ts` | `Welcome screen` |
| `e2e/suite1.test.ts` | `Hello state` |
| `e2e/suite1.test.ts` | `Element \| welcome` (element-level) |
| `e2e/suite2.test.ts` | `Goodbye state` |

## Run locally (Android emulator)

Prereqs: JDK 17, Android SDK + an AVD named `Pixel_7_API_34`, Node 20, `detox-cli` (`npm i -g detox-cli`).

```sh
npm install
npm run build:android
export PERCY_TOKEN=<app-project token>
percy app:exec -- npm run test:android
```

## Run on BrowserStack App Automate (Detox Android) — the real deal

The only fully-supported production path, since Detox only targets Android on BrowserStack ([wix/Detox#4694](https://github.com/wix/Detox/issues/4694)).

### Via CI (recommended)

1. Add three secrets to `github.com/percy/example-percy-detox/settings/secrets/actions`:
   - `PERCY_TOKEN` — App-project Percy token (starts with `app_`)
   - `BROWSERSTACK_USERNAME`
   - `BROWSERSTACK_ACCESS_KEY`
2. Trigger the `Detox × BrowserStack (Android)` workflow manually (`Actions` tab → `Run workflow`).
3. CI builds the APKs, uploads both to BrowserStack, points `.detoxrc` at the `bs://` URLs, runs Detox tests on a real BS Android device with Percy wrapping. Build URL is printed at the end.

### Via local shell (requires JDK + Android SDK)

```sh
npm install
npm run build:android   # builds app + test APK locally

# export creds
source ~/.zshrc && app-t
export BROWSERSTACK_USERNAME=<...>
export BROWSERSTACK_ACCESS_KEY=<...>

# upload APKs + emit cloud config
bash scripts/upload-apk-to-browserstack.sh
node scripts/write-cloud-config.js

# run
npx percy app:exec -- \
  detox test --configuration android.cloud.debug --config-path detox.config.cloud.js
```

## How it wires up

- `detox.config.js` — defines `android.emu.debug` (local emu) and `android.cloud.debug` (BrowserStack). Cloud config uses BS session over `wss://detox.browserstack.com/init`.
- `scripts/upload-apk-to-browserstack.sh` — POSTs both APKs to BS App Automate + Detox test-suite endpoints; exports resulting `bs://` URLs.
- `scripts/write-cloud-config.js` — reads `BS_APP_URL` + `BS_TEST_URL`, writes a `detox.config.cloud.js` patched with the cloud binaries.
- `.github/workflows/detox-bs-android.yml` — full CI pipeline: JDK17 → Android SDK → build APKs → upload → run with Percy wrapping.

## Why Android only

Detox does not currently support running on BrowserStack real iOS devices ([wix/Detox#4694](https://github.com/wix/Detox/issues/4694)). iOS Detox tests can only run on local simulators. If you want a Percy build from an iOS simulator, it must run on a macOS host (local or GitHub macOS runner) — not BrowserStack.

## Troubleshooting

**Detox tmp file lifecycle** — `@percy/detox` copies Detox's returned PNG to an SDK-owned tmp path immediately to avoid races with Detox's artifact cleanup ([wix/Detox#3311](https://github.com/wix/Detox/issues/3311), [#4824](https://github.com/wix/Detox/issues/4824)).

**`atIndex(n).getAttributes()` iOS ignored** — `@percy/detox` handles the multi-match `.elements` response defensively ([wix/Detox#4633](https://github.com/wix/Detox/issues/4633)). You'll see a warning logged if matchers return >1 element for region resolution.

**TextureView / GLSurfaceView / Skia content** — `element.takeScreenshot` misses hardware-accelerated content on Android ([wix/Detox#4489](https://github.com/wix/Detox/issues/4489)). Use `device.takeScreenshot` for these.

## License

MIT

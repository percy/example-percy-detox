#!/usr/bin/env bash
# Upload the app APK and Detox test APK to BrowserStack App Automate and
# emit a `.detoxrc.cloud.json` override that references the returned bs://
# URLs. Called from CI after `detox build --configuration android.emu.debug`.
#
# Requires: BROWSERSTACK_USERNAME, BROWSERSTACK_ACCESS_KEY
set -euo pipefail

: "${BROWSERSTACK_USERNAME:?must be set}"
: "${BROWSERSTACK_ACCESS_KEY:?must be set}"

APP_APK="android/app/build/outputs/apk/debug/app-debug.apk"
TEST_APK="android/app/build/outputs/apk/androidTest/debug/app-debug-androidTest.apk"

if [[ ! -f "$APP_APK" ]]; then
  echo "App APK not found at $APP_APK" >&2
  exit 1
fi
if [[ ! -f "$TEST_APK" ]]; then
  echo "Test APK not found at $TEST_APK" >&2
  exit 1
fi

upload() {
  local endpoint="$1"
  local file="$2"
  local label="$3"
  echo "Uploading $label ($file) → $endpoint ..." >&2
  curl --silent --show-error --fail \
    -u "${BROWSERSTACK_USERNAME}:${BROWSERSTACK_ACCESS_KEY}" \
    -F "file=@${file}" \
    "$endpoint"
}

APP_JSON=$(upload "https://api-cloud.browserstack.com/app-automate/upload" "$APP_APK" "app APK")
TEST_JSON=$(upload "https://api-cloud.browserstack.com/app-automate/upload" "$TEST_APK" "Detox test APK")

APP_URL=$(printf '%s' "$APP_JSON" | python3 -c "import sys, json; print(json.load(sys.stdin)['app_url'])")
TEST_URL=$(printf '%s' "$TEST_JSON" | python3 -c "import sys, json; print(json.load(sys.stdin)['app_url'])")

echo "APP_URL=$APP_URL"
echo "TEST_URL=$TEST_URL"

# Emit env values for subsequent CI steps
{
  echo "BS_APP_URL=$APP_URL"
  echo "BS_TEST_URL=$TEST_URL"
} >> "${GITHUB_ENV:-/dev/stdout}"

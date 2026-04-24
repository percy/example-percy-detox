#!/usr/bin/env bash
# Upload the app APK and Detox test APK to BrowserStack App Automate via
# the dedicated Detox v2 endpoints, and emit bs:// URLs that can be used in
# `.detoxrc.js`'s `android.cloud` app config (`app` + `appClient`).
#
# Endpoints (per BS Detox REST API v2):
#   app APK: POST https://api-cloud.browserstack.com/app-automate/detox/v2/android/app
#   test APK: POST https://api-cloud.browserstack.com/app-automate/detox/v2/android/app-client
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

APP_JSON=$(upload "https://api-cloud.browserstack.com/app-automate/detox/v2/android/app" "$APP_APK" "app APK")
TEST_JSON=$(upload "https://api-cloud.browserstack.com/app-automate/detox/v2/android/app-client" "$TEST_APK" "Detox test APK")

APP_URL=$(printf '%s' "$APP_JSON" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('app_url') or d.get('url'))")
TEST_URL=$(printf '%s' "$TEST_JSON" | python3 -c "import sys, json; d=json.load(sys.stdin); print(d.get('app_client_url') or d.get('app_url') or d.get('url'))")

echo "APP_URL=$APP_URL"
echo "TEST_URL=$TEST_URL"

{
  echo "BS_APP_URL=$APP_URL"
  echo "BS_TEST_URL=$TEST_URL"
} >> "${GITHUB_ENV:-/dev/stdout}"

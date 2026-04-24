import { by, device, element, expect } from 'detox';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const percyScreenshot = require('@percy/detox');

describe('Percy × Detox — welcome flow', () => {
  // Note: setup.ts already launches the app in its beforeAll.
  // Avoid double-launch to prevent "multiple simultaneous interactions" errors.

  it('welcome screen renders', async () => {
    await expect(element(by.id('welcome'))).toBeVisible();
    await percyScreenshot(device, 'Welcome screen', {
      testCase: 'suite1'
    });
  });

  it('shows Hello after tapping hello_button', async () => {
    await element(by.id('hello_button')).tap();
    await expect(element(by.text('Hello!!!'))).toBeVisible();
    await percyScreenshot(device, 'Hello state', {
      testCase: 'suite1'
    });
  });

  it('element-level screenshot of welcome view', async () => {
    await device.reloadReactNative();
    const welcome = element(by.id('welcome'));
    await expect(welcome).toBeVisible();
    await percyScreenshot(welcome, 'Element | welcome', {
      testCase: 'suite1'
    });
  });
});

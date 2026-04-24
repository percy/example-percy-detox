import { by, device, element, expect } from 'detox';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const percyScreenshot = require('@percy/detox');

describe('Percy × Detox — goodbye flow', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('shows Goodbye after tapping goodbye_button', async () => {
    await element(by.id('goodbye_button')).tap();
    await expect(element(by.text('Goodbye, World!!!'))).toBeVisible();
    await percyScreenshot(device, 'Goodbye state', {
      testCase: 'suite2',
      ignoreRegionIds: ['welcome']
    });
  });
});

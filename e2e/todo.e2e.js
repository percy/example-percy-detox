/* eslint-env detox/detox, jest */
const percyScreenshot = require('@percy/detox');

describe('Percy × Detox — Todo example', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('Home — fresh state', async () => {
    await expect(element(by.id('home-screen'))).toBeVisible();
    await percyScreenshot(device, 'Home | fresh', {
      testCase: 'todo-example'
    });
  });

  it('Home — after adding a todo', async () => {
    await element(by.id('todo-input')).typeText('Ship the Detox SDK');
    await element(by.id('todo-add-btn')).tap();
    await percyScreenshot(device, 'Home | after add', {
      testCase: 'todo-example'
    });
  });

  it('Home — first todo completed (toggle)', async () => {
    await element(by.id('todo-item-1')).tap();
    await percyScreenshot(device, 'Home | one completed', {
      testCase: 'todo-example',
      // mask the dynamic timestamp header if any
      ignoreRegionIds: ['home-header']
    });
  });

  it('Element screenshot — composer only', async () => {
    const composer = element(by.id('todo-composer'));
    await percyScreenshot(composer, 'Element | composer', {
      testCase: 'todo-example'
    });
  });
});

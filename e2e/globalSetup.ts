import { globalSetup } from 'detox/runners/jest';

export default async function customGlobalSetup() {
  await globalSetup();
}

module.exports = customGlobalSetup;

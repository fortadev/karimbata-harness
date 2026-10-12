import { describe, expect, it } from 'vitest'
import { windowsCiSettings } from '../scripts/prepare-windows-ci.mjs'

const inputs = {
  PACKAGE_BUILD_VERSION: 'auto',
  GITHUB_RUN_NUMBER: '42',
  GITHUB_RUN_ATTEMPT: '2',
}
const productVersion = '0.2.1-alpha.1'
const now = new Date('2026-10-08T23:59:59Z')

describe('manual Windows package inputs', () => {
  it('numbers fresh runners and reruns without storage credentials', () => {
    const result = windowsCiSettings(inputs, productVersion, now)
    expect(result.version).toBe('0.2.1-alpha.1.20261008.42.2')
  })

  it('accepts an explicit version without a GitHub run identity', () => {
    const result = windowsCiSettings({ ...inputs, PACKAGE_BUILD_VERSION: '0.2.1-alpha.1.20261008.7',
      GITHUB_RUN_NUMBER: undefined, GITHUB_RUN_ATTEMPT: undefined }, productVersion, now)
    expect(result.version).toBe('0.2.1-alpha.1.20261008.7')
  })

  it('uses the stable product test prefix without deployment settings', () => {
    const result = windowsCiSettings(inputs, '0.2.1', now)
    expect(result.version).toBe('0.2.1-test.20261008.42.2')
  })

  it.each([
    { PACKAGE_BUILD_VERSION: '' },
    { PACKAGE_BUILD_VERSION: '0.3.0' },
    { GITHUB_RUN_NUMBER: '0' },
    { GITHUB_RUN_ATTEMPT: '1\nINJECTED=value' },
  ])('rejects invalid manual settings %j', (override) => {
    expect(() => windowsCiSettings({ ...inputs, ...override }, productVersion, now)).toThrow()
  })
})

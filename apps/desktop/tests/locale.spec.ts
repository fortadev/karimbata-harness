import { describe, expect, it } from 'vitest'
import { en, es, formatDesktopMessage, resolveDesktopLocale, resolveDesktopStartupLocale, zh } from '../src/locale.ts'

describe('desktop locale dictionaries', () => {
  it('ships the same key set in English, Chinese, and Spanish', () => {
    expect(Object.keys(zh)).toEqual(Object.keys(en))
    expect(Object.keys(es)).toEqual(Object.keys(en))
    expect(resolveDesktopLocale('zh-Hans-CN').messages).toEqual(zh)
    expect(resolveDesktopLocale('en-US').messages).toEqual(en)
    expect(resolveDesktopLocale('fr-FR').messages).toEqual(en)
    expect(resolveDesktopLocale('es-PY')).toEqual({ id: 'es-419', messages: es })
    expect(resolveDesktopLocale('es-MX').messages).toEqual(es)
  })

  it('formats named values without consuming unknown placeholders', () => {
    expect(formatDesktopMessage('{name}@{version} {missing}', { name: 'plugin', version: '1.2.3' }))
      .toBe('plugin@1.2.3 {missing}')
  })

  it('prefers an explicit supported choice, then the first supported system language', () => {
    expect(resolveDesktopStartupLocale('zh', ['en-US']).id).toBe('zh-CN')
    expect(resolveDesktopStartupLocale('EN', ['zh-CN']).id).toBe('en')
    expect(resolveDesktopStartupLocale(null, ['ja-JP', 'zh-Hant', 'en-US']).id).toBe('zh-CN')
    expect(resolveDesktopStartupLocale(null, ['en-US', 'zh-CN']).id).toBe('en')
    expect(resolveDesktopStartupLocale(null, ['ja-JP']).id).toBe('en')
    expect(resolveDesktopStartupLocale(null, []).id).toBe('en')
    expect(resolveDesktopStartupLocale('ja', ['zh-CN']).id).toBe('zh-CN')
    expect(resolveDesktopStartupLocale('es-419', ['en-US']).id).toBe('es-419')
    expect(resolveDesktopStartupLocale('ES-419', ['zh-CN']).id).toBe('es-419')
    expect(resolveDesktopStartupLocale(null, ['es-PY', 'en-US']).id).toBe('es-419')
    expect(resolveDesktopStartupLocale(null, ['ja-JP', 'es-MX']).id).toBe('es-419')
    expect(resolveDesktopStartupLocale('en', ['es-PY']).id).toBe('en')
  })

})

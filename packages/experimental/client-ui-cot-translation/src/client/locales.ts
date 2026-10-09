/** Locale-owned copy for reasoning translation and its preferences. */
import type { SettingsFormLabels } from '@deepseek-ai/dsh-client-ui-primitives'

/** Dictionary namespace for this plugin. */
export const NS = 'cotTranslation'

/** English copy and key source. */
export const en = {
  provider: 'Translation service', google: 'Google', bing: 'Bing',
  deepseekAccount: 'DeepSeek Flash — Account (paid)', deepseekOfficial: 'DeepSeek Flash — Official API (paid)',
  providerUnavailableOption: '{provider} — unavailable',
  providerUnavailable: 'This provider is unavailable. Configure your DeepSeek account or Official API provider, or choose an available service.',
  paidNotice: 'Each uncached fragment sends a separate paid DeepSeek Flash request through the selected account or Official API credentials. Reopening reasoning reuses saved results; changing the provider, language, source text, or request settings may send a new paid request.',
  anonymousNotice: 'Bing and Google need no translation login or API key. Their anonymous endpoints may reject or limit requests.', targetLanguage: 'Target language',
  targetLanguageHint: 'auto follows the UI language; language codes such as zh, en, and ja also work.',
  privacy: 'Expanded reasoning is sent to the selected service. It may contain private code or conversation details.',
  translation: 'View translation', original: 'View original', retry: 'Retry', failed: 'Translation failed. Showing the original.',
  translating: 'Translating reasoning', invalidProvider: 'Choose a translation service.', invalidLanguage: 'Enter auto or a language code, such as zh, en, or ja.',
  overridden: 'Overridden', reset: 'Reset to default',
  unavailable: 'Translation preferences are unavailable.', readOnly: 'This deployment stores settings read-only.',
  saveFailed: 'The deployment did not accept these values; they were left for you to correct.', save: 'Save', saving: 'Saving…',
  copy: 'Copy', copied: 'Copied', codeTitle: 'Code block', wrap: 'Wrap lines', unwrap: 'Unwrap lines', footnotes: 'Footnotes',
}

/** Latin American Spanish dictionary, checked against the English key set. */
export const es = {
  'provider': 'Servicio de traducción',
  'google': 'Google',
  'bing': 'Bing',
  'deepseekAccount': 'DeepSeek Flash — cuenta (de pago)',
  'deepseekOfficial': 'DeepSeek Flash — API oficial (de pago)',
  'providerUnavailableOption': '{provider} — no disponible',
  'providerUnavailable': 'Este proveedor no está disponible. Configura tu cuenta de DeepSeek o el proveedor de la API oficial, o elige un servicio disponible.',
  'paidNotice': 'Cada fragmento sin caché envía una solicitud de pago independiente a DeepSeek Flash usando la cuenta o las credenciales de la API oficial seleccionadas. Al volver a abrir el razonamiento se reutilizan los resultados guardados; cambiar el proveedor, idioma, texto de origen o configuración de solicitudes puede enviar una solicitud de pago nueva.',
  'anonymousNotice': 'Bing y Google no requieren iniciar sesión ni una clave API para traducir. Sus destinos anónimos pueden rechazar o limitar solicitudes.',
  'targetLanguage': 'Idioma de destino',
  'targetLanguageHint': 'auto sigue el idioma de la interfaz; también funcionan códigos como zh, en y es.',
  'privacy': 'El razonamiento expandido se envía al servicio seleccionado. Puede contener código privado o detalles de la conversación.',
  'translation': 'Ver traducción',
  'original': 'Ver original',
  'retry': 'Reintentar',
  'failed': 'La traducción falló. Se muestra el original.',
  'translating': 'Traduciendo razonamiento',
  'invalidProvider': 'Elige un servicio de traducción.',
  'invalidLanguage': 'Ingresa auto o un código de idioma, como zh, en o es.',
  'overridden': 'Reemplazado',
  'reset': 'Restablecer valor predeterminado',
  'unavailable': 'Las preferencias de traducción no están disponibles.',
  'readOnly': 'Esta implementación guarda la configuración en modo de solo lectura.',
  'saveFailed': 'La implementación no aceptó estos valores; se conservaron para que puedas corregirlos.',
  'save': 'Guardar',
  'saving': 'Guardando…',
  'copy': 'Copiar',
  'copied': 'Copiado',
  'codeTitle': 'Bloque de código',
  'wrap': 'Ajustar líneas',
  'unwrap': 'Quitar ajuste de líneas',
  'footnotes': 'Notas al pie',
} satisfies Record<keyof typeof en, string>

/** Locale dictionary key union. */
export type CotTranslationKey = keyof typeof en

/** Chinese copy. */
export const zh: Record<CotTranslationKey, string> = {
  provider: '翻译服务', google: 'Google', bing: 'Bing',
  deepseekAccount: 'DeepSeek Flash · 账号（付费）', deepseekOfficial: 'DeepSeek Flash · 官方 API（付费）',
  providerUnavailableOption: '{provider} — 不可用',
  providerUnavailable: '此服务暂不可用，请配置 DeepSeek 账号或官方 API 服务，或选择可用的翻译服务',
  paidNotice: '每个未缓存片段都会通过所选账号或官方 API 凭据单独发送一次付费的 DeepSeek Flash 请求；重新展开会复用已保存的译文，更改服务、语言、原文或请求设置可能发送新的付费请求',
  anonymousNotice: 'Bing 和 Google 翻译无需额外登录或 API key，但匿名接口可能拒绝或限制请求', targetLanguage: '目标语言',
  targetLanguageHint: 'auto 使用界面语言；也可填写语言代码，例如 zh、en、ja',
  privacy: '展开的思考内容会发送给所选翻译服务，可能包含私有代码或对话细节。',
  translation: '查看译文', original: '查看原文', retry: '重试', failed: '翻译暂不可用，已显示原文',
  translating: '正在翻译思考内容', invalidProvider: '请选择翻译服务', invalidLanguage: '请填写 auto 或语言代码，例如 zh、en、ja',
  overridden: '已覆盖', reset: '恢复默认',
  unavailable: '翻译设置暂不可用', readOnly: '本部署的设置为只读',
  saveFailed: '本部署没有接受这些值，已保留供你修改', save: '保存', saving: '保存中…',
  copy: '复制', copied: '已复制', codeTitle: '代码块', wrap: '自动换行', unwrap: '不换行', footnotes: '脚注',
}

/**
 * Read shared form chrome from the plugin dictionary.
 * @param t - current locale reader.
 * @returns localized form labels.
 */
export function formLabels(t: (key: CotTranslationKey) => string): SettingsFormLabels {
  return { unavailable: t('unavailable'), readOnly: t('readOnly'), saveFailed: t('saveFailed'), save: t('save'), saving: t('saving') }
}

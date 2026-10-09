/** Localized labels for the NodeJS Inspector bottom panel and command. */
export const zh = {
  title: 'NodeJS 诊断',
  toggle: '展开或收起 NodeJS 诊断',
  close: '收起',
  resize: '调整 NodeJS 诊断面板高度',
  frameTitle: 'NodeJS 诊断',
}

/** English labels checked against the bottom-panel dictionary. */
export const en: Record<keyof typeof zh, string> = {
  title: 'NodeJS Inspector',
  toggle: 'Toggle NodeJS Inspector',
  close: 'Collapse',
  resize: 'Resize NodeJS Inspector panel',
  frameTitle: 'NodeJS Inspector',
}

/** Latin American Spanish dictionary, checked against the English key set. */
export const es = {
  'title': 'Inspector de NodeJS',
  'toggle': 'Mostrar u ocultar inspector de NodeJS',
  'close': 'Contraer',
  'resize': 'Cambiar tamaño del panel del inspector de NodeJS',
  'frameTitle': 'Inspector de NodeJS',
} satisfies Record<keyof typeof en, string>

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Shared Inspector frontend copy. */
    inspectorPanel: keyof typeof zh
  }
}

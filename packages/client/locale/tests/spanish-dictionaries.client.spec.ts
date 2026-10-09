/** Shipped Spanish copy retains the source keys and interpolation variables. */
import { describe, expect, it } from 'vitest'
import { en as source0 } from '../src/locales/en.ts'
import { es as translated0 } from '../src/locales/es.ts'
import { en as source1, es as translated1 } from '../src/locales/settings.ts'
import { guideEn as source2, guideEs as translated2 } from '../../ui-agent-preset/src/client/guide-locales.ts'
import { en as source3, es as translated3 } from '../../ui-agent-preset/src/client/locales.ts'
import { en as source4, es as translated4 } from '../../ui-approval/src/client/locales.ts'
import { en as source5, es as translated5 } from '../../ui-chat/src/client/locale.ts'
import { en as source6, es as translated6 } from '../../ui-commands/src/client/locales.ts'
import { en as source7, es as translated7 } from '../../ui-conversation/src/client/locales.ts'
import { en as source8, es as translated8 } from '../../ui-deliverables/src/client/locales.ts'
import { en as source9, es as translated9 } from '../../ui-goal/src/client/locales.ts'
import { en as source10, es as translated10 } from '../../ui-input-trigger/src/client/locales.ts'
import { en as source11, es as translated11 } from '../../ui-jobs/src/client/locales.ts'
import { en as source12, es as translated12 } from '../../ui-layout/src/client/shortcut-locales.ts'
import { en as source13, es as translated13 } from '../../ui-message-feedback/src/client/locales.ts'
import { en as source14, es as translated14 } from '../../ui-model-selection/src/client/locales.ts'
import { en as source15, es as translated15 } from '../../ui-open-in-app/src/client/locales.ts'
import { en as source16, es as translated16 } from '../../ui-permission-presets/src/client/locales.ts'
import { accessEn as source17, accessEs as translated17 } from '../../ui-permission-presets/src/client/locales.ts'
import { en as source18, es as translated18 } from '../../ui-plan/src/client/locales.ts'
import { en as source19, es as translated19 } from '../../ui-plugin-manager/src/client/locales.ts'
import { en as source20, es as translated20 } from '../../ui-reference/src/client/locales.ts'
import { frequencyEn as source21, frequencyEs as translated21 } from '../../ui-schedule/src/client/frequency-locales.ts'
import { en as source22, es as translated22 } from '../../ui-schedule/src/client/locales.ts'
import { en as source23, es as translated23 } from '../../ui-schedule/src/client/task-manager-locales.ts'
import { onboardingEnglishCopy as source24, onboardingSpanishCopy as translated24 } from '../../ui-settings-account/src/client/locales/onboarding.ts'
import { en as source25, es as translated25 } from '../../ui-settings-account/src/client/locales.ts'
import { en as source26, es as translated26 } from '../../ui-settings-agent-loop/src/client/locales.ts'
import { en as source27, es as translated27 } from '../../ui-settings-general/src/client/locales.ts'
import { en as source28, es as translated28 } from '../../ui-settings-models/src/client/locales.ts'
import { en as source29, es as translated29 } from '../../ui-settings-plugin-inventory/src/client/locales.ts'
import { en as source30, es as translated30 } from '../../ui-settings-plugins/src/client/locales.ts'
import { en as source31, es as translated31 } from '../../ui-settings-session-log/src/client/locales.ts'
import { en as source32, es as translated32 } from '../../ui-settings-shell/src/client/locales.ts'
import { en as source33, es as translated33 } from '../../ui-settings-subagent/src/client/locales.ts'
import { en as source34, es as translated34 } from '../../ui-settings-web-search/src/client/locales.ts'
import { en as source35, es as translated35 } from '../../ui-shortcuts/src/client/locales.ts'
import { en as source36, es as translated36 } from '../../ui-sidebar/src/client/locales.ts'
import { en as source37, es as translated37 } from '../../ui-sidebar-browser/src/client/locales.ts'
import { en as source38, es as translated38 } from '../../ui-sidebar-documentpreview/src/client/code/locales.ts'
import { en as source39, es as translated39 } from '../../ui-sidebar-documentpreview/src/client/excel/locales.ts'
import { en as source40, es as translated40 } from '../../ui-sidebar-documentpreview/src/client/html/locales.ts'
import { en as source41, es as translated41 } from '../../ui-sidebar-documentpreview/src/client/image/locales.ts'
import { en as source42, es as translated42 } from '../../ui-sidebar-documentpreview/src/client/locales.ts'
import { en as source43, es as translated43 } from '../../ui-sidebar-documentpreview/src/client/markdown/locales.ts'
import { en as source44, es as translated44 } from '../../ui-sidebar-documentpreview/src/client/office/locales.ts'
import { en as source45, es as translated45 } from '../../ui-sidebar-documentpreview/src/client/pdf/locales.ts'
import { zoomEn as source46, zoomEs as translated46 } from '../../ui-sidebar-documentpreview/src/client/zoom/locales.ts'
import { en as source47, es as translated47 } from '../../ui-sidebar-files/src/client/locales.ts'
import { en as source48, es as translated48 } from '../../ui-sidebar-right/src/client/locales.ts'
import { en as source49, es as translated49 } from '../../ui-sidebar-terminal/src/client/locales.ts'
import { en as source50, es as translated50 } from '../../ui-skill/src/client/locales.ts'
import { en as source51, es as translated51 } from '../../ui-subagent/src/client/locales.ts'
import { en as source52, es as translated52 } from '../../ui-theme/src/client/locales.ts'
import { en as source53, es as translated53 } from '../../ui-trajectory/src/client/locales.ts'
import { en as source54, es as translated54 } from '../../ui-user-questions/src/client/locales.ts'
import { en as source55, es as translated55 } from '../../ui-workflow-run/src/client/locales.ts'
import { en as source56, es as translated56 } from '../../ui-workspace/src/client/locales.ts'
import { en as source57, es as translated57 } from '../../../experimental/client-ui-agent-team/src/client/locales.ts'
import { en as source58, es as translated58 } from '../../../experimental/client-ui-claude-code-mods/src/client/locales.ts'
import { en as source59, es as translated59 } from '../../../experimental/client-ui-cot-translation/src/client/locales.ts'
import { en as source60, es as translated60 } from '../../../experimental/client-ui-voice-input/src/client/locales.ts'
import { en as source61, es as translated61 } from '../../../experimental/inspector/src/client/bottom/locales.ts'
import { en as source62, es as translated62 } from '../../../experimental/session-inspector/src/client/locales.ts'
import { en as source63, es as translated63 } from '../../../extensions/ui-cordis/src/client/locales.ts'
import { en as source64, es as translated64 } from '../../../session-query/session-log-export/src/client/locales.ts'
import { en as source65, es as translated65 } from '../../../../apps/desktop/src/locale.ts'

const dictionaries: readonly {
  name: string
  source: Readonly<Record<string, string>>
  translated: Readonly<Record<string, string>>
}[] = [
  { name: 'packages/client/locale/src/locales/en.ts:en', source: source0, translated: translated0 },
  { name: 'packages/client/locale/src/locales/settings.ts:en', source: source1, translated: translated1 },
  { name: 'packages/client/ui-agent-preset/src/client/guide-locales.ts:guideEn', source: source2, translated: translated2 },
  { name: 'packages/client/ui-agent-preset/src/client/locales.ts:en', source: source3, translated: translated3 },
  { name: 'packages/client/ui-approval/src/client/locales.ts:en', source: source4, translated: translated4 },
  { name: 'packages/client/ui-chat/src/client/locale.ts:en', source: source5, translated: translated5 },
  { name: 'packages/client/ui-commands/src/client/locales.ts:en', source: source6, translated: translated6 },
  { name: 'packages/client/ui-conversation/src/client/locales.ts:en', source: source7, translated: translated7 },
  { name: 'packages/client/ui-deliverables/src/client/locales.ts:en', source: source8, translated: translated8 },
  { name: 'packages/client/ui-goal/src/client/locales.ts:en', source: source9, translated: translated9 },
  { name: 'packages/client/ui-input-trigger/src/client/locales.ts:en', source: source10, translated: translated10 },
  { name: 'packages/client/ui-jobs/src/client/locales.ts:en', source: source11, translated: translated11 },
  { name: 'packages/client/ui-layout/src/client/shortcut-locales.ts:en', source: source12, translated: translated12 },
  { name: 'packages/client/ui-message-feedback/src/client/locales.ts:en', source: source13, translated: translated13 },
  { name: 'packages/client/ui-model-selection/src/client/locales.ts:en', source: source14, translated: translated14 },
  { name: 'packages/client/ui-open-in-app/src/client/locales.ts:en', source: source15, translated: translated15 },
  { name: 'packages/client/ui-permission-presets/src/client/locales.ts:en', source: source16, translated: translated16 },
  { name: 'packages/client/ui-permission-presets/src/client/locales.ts:accessEn', source: source17, translated: translated17 },
  { name: 'packages/client/ui-plan/src/client/locales.ts:en', source: source18, translated: translated18 },
  { name: 'packages/client/ui-plugin-manager/src/client/locales.ts:en', source: source19, translated: translated19 },
  { name: 'packages/client/ui-reference/src/client/locales.ts:en', source: source20, translated: translated20 },
  { name: 'packages/client/ui-schedule/src/client/frequency-locales.ts:frequencyEn', source: source21, translated: translated21 },
  { name: 'packages/client/ui-schedule/src/client/locales.ts:en', source: source22, translated: translated22 },
  { name: 'packages/client/ui-schedule/src/client/task-manager-locales.ts:en', source: source23, translated: translated23 },
  { name: 'packages/client/ui-settings-account/src/client/locales/onboarding.ts:onboardingEnglishCopy', source: source24, translated: translated24 },
  { name: 'packages/client/ui-settings-account/src/client/locales.ts:en', source: source25, translated: translated25 },
  { name: 'packages/client/ui-settings-agent-loop/src/client/locales.ts:en', source: source26, translated: translated26 },
  { name: 'packages/client/ui-settings-general/src/client/locales.ts:en', source: source27, translated: translated27 },
  { name: 'packages/client/ui-settings-models/src/client/locales.ts:en', source: source28, translated: translated28 },
  { name: 'packages/client/ui-settings-plugin-inventory/src/client/locales.ts:en', source: source29, translated: translated29 },
  { name: 'packages/client/ui-settings-plugins/src/client/locales.ts:en', source: source30, translated: translated30 },
  { name: 'packages/client/ui-settings-session-log/src/client/locales.ts:en', source: source31, translated: translated31 },
  { name: 'packages/client/ui-settings-shell/src/client/locales.ts:en', source: source32, translated: translated32 },
  { name: 'packages/client/ui-settings-subagent/src/client/locales.ts:en', source: source33, translated: translated33 },
  { name: 'packages/client/ui-settings-web-search/src/client/locales.ts:en', source: source34, translated: translated34 },
  { name: 'packages/client/ui-shortcuts/src/client/locales.ts:en', source: source35, translated: translated35 },
  { name: 'packages/client/ui-sidebar/src/client/locales.ts:en', source: source36, translated: translated36 },
  { name: 'packages/client/ui-sidebar-browser/src/client/locales.ts:en', source: source37, translated: translated37 },
  { name: 'packages/client/ui-sidebar-documentpreview/src/client/code/locales.ts:en', source: source38, translated: translated38 },
  { name: 'packages/client/ui-sidebar-documentpreview/src/client/excel/locales.ts:en', source: source39, translated: translated39 },
  { name: 'packages/client/ui-sidebar-documentpreview/src/client/html/locales.ts:en', source: source40, translated: translated40 },
  { name: 'packages/client/ui-sidebar-documentpreview/src/client/image/locales.ts:en', source: source41, translated: translated41 },
  { name: 'packages/client/ui-sidebar-documentpreview/src/client/locales.ts:en', source: source42, translated: translated42 },
  { name: 'packages/client/ui-sidebar-documentpreview/src/client/markdown/locales.ts:en', source: source43, translated: translated43 },
  { name: 'packages/client/ui-sidebar-documentpreview/src/client/office/locales.ts:en', source: source44, translated: translated44 },
  { name: 'packages/client/ui-sidebar-documentpreview/src/client/pdf/locales.ts:en', source: source45, translated: translated45 },
  { name: 'packages/client/ui-sidebar-documentpreview/src/client/zoom/locales.ts:zoomEn', source: source46, translated: translated46 },
  { name: 'packages/client/ui-sidebar-files/src/client/locales.ts:en', source: source47, translated: translated47 },
  { name: 'packages/client/ui-sidebar-right/src/client/locales.ts:en', source: source48, translated: translated48 },
  { name: 'packages/client/ui-sidebar-terminal/src/client/locales.ts:en', source: source49, translated: translated49 },
  { name: 'packages/client/ui-skill/src/client/locales.ts:en', source: source50, translated: translated50 },
  { name: 'packages/client/ui-subagent/src/client/locales.ts:en', source: source51, translated: translated51 },
  { name: 'packages/client/ui-theme/src/client/locales.ts:en', source: source52, translated: translated52 },
  { name: 'packages/client/ui-trajectory/src/client/locales.ts:en', source: source53, translated: translated53 },
  { name: 'packages/client/ui-user-questions/src/client/locales.ts:en', source: source54, translated: translated54 },
  { name: 'packages/client/ui-workflow-run/src/client/locales.ts:en', source: source55, translated: translated55 },
  { name: 'packages/client/ui-workspace/src/client/locales.ts:en', source: source56, translated: translated56 },
  { name: 'packages/experimental/client-ui-agent-team/src/client/locales.ts:en', source: source57, translated: translated57 },
  { name: 'packages/experimental/client-ui-claude-code-mods/src/client/locales.ts:en', source: source58, translated: translated58 },
  { name: 'packages/experimental/client-ui-cot-translation/src/client/locales.ts:en', source: source59, translated: translated59 },
  { name: 'packages/experimental/client-ui-voice-input/src/client/locales.ts:en', source: source60, translated: translated60 },
  { name: 'packages/experimental/inspector/src/client/bottom/locales.ts:en', source: source61, translated: translated61 },
  { name: 'packages/experimental/session-inspector/src/client/locales.ts:en', source: source62, translated: translated62 },
  { name: 'packages/extensions/ui-cordis/src/client/locales.ts:en', source: source63, translated: translated63 },
  { name: 'packages/session-query/session-log-export/src/client/locales.ts:en', source: source64, translated: translated64 },
  { name: 'apps/desktop/src/locale.ts:en', source: source65, translated: translated65 },
]

describe('Latin American Spanish dictionaries', () => {
  it.each(dictionaries)('$name retains every key and named interpolation variable', ({ source, translated }) => {
    expect(Object.keys(translated).sort()).toEqual(Object.keys(source).sort())
    for (const [key, text] of Object.entries(source)) {
      const parameters = (value: string) => [...value.matchAll(/\{([^{}]+)\}/gu)].map(match => match[1]).sort()
      expect(parameters(translated[key]!), key).toEqual(parameters(text))
      if (text !== '') expect(translated[key], key).not.toBe('')
    }
  })
})

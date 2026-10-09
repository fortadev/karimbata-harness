import { KarimbataLogo } from '@deepseek-ai/dsh-client-ui-primitives'
import type { SidebarBrandMarkOwnerProps } from '@deepseek-ai/dsh-client-ui-sidebar/client'
import type { PropsLocale } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-locale/client'

/**
 * Render the official mark with the presentation requested by its host surface.
 * @param props - Host-supplied mark presentation.
 * @returns the theme-aware Karimbata mark.
 */
export function OfficialBrandMark({ size }: SidebarBrandMarkOwnerProps) {
  return <KarimbataLogo size={size} />
}

/**
 * Render the localized product name without its independently slotted mark.
 * @param props - Framework-supplied common translations.
 * @returns the product name.
 */
export function OfficialBrandName({ t }: PropsLocale<'common'>) {
  return <span>{t('brand.localBuild')}</span>
}

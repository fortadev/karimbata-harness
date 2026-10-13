import type { IconProps } from './icons/props.ts'
import { KARIMBATA_ACCENT_PATH, KARIMBATA_PRIMARY_PATH } from './karimbata-artwork.ts'
import css from './KarimbataLogo.module.css'

/**
 * Render the transparent Karimbatá mark using the active theme's artwork colors.
 * @param props - Square size in pixels and optional placement class.
 * @returns decorative SVG; its host supplies the accessible product name.
 */
export function KarimbataLogo({ size = 24, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 2500 2500" className={className} aria-hidden="true">
      <path d={KARIMBATA_PRIMARY_PATH} className={css.primary} fillRule="evenodd" />
      <path d={KARIMBATA_ACCENT_PATH} className={css.accent} fillRule="evenodd" />
    </svg>
  )
}

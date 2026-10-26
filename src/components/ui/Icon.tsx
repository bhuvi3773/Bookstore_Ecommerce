import type { SVGProps } from 'react'

export type IconName =
  | 'search'
  | 'heart'
  | 'bag'
  | 'user'
  | 'menu'
  | 'close'
  | 'chevron-down'
  | 'chevron-right'
  | 'chevron-left'
  | 'arrow-right'
  | 'arrow-left'
  | 'arrow-up'
  | 'star'
  | 'check'
  | 'plus'
  | 'minus'
  | 'trash'
  | 'truck'
  | 'shield'
  | 'refresh'
  | 'book'
  | 'sparkle'
  | 'filter'
  | 'mail'
  | 'phone'
  | 'pin'
  | 'instagram'
  | 'facebook'
  | 'quote'
  | 'clock'
  | 'package'
  | 'credit-card'
  | 'gift'
  | 'leaf'
  | 'grid'
  | 'users'
  | 'lock'
  | 'eye'
  | 'eye-off'
  | 'external'

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  size?: number
  title?: string
}

export function Icon({ name, size = 20, title, strokeWidth = 1.7, ...props }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': title ? undefined : true,
    role: title ? 'img' : undefined,
    ...props,
  }

  const icon = (() => {
    switch (name) {
      case 'search':
        return (
          <>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.6-3.6" />
          </>
        )
      case 'heart':
        return <path d="M20.8 4.7a5.5 5.5 0 0 0-7.8 0L12 5.8l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.4 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
      case 'bag':
        return (
          <>
            <path d="M5.8 8h12.4l1 12H4.8L5.8 8Z" />
            <path d="M9 8V6a3 3 0 0 1 6 0v2" />
          </>
        )
      case 'user':
        return (
          <>
            <circle cx="12" cy="8" r="3.6" />
            <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
          </>
        )
      case 'menu':
        return (
          <>
            <path d="M4 7h16" />
            <path d="M4 12h16" />
            <path d="M4 17h16" />
          </>
        )
      case 'close':
        return (
          <>
            <path d="m6 6 12 12" />
            <path d="M18 6 6 18" />
          </>
        )
      case 'chevron-down':
        return <path d="m6 9 6 6 6-6" />
      case 'chevron-right':
        return <path d="m9 6 6 6-6 6" />
      case 'chevron-left':
        return <path d="m15 6-6 6 6 6" />
      case 'arrow-right':
        return (
          <>
            <path d="M4 12h16" />
            <path d="m14 6 6 6-6 6" />
          </>
        )
      case 'arrow-left':
        return (
          <>
            <path d="M20 12H4" />
            <path d="m10 18-6-6 6-6" />
          </>
        )
      case 'arrow-up':
        return (
          <>
            <path d="M12 20V4" />
            <path d="m6 10 6-6 6 6" />
          </>
        )
      case 'star':
        return <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" fill="currentColor" stroke="none" />
      case 'check':
        return <path d="m5 12.5 4.2 4.2L19 7" />
      case 'plus':
        return (
          <>
            <path d="M12 5v14" />
            <path d="M5 12h14" />
          </>
        )
      case 'minus':
        return <path d="M5 12h14" />
      case 'trash':
        return (
          <>
            <path d="M4 7h16" />
            <path d="M9 7V4.8h6V7" />
            <path d="M6.5 7 7.4 20h9.2l.9-13" />
            <path d="M10 11v5" />
            <path d="M14 11v5" />
          </>
        )
      case 'truck':
        return (
          <>
            <path d="M3 6h11v10H3z" />
            <path d="M14 10h4l3 3v3h-7" />
            <circle cx="7" cy="18" r="1.6" />
            <circle cx="17.5" cy="18" r="1.6" />
          </>
        )
      case 'shield':
        return (
          <>
            <path d="M12 3 5 6v5.5c0 4.2 2.7 7.6 7 9.5 4.3-1.9 7-5.3 7-9.5V6l-7-3Z" />
            <path d="m9 12 2 2 4-4" />
          </>
        )
      case 'refresh':
        return (
          <>
            <path d="M20 11a8 8 0 0 0-14-4.8L4 8" />
            <path d="M4 4v4h4" />
            <path d="M4 13a8 8 0 0 0 14 4.8L20 16" />
            <path d="M20 20v-4h-4" />
          </>
        )
      case 'book':
        return (
          <>
            <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H12v17H6.5A2.5 2.5 0 0 0 4 22V5.5Z" />
            <path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H12v17h5.5A2.5 2.5 0 0 1 20 22V5.5Z" />
          </>
        )
      case 'sparkle':
        return (
          <>
            <path d="M12 3c.7 4.8 2.2 6.3 7 7-4.8.7-6.3 2.2-7 7-.7-4.8-2.2-6.3-7-7 4.8-.7 6.3-2.2 7-7Z" />
            <path d="M19 15.5c.3 1.8.8 2.3 2.5 2.5-1.7.3-2.2.8-2.5 2.5-.3-1.7-.8-2.2-2.5-2.5 1.7-.2 2.2-.7 2.5-2.5Z" />
          </>
        )
      case 'filter':
        return (
          <>
            <path d="M4 6h16" />
            <path d="M7 12h10" />
            <path d="M10 18h4" />
          </>
        )
      case 'mail':
        return (
          <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3.5 7 8.5 6 8.5-6" />
          </>
        )
      case 'phone':
        return <path d="M7 3h3l1.5 4-2 1.5a13 13 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 5 5.2 2 2 0 0 1 7 3Z" />
      case 'pin':
        return (
          <>
            <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
            <circle cx="12" cy="10" r="2.6" />
          </>
        )
      case 'instagram':
        return (
          <>
            <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r=".8" fill="currentColor" stroke="none" />
          </>
        )
      case 'facebook':
        return <path d="M14.5 21v-7h2.4l.4-3h-2.8V9.2c0-.9.3-1.5 1.6-1.5h1.3V5.1c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V11H8.6v3h2.6v7h3.3Z" />
      case 'quote':
        return (
          <>
            <path d="M9 7H4v7h5V9.5C9 8 8.2 7.3 7 7" />
            <path d="M20 7h-5v7h5V9.5C20 8 19.2 7.3 18 7" />
          </>
        )
      case 'clock':
        return (
          <>
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5.4l3.5 2.1" />
          </>
        )
      case 'package':
        return (
          <>
            <path d="m4 8 8-4 8 4-8 4-8-4Z" />
            <path d="M4 8v8l8 4 8-4V8" />
            <path d="M12 12v8" />
          </>
        )
      case 'credit-card':
        return (
          <>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="M3 9h18" />
            <path d="M7 15h3" />
          </>
        )
      case 'gift':
        return (
          <>
            <path d="M4 10h16v10H4z" />
            <path d="M3 7h18v3H3z" />
            <path d="M12 7v13" />
            <path d="M12 7C10.5 3 6 3 6 6c0 2 3 1 6 1Z" />
            <path d="M12 7c1.5-4 6-4 6-1 0 2-3 1-6 1Z" />
          </>
        )
      case 'leaf':
        return (
          <>
            <path d="M20 4C12 4 5 8 5 15c0 3 2 5 5 5 7 0 10-7 10-16Z" />
            <path d="M4 21c2-6 6-9 12-12" />
          </>
        )
      case 'grid':
        return (
          <>
            <rect x="4" y="4" width="6" height="6" rx="1" />
            <rect x="14" y="4" width="6" height="6" rx="1" />
            <rect x="4" y="14" width="6" height="6" rx="1" />
            <rect x="14" y="14" width="6" height="6" rx="1" />
          </>
        )
      case 'users':
        return (
          <>
            <circle cx="9" cy="8" r="3.2" />
            <path d="M3 20a6 6 0 0 1 12 0" />
            <path d="M16 5.5a3 3 0 0 1 0 5.8" />
            <path d="M18 14.5a6 6 0 0 1 3 5.5" />
          </>
        )
      case 'lock':
        return (
          <>
            <rect x="5" y="10" width="14" height="11" rx="2" />
            <path d="M8 10V7a4 4 0 0 1 8 0v3" />
          </>
        )
      case 'eye':
        return (
          <>
            <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
            <circle cx="12" cy="12" r="2.6" />
          </>
        )
      case 'eye-off':
        return (
          <>
            <path d="M3 3l18 18" />
            <path d="M10.5 6.2A10 10 0 0 1 12 6c6 0 9.5 6 9.5 6a16 16 0 0 1-2.2 2.8" />
            <path d="M6.3 7.4A16 16 0 0 0 2.5 12s3.5 6 9.5 6a9.8 9.8 0 0 0 3.6-.7" />
          </>
        )
      case 'external':
        return (
          <>
            <path d="M14 4h6v6" />
            <path d="m20 4-9 9" />
            <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
          </>
        )
      default:
        return null
    }
  })()

  return (
    <svg {...common}>
      {title ? <title>{title}</title> : null}
      {icon}
    </svg>
  )
}

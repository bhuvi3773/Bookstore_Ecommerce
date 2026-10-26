import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  style?: CSSProperties
  ariaHidden?: boolean
}

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

export function Reveal({ children, className = '', delay = 0, style, ariaHidden }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [armed, setArmed] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useLayoutEffect(() => {
    const node = ref.current
    if (!node) return

    const motionQuery = window.matchMedia(REDUCED_MOTION)

    const showImmediately = () => {
      setArmed(false)
      setRevealed(true)
    }

    if (motionQuery.matches || typeof window.IntersectionObserver === 'undefined') {
      showImmediately()
      return
    }

    let observer: IntersectionObserver

    try {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            setRevealed(true)
            observer.disconnect()
          }
        },
        { threshold: 0.08, rootMargin: '0px 0px -7% 0px' },
      )
    } catch {
      showImmediately()
      return
    }

    // The hidden state is only applied after an observer is armed, so a failure
    // in the animation layer can never leave content permanently invisible.
    setArmed(true)
    observer.observe(node)

    const handleMotionChange = () => {
      if (!motionQuery.matches) return
      observer.disconnect()
      showImmediately()
    }

    motionQuery.addEventListener?.('change', handleMotionChange)
    return () => {
      observer.disconnect()
      motionQuery.removeEventListener?.('change', handleMotionChange)
    }
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${armed ? 'is-armed' : ''} ${revealed ? 'is-revealed' : ''} ${className}`.trim()}
      style={{ ...style, '--reveal-delay': `${delay}ms` } as CSSProperties}
      aria-hidden={ariaHidden || undefined}
    >
      {children}
    </div>
  )
}

import { useEffect, useRef } from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

function isVisible(element: HTMLElement) {
  return element.getClientRects().length > 0 && window.getComputedStyle(element).visibility !== 'hidden'
}

/**
 * Manages Escape-to-close, body scroll locking, focus restoration and a simple
 * focus trap for dialogs and slide-over panels.
 */
export function useDialog(open: boolean, onClose: () => void) {
  const ref = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)

  useEffect(() => {
    closeRef.current = onClose
  }, [onClose])

  useEffect(() => {
    if (!open) return
    const previousActive = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const node = ref.current
    const focusables = node ? Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)) : []
    const initial = focusables.find((element) => isVisible(element)) ?? node
    initial?.focus({ preventScroll: true })

    // The panel may still be transitioning from visibility:hidden when the
    // effect runs, in which case the focus call above is ignored. Try again
    // after the browser has painted the open state.
    let frame = 0
    const retryFrame = window.requestAnimationFrame(() => {
      frame = window.requestAnimationFrame(() => {
        if (!node?.contains(document.activeElement)) {
          const visible = node ? Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isVisible) : []
          ;(visible[0] ?? node)?.focus({ preventScroll: true })
        }
      })
    })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeRef.current()
        return
      }
      if (event.key !== 'Tab' || !node) return
      const available = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(isVisible)
      if (available.length === 0) {
        event.preventDefault()
        return
      }
      const first = available[0]
      const last = available[available.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      window.cancelAnimationFrame(retryFrame)
      window.cancelAnimationFrame(frame)
      document.body.style.overflow = previousOverflow
      previousActive?.focus({ preventScroll: true })
    }
  }, [open])

  return ref
}

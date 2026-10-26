import { useEffect } from 'react'

const SUFFIX = 'Hawthorn Booksellers'

/** Keeps the browser tab title in step with the page being viewed. */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    const previous = document.title
    document.title = title ? `${title} · ${SUFFIX}` : SUFFIX
    return () => {
      document.title = previous
    }
  }, [title])
}

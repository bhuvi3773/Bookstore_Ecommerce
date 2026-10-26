import { Link } from 'react-router-dom'

export function Brand({ light = false, compact = false }: { light?: boolean; compact?: boolean }) {
  return (
    <Link to="/" className={`brand ${light ? 'brand--light' : ''} ${compact ? 'brand--compact' : ''}`.trim()}>
      <span className="brand__mark" aria-hidden="true">
        <span className="brand__h">H</span>
        <span className="brand__leaf" />
      </span>
      <span className="brand__text">
        <span className="brand__name">Hawthorn</span>
        <span className="brand__sub">Booksellers · est. 2014</span>
      </span>
    </Link>
  )
}

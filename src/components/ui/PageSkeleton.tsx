export function PageSkeleton() {
  return (
    <div className="page-skeleton" aria-label="Loading page" role="status">
      <div className="container page-skeleton__inner">
        <span className="sr-only">Loading…</span>
        <div className="skeleton skeleton--eyebrow" />
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--text" />
        <div className="page-skeleton__grid">
          {Array.from({ length: 4 }).map((_, index) => (
            <div className="skeleton-card" key={index}>
              <div className="skeleton skeleton--cover" />
              <div className="skeleton skeleton--line" />
              <div className="skeleton skeleton--line skeleton--short" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

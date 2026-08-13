export default function AuroraBackground({ children, className = '' }) {
  return (
    <div className={`aurora-background ${className}`}>
      <span className="aurora-orb aurora-orb-one" aria-hidden="true" />
      <span className="aurora-orb aurora-orb-two" aria-hidden="true" />
      <span className="aurora-grid" aria-hidden="true" />
      <div className="aurora-content">{children}</div>
    </div>
  )
}

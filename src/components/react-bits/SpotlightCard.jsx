export default function SpotlightCard({ as: Component = 'div', children, className = '' }) {
  return <Component className={`spotlight-card ${className}`}>{children}</Component>
}

export default function AnimatedContent({ children, className = '' }) {
  return <div className={`animated-content ${className}`}>{children}</div>
}

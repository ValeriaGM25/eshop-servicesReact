export default function AuthLayout({ children }) {
  return (
    <section className="container py-5" style={{ maxWidth: 480 }}>
      {children}
    </section>
  )
}

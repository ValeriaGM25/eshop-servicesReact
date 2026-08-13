import ProductCard from './ProductCard.jsx'

export default function ProductList({ products }) {
  if (products.length === 0) {
    return (
      <div className="empty-state text-center neo-card rounded-4 shadow-sm p-5">
        <i className="bi bi-box-seam display-3 text-primary" aria-hidden="true" />
        <p className="h5 mt-3 mb-0">No hay productos registrados.</p>
      </div>
    )
  }

  return (
    <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
      {products.map((product, index) => (
        <div className="col" key={product.id ?? product.name ?? index}>
          <ProductCard product={product} />
        </div>
      ))}
    </div>
  )
}

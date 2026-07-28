import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../../catalog/services/catalogService.js'
import LoadingMessage from '../../../shared/components/LoadingMessage.jsx'
import ErrorMessage from '../../../shared/components/ErrorMessage.jsx'
import AdminProductTable from '../components/AdminProductTable.jsx'
import DeleteProductModal from '../components/DeleteProductModal.jsx'

export default function AdminProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deletedMessage, setDeletedMessage] = useState('')

  async function loadProducts() {
    try {
      setLoading(true)
      setError('')
      const result = await getProducts(1, 100, search)
        setProducts(Array.isArray(result.data) ? result.data : [])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  function handleSearch(e) {
    e.preventDefault()
    loadProducts()
  }

  function handleDeleted() {
    setDeleteTarget(null)
    setDeletedMessage('Producto eliminado correctamente.')
    loadProducts()
    setTimeout(() => setDeletedMessage(''), 3000)
  }

  return (
    <>
      <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between gap-3 mb-4">
        <h2 className="h4 mb-0">
          <i className="bi bi-box-seam me-2" />Productos
          {!loading && <span className="badge bg-primary ms-2">{products.length}</span>}
        </h2>
        <div className="d-flex gap-2">
          <form onSubmit={handleSearch} className="d-flex gap-2">
            <input type="search" className="form-control form-control-sm" placeholder="Buscar…"
              value={search} onChange={(e) => setSearch(e.target.value)} style={{ maxWidth: 200 }} />
            <button type="submit" className="btn btn-sm btn-outline-primary">
              <i className="bi bi-search" />
            </button>
          </form>
          <Link className="btn btn-sm btn-primary" to="/admin/productos/nuevo">
            <i className="bi bi-plus-circle me-1" />Nuevo
          </Link>
        </div>
      </div>

      {deletedMessage && (
        <div className="alert alert-success py-2" role="alert">
          <i className="bi bi-check-circle-fill me-1" />{deletedMessage}
        </div>
      )}

      {loading ? <LoadingMessage /> : null}
      {error && !loading ? <ErrorMessage message={error} onRetry={loadProducts} /> : null}

      {!loading && !error && products.length === 0 && (
        <div className="text-center py-5">
          <i className="bi bi-box display-1 text-secondary" />
          <p className="text-secondary mt-3">No hay productos disponibles.</p>
          <Link className="btn btn-primary" to="/admin/productos/nuevo">Crear primer producto</Link>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <AdminProductTable products={products} onDelete={setDeleteTarget} />
      )}

      {deleteTarget && (
        <DeleteProductModal product={deleteTarget} onClose={() => setDeleteTarget(null)} onDeleted={handleDeleted} />
      )}
    </>
  )
}

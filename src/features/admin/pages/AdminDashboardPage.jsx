import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProducts } from '../../catalog/services/catalogService.js'
import LoadingMessage from '../../../shared/components/LoadingMessage.jsx'
import ErrorMessage from '../../../shared/components/ErrorMessage.jsx'

export default function AdminDashboardPage() {
  const [totalProducts, setTotalProducts] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        setLoading(true)
        setError('')
        const products = await getProducts(1, 1)
        if (!ignore && products?.totalCount != null) {
          setTotalProducts(products.totalCount)
        } else if (!ignore) {
          setTotalProducts('—')
        }
      } catch (err) {
        if (!ignore) setError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [])

  return (
    <>
      <div className="row g-4">
        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm h-100 rounded-4">
            <div className="card-body text-center p-4">
              <i className="bi bi-box-seam display-5 text-primary mb-3 d-block" />
              <h5 className="card-title">Total de productos</h5>
              {loading ? (
                <p className="display-6 fw-bold text-primary">…</p>
              ) : error ? (
                <p className="text-danger small">{error}</p>
              ) : (
                <p className="display-6 fw-bold text-primary">{totalProducts}</p>
              )}
              <Link className="btn btn-primary" to="/admin/productos">
                <i className="bi bi-list me-1" />Gestionar productos
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card border-0 shadow-sm h-100 rounded-4">
            <div className="card-body text-center p-4">
              <i className="bi bi-plus-circle display-5 text-primary mb-3 d-block" />
              <h5 className="card-title">Nuevo producto</h5>
              <p className="card-text text-secondary small">Agrega un nuevo producto al catálogo.</p>
              <Link className="btn btn-outline-primary" to="/admin/productos/nuevo">
                <i className="bi bi-plus-circle me-1" />Crear producto
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

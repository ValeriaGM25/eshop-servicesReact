import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ErrorMessage from '../../../shared/components/ErrorMessage.jsx'
import LoadingMessage from '../../../shared/components/LoadingMessage.jsx'
import ProductDetail from '../components/ProductDetail.jsx'
import { getProductById } from '../services/catalogService.js'

export default function ProductDetailsPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadProduct() {
      try {
        setLoading(true)
        setError('')

        const nextProduct = await getProductById(id)

        if (!ignore) {
          setProduct(nextProduct)
        }
      } catch (requestError) {
        if (!ignore) {
          setProduct(null)
          setError(requestError.message)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      ignore = true
    }
  }, [id])

  return (
    <section className="container py-5">
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
          <li className="breadcrumb-item"><Link to="/productos">Catálogo</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Producto</li>
        </ol>
      </nav>
      {loading ? <LoadingMessage>Cargando producto...</LoadingMessage> : null}
      {error ? (
        <div className="d-grid gap-3">
          <ErrorMessage message={error} />
          <Link className="btn btn-outline-primary w-fit" to="/productos">
            <i className="bi bi-arrow-left me-2" aria-hidden="true" />
            Volver al catálogo
          </Link>
        </div>
      ) : null}
      {!loading && !error && product ? <ProductDetail product={product} /> : null}
    </section>
  )
}

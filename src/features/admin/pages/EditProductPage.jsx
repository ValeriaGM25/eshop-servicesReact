import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProductById } from '../../catalog/services/catalogService.js'
import { updateProduct } from '../services/adminProductService.js'
import AdminProductForm from '../components/AdminProductForm.jsx'
import LoadingMessage from '../../../shared/components/LoadingMessage.jsx'
import ErrorMessage from '../../../shared/components/ErrorMessage.jsx'

export default function EditProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let ignore = false
    async function load() {
      try {
        setLoading(true)
        setLoadError('')
        const data = await getProductById(id)
        if (!ignore) setProduct(data)
      } catch (err) {
        if (!ignore) setLoadError(err.message)
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [id])

  async function handleSubmit(productData) {
    setSaving(true)
    setError('')
    try {
      await updateProduct(id, productData)
      navigate('/admin/productos')
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  if (loading) return <LoadingMessage />
  if (loadError) return <ErrorMessage message={loadError} />

  return (
    <div>
      <h2 className="h4 mb-4">
        <i className="bi bi-pencil me-2" />Editar producto
      </h2>
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-1" />{error}
        </div>
      )}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <AdminProductForm
            initialValues={product}
            onSubmit={handleSubmit}
            submitLabel="Actualizar producto"
            loading={saving}
          />
        </div>
      </div>
    </div>
  )
}

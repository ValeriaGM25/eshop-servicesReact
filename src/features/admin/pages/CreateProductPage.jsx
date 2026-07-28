import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminProductForm from '../components/AdminProductForm.jsx'
import { createProduct } from '../services/adminProductService.js'

export default function CreateProductPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(productData) {
    setLoading(true)
    setError('')
    try {
      await createProduct(productData)
      navigate('/admin/productos')
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 className="h4 mb-4">
        <i className="bi bi-plus-circle me-2" />Nuevo producto
      </h2>
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-1" />{error}
        </div>
      )}
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <AdminProductForm onSubmit={handleSubmit} submitLabel="Crear producto" loading={loading} />
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { deleteProduct } from '../services/adminProductService.js'

export default function DeleteProductModal({ product, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  async function handleDelete() {
    setDeleting(true)
    setError('')
    try {
      await deleteProduct(product.id)
      onDeleted()
    } catch (err) {
      setError(err.message)
      setDeleting(false)
    }
  }

  if (!product) return null

  return (
    <div className="modal d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow rounded-4">
          <div className="modal-header border-0">
            <h5 className="modal-title">
              <i className="bi bi-exclamation-triangle text-danger me-2" />
              Eliminar producto
            </h5>
            <button type="button" className="btn-close" onClick={onClose} disabled={deleting} />
          </div>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger py-2" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-1" />{error}
              </div>
            )}
            <p className="mb-1">¿Estás seguro de eliminar el siguiente producto?</p>
            <p className="fw-bold mb-0">{product.name}</p>
            <p className="text-danger small mt-2 mb-0">Esta acción no se puede deshacer.</p>
          </div>
          <div className="modal-footer border-0">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={deleting}>
              Cancelar
            </button>
            <button type="button" className="btn btn-danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? (
                <><span className="spinner-border spinner-border-sm me-2" />Eliminando…</>
              ) : (
                <><i className="bi bi-trash me-1" />Eliminar producto</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

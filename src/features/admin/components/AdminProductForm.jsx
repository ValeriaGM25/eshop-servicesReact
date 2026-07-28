import { useState } from 'react'

export default function AdminProductForm({ initialValues, onSubmit, submitLabel, loading }) {
  const [name, setName] = useState(initialValues?.name ?? '')
  const [description, setDescription] = useState(initialValues?.description ?? '')
  const [categoryStr, setCategoryStr] = useState(
    Array.isArray(initialValues?.category) ? initialValues.category.join(', ') : (initialValues?.category ?? ''),
  )
  const [imageFiles, setImageFiles] = useState(initialValues?.imageFiles ?? '')
  const [price, setPrice] = useState(initialValues?.price ?? '')
  const [error, setError] = useState('')

  function validateUrl(url) {
    if (!url) return true
    return /^https?:\/\/.+/.test(url)
  }

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!name.trim()) { setError('El nombre es obligatorio.'); return }
    if (!description.trim()) { setError('La descripción es obligatoria.'); return }
    const categories = categoryStr.split(',').map((c) => c.trim()).filter(Boolean)
    if (categories.length === 0) { setError('Debes especificar al menos una categoría.'); return }
    const priceNum = Number(price)
    if (!Number.isFinite(priceNum) || priceNum <= 0) { setError('El precio debe ser mayor que 0.'); return }
    if (!validateUrl(imageFiles)) { setError('La URL de la imagen debe comenzar con http:// o https://.'); return }

    const productData = { name: name.trim(), description: description.trim(), category: categories, price: priceNum }
    if (imageFiles.trim()) productData.imageFiles = imageFiles.trim()

    onSubmit(productData)
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2" />{error}
        </div>
      )}
      <div className="mb-3">
        <label htmlFor="prod-name" className="form-label">Nombre</label>
        <input id="prod-name" type="text" className="form-control" value={name}
          onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label htmlFor="prod-desc" className="form-label">Descripción</label>
        <textarea id="prod-desc" className="form-control" rows="3" value={description}
          onChange={(e) => setDescription(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label htmlFor="prod-cat" className="form-label">Categorías (separadas por comas)</label>
        <input id="prod-cat" type="text" className="form-control" value={categoryStr}
          onChange={(e) => setCategoryStr(e.target.value)} required placeholder="Ej: Computadoras, Laptop" />
      </div>
      <div className="mb-3">
        <label htmlFor="prod-img" className="form-label">URL de imagen (opcional)</label>
        <input id="prod-img" type="url" className="form-control" value={imageFiles}
          onChange={(e) => setImageFiles(e.target.value)} placeholder="https://..." />
      </div>
      <div className="mb-3">
        <label htmlFor="prod-price" className="form-label">Precio (MXN)</label>
        <input id="prod-price" type="number" step="0.01" min="0.01" className="form-control" value={price}
          onChange={(e) => setPrice(e.target.value)} required />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? (
          <><span className="spinner-border spinner-border-sm me-2" />Guardando…</>
        ) : (
          <><i className="bi bi-check-lg me-1" />{submitLabel || 'Guardar'}</>
        )}
      </button>
    </form>
  )
}

import { Link } from 'react-router-dom'
import RemoteImage from '../../../shared/components/RemoteImage.jsx'
import { getProductImage } from '../../../shared/config/remoteImages.js'
import { mxnFormatter } from '../../../shared/utils/formatters.js'

export default function AdminProductTable({ products, onDelete }) {
  return (
    <>
      <div className="d-none d-md-block">
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white rounded-4 overflow-hidden shadow-sm">
            <thead className="table-light">
              <tr>
                <th style={{ width: 60 }}>Imagen</th>
                <th>Nombre</th>
                <th>Categorías</th>
                <th>Precio</th>
                <th style={{ width: 200 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>
                    <RemoteImage
                      src={getProductImage(product)}
                      alt={product.name}
                      className="rounded admin-table-image"
                    />
                  </td>
                  <td className="fw-semibold">{product.name}</td>
                  <td>
                    {(Array.isArray(product.category) ? product.category : [product.category]).filter(Boolean).map((cat) => (
                      <span className="badge text-bg-light border text-primary me-1" key={cat}>{cat}</span>
                    ))}
                  </td>
                  <td className="text-primary fw-bold">{mxnFormatter.format(Number(product.price))}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <Link className="btn btn-sm btn-outline-primary" to={`/productos/${product.id}`} title="Ver">
                        <i className="bi bi-eye" />
                      </Link>
                      <Link className="btn btn-sm btn-outline-warning" to={`/admin/productos/${product.id}/editar`} title="Editar">
                        <i className="bi bi-pencil" />
                      </Link>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(product)} title="Eliminar">
                        <i className="bi bi-trash" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="d-md-none">
        <div className="row g-3">
          {products.map((product) => (
            <div className="col-12" key={product.id}>
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body">
                  <div className="d-flex gap-3">
                    <RemoteImage
                      src={getProductImage(product)}
                      alt={product.name}
                      className="rounded admin-card-image"
                    />
                    <div className="flex-grow-1 min-w-0">
                      <h6 className="fw-bold mb-1 text-truncate">{product.name}</h6>
                      <p className="text-primary fw-bold mb-1 small">{mxnFormatter.format(Number(product.price))}</p>
                      <div className="d-flex flex-wrap gap-1 mb-2">
                        {(Array.isArray(product.category) ? product.category : [product.category]).filter(Boolean).map((cat) => (
                          <span className="badge text-bg-light border text-primary" key={cat} style={{ fontSize: '0.7rem' }}>{cat}</span>
                        ))}
                      </div>
                      <div className="d-flex gap-1">
                        <Link className="btn btn-sm btn-outline-primary" to={`/productos/${product.id}`}><i className="bi bi-eye" /></Link>
                        <Link className="btn btn-sm btn-outline-warning" to={`/admin/productos/${product.id}/editar`}><i className="bi bi-pencil" /></Link>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(product)}><i className="bi bi-trash" /></button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

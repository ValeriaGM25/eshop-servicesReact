export default function ProductSearch({ categories, category, onCategoryChange, onSearchChange, search }) {
  return (
    <div className="row g-3 align-items-end" aria-label="Filtros del catalogo">
      <div className="col-lg-8">
        <label className="form-label fw-semibold" htmlFor="productSearch">Buscar producto</label>
        <div className="input-group input-group-lg">
          <span className="input-group-text bg-white">
            <i className="bi bi-search" aria-hidden="true" />
          </span>
          <input
            id="productSearch"
            className="form-control"
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Buscar por nombre o categoria"
            aria-label="Buscar producto"
          />
          {search ? (
            <button className="btn btn-outline-secondary" type="button" onClick={() => onSearchChange('')} aria-label="Limpiar busqueda">
              Limpiar
            </button>
          ) : null}
        </div>
      </div>
      <div className="col-lg-4">
        <label className="form-label fw-semibold" htmlFor="categoryFilter">Categoría</label>
        <select id="categoryFilter" className="form-select form-select-lg" value={category} onChange={(event) => onCategoryChange(event.target.value)} aria-label="Filtrar por categoria">
          <option value="">Todas</option>
          {categories.map((categoryOption) => (
            <option key={categoryOption} value={categoryOption}>
              {categoryOption}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

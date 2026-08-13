import { useState } from 'react'
import ErrorMessage from '../../../shared/components/ErrorMessage.jsx'
import LoadingMessage from '../../../shared/components/LoadingMessage.jsx'
import Pagination from '../components/Pagination.jsx'
import ProductList from '../components/ProductList.jsx'
import ProductSearch from '../components/ProductSearch.jsx'
import { useProducts } from '../hooks/useProducts.js'

export default function CatalogPage() {
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize] = useState(10)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const { categories, error, loading, page, products } = useProducts(pageNumber, pageSize, search, category)
  const totalPages = Math.max(1, Math.ceil((Number(page.totalCount) || 0) / (Number(page.pageSize) || pageSize)))
  const canGoBack = page.pageNumber > 1
  const canGoNext = page.pageNumber < totalPages

  function handleSearchChange(value) {
    setSearch(value)
    setPageNumber(1)
  }

  function handleCategoryChange(value) {
    setCategory(value)
    setPageNumber(1)
  }

  return (
    <section className="container py-5">
      <div className="d-flex flex-column flex-lg-row align-items-lg-end justify-content-between gap-3 mb-4">
        <div>
          <span className="badge text-bg-light border rounded-pill mb-3">
            <i className="bi bi-grid-fill me-1" aria-hidden="true" />
            Catalog.API
          </span>
          <h1 className="display-5 fw-bold mb-2">Explora tecnología esencial</h1>
          <p className="text-secondary mb-0">Filtra, compara y agrega productos conectados al catálogo real.</p>
        </div>
        <div className="text-lg-end">
          <span className="badge rounded-pill text-bg-light border text-primary fs-6 px-3 py-2">
            {page.totalCount} productos
          </span>
          <p className="small text-secondary mb-0 mt-2">Página {page.pageNumber} de {totalPages}</p>
        </div>
      </div>

       <div className="card border-0 shadow-sm rounded-4 mb-4 neo-card">
        <div className="card-body p-3 p-md-4">
          <ProductSearch
            categories={categories}
            category={category}
            onCategoryChange={handleCategoryChange}
            onSearchChange={handleSearchChange}
            search={search}
          />
        </div>
      </div>

      {loading ? <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4"><div className="col"><div className="neo-skeleton" /></div><div className="col"><div className="neo-skeleton" /></div><div className="col"><div className="neo-skeleton" /></div></div> : null}
      {error ? <ErrorMessage message={error} /> : null}
      {!loading && !error ? <ProductList products={products} /> : null}

      <Pagination
        canGoBack={canGoBack}
        canGoNext={canGoNext}
        currentPage={page.pageNumber}
        loading={loading}
        onNext={() => setPageNumber((currentPage) => currentPage + 1)}
        onPrevious={() => setPageNumber((currentPage) => currentPage - 1)}
      />
    </section>
  )
}

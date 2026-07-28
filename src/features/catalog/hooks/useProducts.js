import { useEffect, useMemo, useState } from 'react'
import { getProducts } from '../services/catalogService.js'

function normalizeText(value) {
  return String(value ?? '').trim().toLowerCase()
}

function productMatchesSearch(product, search) {
  const normalizedSearch = normalizeText(search)

  if (!normalizedSearch) {
    return true
  }

  return [
    product.name,
    product.description,
    ...(Array.isArray(product.category) ? product.category : [product.category]),
  ]
    .filter(Boolean)
    .some((value) => normalizeText(value).includes(normalizedSearch))
}

function productMatchesCategory(product, category) {
  if (!category) {
    return true
  }

  return Array.isArray(product.category) && product.category.includes(category)
}

export function useProducts(pageNumber, pageSize, search, category) {
  const [page, setPage] = useState({
    pageNumber: 1,
    pageSize,
    totalCount: 0,
    data: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false

    async function loadProducts() {
      try {
        setLoading(true)
        setError('')

        const nextPage = await getProducts(pageNumber, pageSize, search)

        if (!ignore) {
          setPage({
            pageNumber: Number(nextPage.pageNumber) || pageNumber,
            pageSize: Number(nextPage.pageSize) || pageSize,
            totalCount: Number(nextPage.totalCount) || 0,
            data: Array.isArray(nextPage.data) ? nextPage.data : [],
          })
        }
      } catch (requestError) {
        if (!ignore) {
          setPage({ pageNumber, pageSize, totalCount: 0, data: [] })
          setError(requestError.message)
        }
      } finally {
        if (!ignore) {
          setLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      ignore = true
    }
  }, [pageNumber, pageSize, search])

  const products = useMemo(
    () => page.data.filter((product) => productMatchesSearch(product, search) && productMatchesCategory(product, category)),
    [category, page.data, search],
  )
  const categories = useMemo(
    () => [...new Set(page.data.flatMap((product) => (Array.isArray(product.category) ? product.category : [])))],
    [page.data],
  )

  return {
    categories,
    error,
    loading,
    page,
    products,
  }
}

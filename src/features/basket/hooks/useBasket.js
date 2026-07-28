import { useContext } from 'react'
import { BasketContext } from '../context/BasketContext.jsx'

export function useBasket() {
  const context = useContext(BasketContext)

  if (!context) {
    throw new Error('useBasket debe usarse dentro de BasketProvider.')
  }

  return context
}

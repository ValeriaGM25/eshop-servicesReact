import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import DeleteProductModal from './DeleteProductModal.jsx'
import * as adminService from '../services/adminProductService.js'

vi.mock('../services/adminProductService.js', () => ({
  deleteProduct: vi.fn(),
}))

const sampleProduct = { id: 'prod-1', name: 'Producto Test' }

describe('DeleteProductModal', () => {
  it('muestra confirmación y llama deleteProduct al confirmar', async () => {
    adminService.deleteProduct.mockResolvedValue(undefined)
    const onClose = vi.fn()
    const onDeleted = vi.fn()
    const user = userEvent.setup()

    render(
      <DeleteProductModal product={sampleProduct} onClose={onClose} onDeleted={onDeleted} />,
    )

    expect(screen.getByText('Producto Test')).toBeInTheDocument()
    expect(screen.getByText('¿Estás seguro de eliminar el siguiente producto?')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /eliminar producto/i }))

    await waitFor(() => {
      expect(adminService.deleteProduct).toHaveBeenCalledWith('prod-1')
      expect(onDeleted).toHaveBeenCalledTimes(1)
    })
  })

  it('doble clic no produce doble eliminación (botón se deshabilita)', async () => {
    let callCount = 0
    adminService.deleteProduct.mockImplementation(async () => {
      callCount++
    })
    const user = userEvent.setup()

    render(
      <DeleteProductModal product={sampleProduct} onClose={vi.fn()} onDeleted={vi.fn()} />,
    )

    const deleteBtn = screen.getByRole('button', { name: /eliminar producto/i })
    await user.click(deleteBtn)
    await user.click(deleteBtn)

    await waitFor(() => {
      expect(callCount).toBe(1)
    })
  })
})

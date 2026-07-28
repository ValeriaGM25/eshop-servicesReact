import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import AdminProductForm from './AdminProductForm.jsx'

describe('AdminProductForm', () => {
  it('transforma "Computadoras, Laptop" en ["Computadoras", "Laptop"]', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(<AdminProductForm onSubmit={onSubmit} submitLabel="Guardar" loading={false} />)

    await user.type(screen.getByLabelText('Nombre'), 'Producto Test')
    await user.type(screen.getByLabelText('Descripción'), 'Descripción test')
    await user.type(screen.getByLabelText('Categorías (separadas por comas)'), 'Computadoras, Laptop')
    await user.type(screen.getByLabelText('Precio (MXN)'), '99.99')
    fireEvent.submit(screen.getByRole('button', { name: 'Guardar' }).closest('form'))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1)
      const data = onSubmit.mock.calls[0][0]
      expect(data.category).toEqual(['Computadoras', 'Laptop'])
    })
  })

  it('categoría vacía muestra error de validación', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(<AdminProductForm onSubmit={onSubmit} submitLabel="Guardar" loading={false} />)

    await user.type(screen.getByLabelText('Nombre'), 'Producto Test')
    await user.type(screen.getByLabelText('Descripción'), 'Descripción test')
    await user.type(screen.getByLabelText('Precio (MXN)'), '50')
    fireEvent.submit(screen.getByRole('button', { name: 'Guardar' }).closest('form'))

    await waitFor(() => {
      expect(screen.getByText('Debes especificar al menos una categoría.')).toBeInTheDocument()
    })
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('precio 0 muestra error de validación', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(<AdminProductForm onSubmit={onSubmit} submitLabel="Guardar" loading={false} />)

    await user.type(screen.getByLabelText('Nombre'), 'Producto Test')
    await user.type(screen.getByLabelText('Descripción'), 'Descripción test')
    await user.type(screen.getByLabelText('Categorías (separadas por comas)'), 'Categoría')
    await user.type(screen.getByLabelText('Precio (MXN)'), '0')
    fireEvent.submit(screen.getByRole('button', { name: 'Guardar' }).closest('form'))

    await waitFor(() => {
      expect(screen.getByText('El precio debe ser mayor que 0.')).toBeInTheDocument()
    })
    expect(onSubmit).not.toHaveBeenCalled()
  })
})

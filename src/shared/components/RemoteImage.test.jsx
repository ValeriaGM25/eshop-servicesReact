import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { fallbackRemoteImage } from '../config/remoteImages.js'
import RemoteImage from './RemoteImage.jsx'

describe('RemoteImage', () => {
  it('usa fallback sin ciclo infinito cuando falla la imagen principal', () => {
    render(<RemoteImage src="https://images.unsplash.com/photo-1?auto=format&fit=crop&w=900&q=80" alt="Imagen de prueba" />)

    const image = screen.getByRole('img', { name: 'Imagen de prueba' })

    fireEvent.error(image)

    expect(image).toHaveAttribute('src', fallbackRemoteImage)

    fireEvent.error(image)

    expect(screen.getByRole('img', { name: 'Imagen de prueba' })).toHaveTextContent('Imagen no disponible')
  })
})

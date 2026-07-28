import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { heroRemoteImage } from '../shared/config/remoteImages.js'
import HomePage from './HomePage.jsx'

describe('HomePage', () => {
  it('usa imagen hero remota con carga eager', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    )

    const image = screen.getByRole('img', { name: /tienda tecnológica/i })

    expect(image).toHaveAttribute('src', heroRemoteImage)
    expect(image).toHaveAttribute('loading', 'eager')
    expect(image).toHaveAttribute('fetchPriority', 'high')
  })
})

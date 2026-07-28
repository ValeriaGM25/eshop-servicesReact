import { describe, expect, it } from 'vitest'
import { fallbackRemoteImage, getProductImage, productRemoteImages } from './remoteImages.js'

describe('remoteImages', () => {
  it('normaliza nombres con acentos y rechaza example.com', () => {
    expect(getProductImage({ name: 'Audifonos Bluetooth', imageFiles: 'https://example.com/image.jpg' })).toBe(productRemoteImages['audífonos bluetooth'])
  })

  it('usa fallback cuando no hay coincidencia', () => {
    expect(getProductImage({ name: 'Producto desconocido', imageFiles: '' })).toBe(fallbackRemoteImage)
  })
})

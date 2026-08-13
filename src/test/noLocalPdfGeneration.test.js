import { describe, expect, it } from 'vitest'

describe('reporte PDF', () => {
  it('React no genera PDF localmente', async () => {
    const modules = import.meta.glob('../**/*.{js,jsx}', { query: '?raw', import: 'default' })
    const forbidden = [/jsPDF/i, /html2canvas/i, /PDFKit/i, /window\.print\s*\(/i]

    for (const [path, load] of Object.entries(modules)) {
      const content = await load()
      if (path.endsWith('noLocalPdfGeneration.test.js')) continue
      for (const pattern of forbidden) {
        expect(content, `${path} no debe contener ${pattern}`).not.toMatch(pattern)
      }
    }
  })
})

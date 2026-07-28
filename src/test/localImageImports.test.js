import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const imageImportPattern = /import\s+.*['"].*\.(jpg|jpeg|png|webp)['"]|from\s+['"].*\.(jpg|jpeg|png|webp)['"]|src\/assets|\.\/assets|\.\.\/assets|\/public/i
const currentFileName = 'localImageImports.test.js'

function getSourceFiles(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const fullPath = join(directory, entry)
    const stats = statSync(fullPath)

    if (stats.isDirectory()) {
      return getSourceFiles(fullPath)
    }

    return /\.(js|jsx|css)$/.test(entry) && entry !== currentFileName ? [fullPath] : []
  })
}

describe('local image imports', () => {
  it('no existen imports de imagenes locales', () => {
    const matches = getSourceFiles(join(process.cwd(), 'src'))
      .map((filePath) => ({ filePath, content: readFileSync(filePath, 'utf8') }))
      .filter(({ content }) => imageImportPattern.test(content))

    expect(matches).toEqual([])
  })
})

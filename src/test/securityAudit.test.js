import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'fs'
import { join, relative } from 'path'

const SRC = join(process.cwd(), 'src')

function findAllFiles(dir, results = []) {
  const entries = readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      findAllFiles(fullPath, results)
    } else if (entry.isFile() && /\.(js|jsx|ts|tsx)$/.test(entry.name)) {
      results.push(fullPath)
    }
  }
  return results
}

function patternToRegex(p) {
  let re = p
  re = re.replace(/\./g, '\\.')
  re = re.replace(/\*\*/g, '.*')
  re = re.replace(/\*/g, '[^/]*')
  re = re.replace(/\{([^}]+)\}/g, (_, inner) => `(${inner.replace(/,/g, '|')})`)
  return new RegExp(`^${re}$`)
}

function findFiles(patterns, exclude = []) {
  const allFiles = findAllFiles(SRC)
  const regexes = patterns.map(patternToRegex)
  const excludeRegexes = exclude.map(patternToRegex)
  return allFiles
    .filter((f) => {
      const rel = relative(SRC, f).replace(/\\/g, '/')
      if (excludeRegexes.some((r) => r.test(rel))) return false
      return regexes.some((r) => r.test(rel))
    })
    .map((f) => ({ path: f, content: readFileSync(f, 'utf-8') }))
}

describe('Security audit', () => {
  it('RegisterPage no contiene selector de roles', () => {
    const files = findFiles(['features/auth/pages/RegisterPage.{jsx,js,tsx,ts}'])
    expect(files.length).toBeGreaterThan(0)
    for (const { content } of files) {
      expect(content).not.toMatch(/role.*selector/i)
      expect(content).not.toMatch(/<select/i)
      expect(content).not.toMatch(/registrarse como admin/i)
    }
  })

  it('no existe DEFAULT_USER_NAME en src/', () => {
    const files = findFiles(['**/*.{js,jsx,ts,tsx}'], ['**/*.test.*'])
    const hits = files.filter(({ content }) => content.includes('DEFAULT_USER_NAME'))
    expect(hits.length).toBe(0)
  })

  it('no existe /basket/{userName} en basketService', () => {
    const files = findFiles(['features/basket/services/basketService.{js,jsx,ts,tsx}'])
    expect(files.length).toBeGreaterThan(0)
    for (const { content } of files) {
      expect(content).not.toMatch(/\/basket\/\$\{/)
      expect(content).not.toMatch(/\/basket\/'/)
      expect(content).not.toMatch(/userName/)
    }
  })

  it('no existe JWT_KEY dentro de src/', () => {
    const files = findFiles(['**/*.{js,jsx,ts,tsx}'], ['**/*.test.*'])
    const hits = files.filter(({ content }) => content.includes('JWT_KEY'))
    expect(hits.length).toBe(0)
  })

  it('no existe console.log del accessToken en tokenStore', () => {
    const files = findFiles(['features/auth/services/tokenStore.{js,jsx,ts,tsx}'])
    expect(files.length).toBeGreaterThan(0)
    for (const { content } of files) {
      expect(content).not.toMatch(/console\.(log|debug|info|warn)/)
    }
  })
})

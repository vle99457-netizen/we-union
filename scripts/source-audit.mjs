import fs from 'node:fs'
import path from 'node:path'
import ts from 'typescript'

const root = process.cwd()
const srcRoot = path.join(root, 'src')
const issues = []

function sourceFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return sourceFiles(fullPath)
    return entry.isFile() && entry.name.endsWith('.tsx') ? [fullPath] : []
  })
}

function attrNames(node) {
  return new Set(
    node.attributes.properties
      .filter(ts.isJsxAttribute)
      .map((attribute) => attribute.name.getText()),
  )
}

function report(file, node, message) {
  const source = node.getSourceFile()
  const position = source.getLineAndCharacterOfPosition(node.getStart(source))
  issues.push(`${path.relative(root, file)}:${position.line + 1} - ${message}`)
}

for (const file of sourceFiles(srcRoot)) {
  const text = fs.readFileSync(file, 'utf8')
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX)

  function visit(node) {
    if (ts.isJsxSelfClosingElement(node) || ts.isJsxOpeningElement(node)) {
      const tag = node.tagName.getText()
      const attrs = attrNames(node)

      if (tag === 'img') {
        for (const required of ['alt', 'width', 'height']) {
          if (!attrs.has(required)) report(file, node, `<img> missing ${required}`)
        }
      }

      if (tag === 'button' && !attrs.has('type')) {
        report(file, node, '<button> missing explicit type')
      }

      if (['input', 'select', 'textarea'].includes(tag) && !attrs.has('name')) {
        report(file, node, `<${tag}> missing name`)
      }

      if (['div', 'span'].includes(tag) && attrs.has('onClick')) {
        report(file, node, `<${tag}> uses onClick instead of a semantic control`)
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(source)
}

const css = fs.readFileSync(path.join(srcRoot, 'styles.css'), 'utf8')
if (/transition\s*:\s*all\b/.test(css)) issues.push('src/styles.css - transition: all is prohibited')

const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8')
if (/user-scalable\s*=\s*no|maximum-scale\s*=\s*1/.test(html)) {
  issues.push('index.html - viewport disables zoom')
}
for (const marker of ['THESIS:', 'OWN-WORLD:', 'STORY:', 'FIRST VIEWPORT:', 'FORM:', 'FINISH:']) {
  if (!html.includes(marker)) issues.push(`index.html - missing design contract marker ${marker}`)
}

if (issues.length) {
  console.error(issues.join('\n'))
  process.exit(1)
}

console.log(`Source audit passed: ${sourceFiles(srcRoot).length} TSX files, image dimensions/alts, semantic controls, names, motion, zoom, and design contract.`)

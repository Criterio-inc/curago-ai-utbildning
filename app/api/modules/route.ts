import { NextResponse } from 'next/server'
import path from 'path'
import { parseAllModules } from '@/lib/markdown-parser'

export async function GET() {
  const projectRoot = path.resolve(process.cwd())
  const modules = parseAllModules(projectRoot)

  // Strip rawMarkdown to keep response size manageable
  const stripped = modules.map(({ rawMarkdown, ...rest }) => rest)

  return NextResponse.json(stripped)
}

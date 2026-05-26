'use client'

import { useTranslations } from 'next-intl'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { Search } from 'lucide-react'
import Graph from 'react-graph-vis'
import type { GraphDefinition } from '@openfga/frontend-utils/dist/utilities/graphs'
import type { Assertion } from '@openfga/sdk'
import { generateGraph } from '@/actions/open-fga.action'
import { useAppSelector } from '@/stores/store'

const treeOption = {
  nodes: {
    shape: 'box',
    shapeProperties: { borderRadius: 4 },
    margin: { top: 10, bottom: 10, left: 10, right: 10 },
    widthConstraint: { minimum: 100 },
    font: { strokeWidth: 0, size: 11, color: '#FFFFFF', face: 'arial', multi: true },
    borderWidth: 1,
  },
  edges: {
    width: 0.5,
    color: { color: '#6366f1', highlight: '#818cf8' },
    arrows: { to: { enabled: false }, from: { enabled: true } },
    font: { size: 11, color: '#FFFFFF', face: 'arial', align: 'horizontal', strokeWidth: 0 },
    smooth: { enabled: true, type: 'vertical', roundness: 0 },
  },
  physics: { enabled: true, stabilization: false },
  layout: { hierarchical: { enabled: true, sortMethod: 'directed', nodeSpacing: 100, levelSeparation: 200 } },
}

function formatAssertionQuery(a: Assertion) {
  return `Is ${a.tuple_key.user} related to ${a.tuple_key.object} as ${a.tuple_key.relation}?`
}

/**
 * Parse "Is user:alice related to document:readme as viewer?"
 * Returns { user, object, relation } or null if the format doesn't match.
 */
function parseAssertionQuery(
  query: string
): { user: string; object: string; relation: string } | null {
  const match = query
    .trim()
    .match(/^Is\s+(.+?)\s+related to\s+(.+?)\s+as\s+(.+?)\??$/i)
  if (!match) return null
  return { user: match[1].trim(), object: match[2].trim(), relation: match[3].trim() }
}

export default function VisTree() {
  const t = useTranslations('playground.assertions')
  const currentStore = useAppSelector((s) => s.storeFga.currentStore)
  const currentAssertion = useAppSelector((s) => s.assertionFga.currentAssertion)
  const inputRef = useRef<HTMLInputElement>(null)
  const [graphId, setGraphId] = useState(`graph-${Date.now()}`)
  const [graph, setGraph] = useState<GraphDefinition | null>(null)
  const [queryParams, setQueryParams] = useState<{ user: string; object: string } | null>(null)

  // currentAssertion changed → update input + trigger graph
  useEffect(() => {
    if (!currentAssertion?.tuple_key) return
    if (inputRef.current) {
      inputRef.current.value = formatAssertionQuery(currentAssertion)
    }
    setQueryParams({
      user: currentAssertion.tuple_key.user,
      object: currentAssertion.tuple_key.object,
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAssertion?.tuple_key?.user, currentAssertion?.tuple_key?.relation, currentAssertion?.tuple_key?.object])

  // queryParams changed → fetch graph from server
  useEffect(() => {
    if (!queryParams || !currentStore?.id) return
    generateGraph(queryParams.object, queryParams.user, currentStore.id).then(({ graph: g }) => {
      if (!g) return
      setGraph({
        ...g,
        nodes: g.nodes.map((n) => ({
          ...n,
          color:
            n.id === queryParams.object || n.id === queryParams.user
              ? {
                  background: '#6366f1',
                  border: '#6366f1',
                  highlight: { background: '#818cf8', border: '#818cf8' },
                }
              : undefined,
        })),
      })
      setGraphId(`graph-${Date.now()}`)
    })
  }, [queryParams, currentStore?.id])

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter') return
    const raw = inputRef.current?.value ?? ''
    const parsed = parseAssertionQuery(raw)
    if (!parsed) return
    setQueryParams({ user: parsed.user, object: parsed.object })
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex-1">
        {graph ? (
          <Graph
            key={graphId}
            identifier={graphId}
            graph={graph}
            options={{
              ...treeOption,
              nodes: {
                ...treeOption.nodes,
                color: {
                  background: '#1a1b1e',
                  border: '#2d2e33',
                  highlight: { background: '#2d2e33', border: '#6366f1' },
                },
              },
            }}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted">
            {t('noAssertions')}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 border-t border-border/60 bg-background px-3 py-2">
        <Search className="size-3.5 shrink-0 text-muted" />
        <input
          ref={inputRef}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted/50"
          placeholder="Is user:alice related to document:readme as viewer?"
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  )
}

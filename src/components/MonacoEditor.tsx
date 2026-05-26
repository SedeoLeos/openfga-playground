'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Copy, Save, FileJson } from 'lucide-react'
import Editor, { type Monaco } from '@monaco-editor/react'
import { theming, tools } from '@openfga/frontend-utils'
import { SchemaVersion } from '@openfga/frontend-utils/dist/constants/schema-version'
import { transformer as syntaxTransformer } from '@openfga/syntax-transformer'

// API compat: older packages exposed transformDSLToJSON / transformJSONToDSL
// Current package uses friendlySyntaxToApiSyntax / apiSyntaxToFriendlySyntax
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tr = syntaxTransformer as any
const dslToJson = tr.transformDSLToJSON ?? tr.friendlySyntaxToApiSyntax
const jsonToDsl = tr.transformJSONToDSL ?? tr.apiSyntaxToFriendlySyntax
import { createModelAction, getAuthorizationModel } from '@/actions/open-fga.action'
import { copyToClipboard } from '@/lib/utils'
import { setAuthorizationModelState, setCurrentDsl } from '@/stores/slice'
import { useAppDispatch, useAppSelector } from '@/stores/store'
import { Button } from '@/components/ui/button'

const DEFAULT_DSL = `model
  schema 1.1

type user

type document
  relations
    define viewer: [user]
    define editor: [user]
    define owner: [user]
`

function MonacoEditor() {
  const t = useTranslations('playground.model')
  const tc = useTranslations('common')

  const currentStore = useAppSelector((state) => state.storeFga.currentStore)
  const authorizationModel = useAppSelector((state) => state.authorizationModel.authorizationModel)
  const currentDsl = useAppSelector((state) => state.authorizationModel.currentDsl)
  const dispatch = useAppDispatch()

  const [isValid, setIsValid] = useState(true)
  const [isPending, startTransition] = useTransition()

  const dslValue = useMemo(() => {
    if (!authorizationModel) return DEFAULT_DSL
    try { return jsonToDsl(authorizationModel) }
    catch { return DEFAULT_DSL }
  }, [authorizationModel])

  const jsonValue = useMemo(() => {
    try { return JSON.stringify(dslToJson(dslValue), null, 2) }
    catch { return '' }
  }, [dslValue])

  const updateModel = useCallback(async () => {
    if (!currentStore?.id) return
    const { model, error } = await getAuthorizationModel(currentStore.id)
    if (error) toast.error(t('errors.saveFailed'))
    else if (model) dispatch(setAuthorizationModelState(model))
  }, [currentStore, dispatch, t])

  useEffect(() => { updateModel() }, [currentStore, updateModel])

  const handleMount = (editor: unknown, monaco: Monaco) => {
    tools.MonacoExtensions.registerDSL(monaco, SchemaVersion.OneDotTwo, { documentationMap: {} })
    monaco.editor.defineTheme(
      theming.SupportedTheme.OpenFgaDark,
      tools.MonacoExtensions.buildMonacoTheme(theming.supportedThemes['openfga-dark'])
    )
    monaco.editor.setTheme(theming.SupportedTheme.OpenFgaDark)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model = (editor as any).getModel()
    if (model) {
      model.onDidChangeContent(() => {
        const value = model.getValue()
        const markers = tools.MonacoExtensions.validateDSL(monaco, value)
        monaco.editor.setModelMarkers(model, 'openfga', markers)
        setIsValid(markers.length === 0)
      })
    }
  }

  function handleSave() {
    if (!isValid || !currentDsl || !currentStore?.id) return
    startTransition(async () => {
      const res = await createModelAction({ id: currentStore.id!, body: currentDsl })
      if (res?.data?.error || res?.serverError) {
        toast.error(res?.data?.error ?? t('errors.saveFailed'))
        return
      }
      await updateModel()
      toast.success(t('saved'))
    })
  }

  const typeCount = authorizationModel?.type_definitions?.length ?? 0

  return (
    <div className="flex flex-col" style={{ height: 'clamp(220px, 40%, 480px)' }}>
      {/* Toolbar */}
      <div className="flex shrink-0 items-center justify-between border-b border-border/60 px-3 py-1.5">
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="font-medium text-foreground">Authorization Model</span>
          {typeCount > 0 && (
            <span className="rounded bg-surface-raised px-1.5 py-0.5">
              {typeCount} types
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-xs"
            onClick={() => { copyToClipboard(jsonValue); toast.success(tc('copied')) }}
            title="Copy JSON"
          >
            <FileJson className="size-3.5" />
            JSON
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 px-2 text-xs"
            onClick={() => { copyToClipboard(dslValue); toast.success(tc('copied')) }}
            title="Copy DSL"
          >
            <Copy className="size-3.5" />
            DSL
          </Button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          theme="openfga-dark"
          onMount={handleMount}
          defaultLanguage="dsl.openfga"
          value={dslValue}
          options={{
            minimap: { enabled: false },
            wordWrap: 'on',
            fontSize: 12,
            lineHeight: 22,
            padding: { top: 8, bottom: 8 },
            scrollBeyondLastLine: false,
            renderLineHighlight: 'gutter',
          }}
          onChange={(value) => { if (value) dispatch(setCurrentDsl(value)) }}
        />
      </div>

      {/* Save bar */}
      <div className="flex shrink-0 items-center justify-between border-t border-border/60 px-3 py-1.5">
        {!isValid && (
          <span className="text-xs text-destructive">{t('errors.invalidDsl')}</span>
        )}
        <div className="ml-auto">
          <Button
            size="sm"
            className="h-7 gap-1.5 px-3 text-xs"
            disabled={!isValid || isPending || !currentStore?.id}
            onClick={handleSave}
          >
            {isPending ? (
              <>
                <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t('saving')}
              </>
            ) : (
              <>
                <Save className="size-3.5" />
                {t('save')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default MonacoEditor

/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { getAuthorizationModel } from '@/actions/open-fga.action';
import { setAuthorizationModelState } from '@/stores/slice';
import { useAppDispatch, useAppSelector } from '@/stores/store';
import Editor, { Monaco } from '@monaco-editor/react';
import { theming, tools, } from '@openfga/frontend-utils';
import { SchemaVersion } from '@openfga/frontend-utils/dist/constants/schema-version';
import { transformer } from '@openfga/syntax-transformer';
import { useCallback, useEffect, useMemo, useState } from 'react';
import PasteIcon from './icons/Paste';
import { Button } from './ui/button';
import { useRef } from 'react';

const defaultValueCONST = `slaega`



function MonacoEditor() {



    const handleEditorDidMount = (editor: unknown, monaco: Monaco) => {
        tools.MonacoExtensions.registerDSL(monaco, SchemaVersion.OneDotTwo, {
            documentationMap: {}
        })
        monaco.editor.defineTheme(theming.SupportedTheme.OpenFgaDark, tools.MonacoExtensions.buildMonacoTheme(theming.supportedThemes['openfga-dark']));
        // Appliquer le thème
        monaco.editor.setTheme(theming.SupportedTheme.OpenFgaDark);
    };
    const currentStoreState = useAppSelector((state) => state.storeFga.currentStore);
    const authorizationModelState = useAppSelector((state) => state.authorizationModel.authorizationModel);
    const dispatch = useAppDispatch();

    const dslValue = useMemo(() => {
        if (!authorizationModelState) return defaultValueCONST;
        return transformer.transformJSONToDSL(authorizationModelState);
    }, [authorizationModelState]);

    const updateValue = useCallback(async () => {
        if (!currentStoreState) return
        const authorizationModel = await getAuthorizationModel(currentStoreState.id)
        if (authorizationModel) {
            dispatch(setAuthorizationModelState(authorizationModel))
        }
    }, [currentStoreState, dispatch]);

    const jsonValue = useMemo(() => {
        if (!authorizationModelState) return defaultValueCONST;
        return transformer.transformDSLToJSON(dslValue);
    }, [authorizationModelState, dslValue]);
    const [currentDls, setCurrentDls] = useState<string>(dslValue)


    useEffect(() => {

        updateValue()
    }, [currentStoreState, updateValue])

    const copyToClipboard = async (text: string) => {
        const result = await navigator.clipboard.writeText(text)
        return result;
    }
    const TypeNumber = (): string => {
        if (authorizationModelState) return `(${authorizationModelState.type_definitions.length} Types)`
        return ""
    }
    const handleEditorSave = () => {

    }
    return (
        <div className='max-h-[500px] min-h-[500px] flex flex-1 flex-col'>
            <div className='flex justify-between items-center px-5'>
                <div className='text-white'><span>Authorization Model</span> {TypeNumber()}</div>
                <div className='flex gap-4'>
                    <Button className='!bg-transparent' onClick={() => copyToClipboard(jsonValue)}>
                        <PasteIcon />
                        <span >JSON</span>
                    </Button>
                    <Button className='!bg-transparent' onClick={() => copyToClipboard(dslValue)}>
                        <PasteIcon />
                        <span >DLS</span>
                    </Button>
                </div>
            </div>
            <Editor
                theme={'openfga-dark'}
                onMount={handleEditorDidMount}
                defaultLanguage="dsl.openfga"
                defaultValue={defaultValueCONST}
                value={dslValue}
                onChange={(value) => {
                    if (value) {
                        setCurrentDls(value)

                    }
                }}

            />
            <div className='p-2 flex justify-end items-center'>
                <Button className='bg-indigo-500 hover:bg-indigo-600' onClick={() => handleEditorSave()}>SAVE</Button>
            </div>
        </div>
    )
}

export default MonacoEditor
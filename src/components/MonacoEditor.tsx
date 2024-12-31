'use client'
import Editor, { Monaco } from '@monaco-editor/react';
import React from 'react'
import { Button } from './ui/button';
import PasteIcon from './icons/paste';
import { theming, tools, } from '@openfga/frontend-utils';
import { SchemaVersion } from '@openfga/frontend-utils/dist/constants/schema-version';

const defaultValue = `
model
  schema 1.1
  type user
  type application
  type system
    relations
      define sys_admin: [user,application]
  type org
    relations
      define parent: [system]
      define owner: [user]
      define admin: [user] or owner or sys_admin from parent
      define can_modify: admin
      define can_manage_roles: admin
      define org_editor: [user,  role#assignee]  or admin
      define org_viewer: [user,  role#assignee]  or admin
      define org_remover: [user,  role#assignee]  or admin

    ### BEGIN ----- collaborator ---------

      define collaborator_creator:  [user,  role#assignee]  or admin
      define collaborator_editor: [user,  role#assignee]  or admin
      define collaborator_remover:  [user,  role#assignee]  or admin
      define collaborator_viewer: [user,  role#assignee]  or collaborator_editor or collaborator_creator or collaborator_remover or contract_viewer

    ### END ----- collaborator ---------

    ### BEGIN ----- contract ---------

      define contract_creator:  [user,  role#assignee]  or admin
      define contract_remover:  [user,  role#assignee]  or admin
      define contract_editor: [user, role#assignee]  or admin
      define contract_viewer: [user, role#assignee]  or contract_editor or contract_remover or contract_creator

    ### END ----- contract ---------

    ### BEGIN ----- salary ---------
      define salary_creator:  [user,  role#assignee]  or admin
      define salary_remover:  [user,  role#assignee]  or admin
      define salary_editor: [user,  role#assignee]  or admin
      define salary_viewer: [user,  role#assignee]  or salary_editor or salary_remover or salary_creator

    ### END ----- salary ---------
  
  type collaborator
    relations
      define org: [org]
      define owner: [user]
      define edit: [user] or collaborator_editor from org or owner
      define view: [user] or edit or collaborator_viewer from org or owner
      define remove: [user] or edit or collaborator_remover from org or owner
      define contract_viewer: [user] or owner or contract_viewer from org


  type contract
    relations
        define  org: [org]
        define  view_collaborator: [collaborator]
        define  owner: [user]
        define  edit: [user] or contract_editor from org or owner
        define  view: [user] or edit or contract_viewer from org or owner
        define  remove:  [user] or contract_remover from org or owner



  type salary
    relations
        define  org: [org]
        define  contract: [contract]
        define  edit: [user] or salary_editor from org
        define  view: [user] or edit or salary_viewer from org
        define  remove: [user] or edit or salary_remover from org
  type payslip

  type role
    relations
      define assignee: [user]`



function MonacoEditor() {

    const handleEditorDidMount = (editor: unknown, monaco: Monaco) => {
        tools.MonacoExtensions.registerDSL(monaco, SchemaVersion.OneDotTwo, {
            documentationMap: {}
        })
        console.log(tools.MonacoExtensions.buildMonacoTheme(theming.supportedThemes['openfga-dark']))
        monaco.editor.defineTheme(theming.SupportedTheme.OpenFgaDark, tools.MonacoExtensions.buildMonacoTheme(theming.supportedThemes['openfga-dark']));
        // Appliquer le thème
        monaco.editor.setTheme(theming.SupportedTheme.OpenFgaDark);
    };
    return (
        <div className='max-h-[600px] flex flex-1 flex-col'>
            <div className='flex justify-between items-center px-5'>
                <div className='text-white'><span>Authorization Model</span> (4 types)</div>
                <div className='flex gap-4'>
                    <Button className='!bg-transparent'>
                        <PasteIcon />
                        <span >JSON</span>
                    </Button>
                    <Button className='!bg-transparent'>
                        <PasteIcon />
                        <span >DLS</span>
                    </Button>
                </div>
            </div>
            <Editor
                theme={'openfga-dark'}
                onMount={handleEditorDidMount}
                className='w-full'
                defaultLanguage="dsl.openfga"
                defaultValue={defaultValue}

            />
            <div className='p-5 flex justify-end items-center'>
                <Button>SAVE</Button>
            </div>
        </div>
    )
}

export default MonacoEditor
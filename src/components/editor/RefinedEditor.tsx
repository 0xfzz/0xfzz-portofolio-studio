'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { 
  headingsPlugin, 
  listsPlugin, 
  quotePlugin, 
  thematicBreakPlugin, 
  markdownShortcutPlugin, 
  toolbarPlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  frontmatterPlugin,
  MDXEditorProps,
  BoldItalicUnderlineToggles,
  UndoRedo,
  BlockTypeSelect,
  CreateLink,
  CodeToggle,
  ListsToggle,
  InsertTable,
  InsertCodeBlock,
  Separator,
  CodeMirrorEditor,
  type MDXEditorMethods
} from '@mdxeditor/editor'
import { MermaidCodeEditor } from './MermaidCodeEditor'

// Import styles
import '@mdxeditor/editor/style.css'

// Dynamic import for the actual editor to prevent SSR issues
const MDXEditor = dynamic(() => import('@mdxeditor/editor').then((mod) => mod.MDXEditor), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full animate-pulse bg-gray-50 rounded flex items-center justify-center">
      <span className="text-gray-400 font-mono text-sm">Initializing Editor...</span>
    </div>
  )
})

interface RefinedEditorProps extends Omit<MDXEditorProps, 'plugins'> {
  editorRef?: React.RefObject<MDXEditorMethods | null>
}

export default function RefinedEditor({ markdown, onChange, editorRef, ...props }: RefinedEditorProps) {
  return (
    <div className="mdx-editor-wrapper">
      <MDXEditor
        ref={editorRef}
        markdown={markdown}
        onChange={onChange}
        className="refined-mdx-editor"
        contentEditableClassName="refined-markdown-content mdx-editor-content focus:outline-none min-h-[500px] py-10"
        toMarkdownOptions={{
          bullet: '-',
          rule: '-',
        }}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          tablePlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          imagePlugin(),
          frontmatterPlugin(),
          codeBlockPlugin({ 
            defaultCodeBlockLanguage: 'typescript',
            codeBlockEditorDescriptors: [
              {
                priority: 100,
                match: (language) => language === 'mermaid',
                Editor: MermaidCodeEditor
              },
              {
                priority: 1,
                match: () => true,
                Editor: CodeMirrorEditor
              }
            ]
          }),
          codeMirrorPlugin({ 
            codeBlockLanguages: { 
              js: 'JavaScript', 
              javascript: 'JavaScript',
              ts: 'TypeScript', 
              typescript: 'TypeScript', 
              css: 'CSS', 
              html: 'HTML', 
              python: 'Python', 
              mermaid: 'Mermaid',
              markdown: 'Markdown'
            } 
          }),
          markdownShortcutPlugin(),
          toolbarPlugin({
            toolbarContents: () => (
              <div className="flex flex-wrap items-center gap-1 p-1 bg-white/80 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-100 mb-4 rounded-t-md">
                <UndoRedo />
                <Separator />
                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <Separator />
                <ListsToggle />
                <Separator />
                <BlockTypeSelect />
                <Separator />
                <CreateLink />
                <InsertTable />
                <InsertCodeBlock />
              </div>
            )
          })
        ]}
        {...props}
      />
    </div>
  )
}

'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { CheckCircle2 } from 'lucide-react'

interface MarkdownRendererProps {
  content: string
  placeholder?: string
}

export function MarkdownRenderer({ content, placeholder = '*Start writing to see the preview...*' }: MarkdownRendererProps) {
  let hasAppliedDropCap = false

  return (
    <ReactMarkdown 
      remarkPlugins={[remarkGfm]}
      components={{
        h2: ({ children }) => (
          <div className="pt-12 border-t border-[#eee] space-y-8 mt-12 first:mt-0 first:pt-0 first:border-0">
            <h2 className="text-[18px] font-bold text-[#1a1a1a] tracking-tight">
              {children}
            </h2>
          </div>
        ),
        h3: ({ children }) => (
          <div className="pt-12 border-t border-[#eee] space-y-8 mt-12 first:mt-0 first:pt-0 first:border-0">
            <h3 className="text-[12px] font-extrabold text-[#1a1a1a] uppercase tracking-[0.3em]">
              {children}
            </h3>
          </div>
        ),
        p: ({ children }) => {
          const extractText = (node: any): string => {
            if (typeof node === 'string') return node
            if (Array.isArray(node)) return node.map(extractText).join('')
            if (node?.props?.children) return extractText(node.props.children)
            return ''
          }

          const fullText = extractText(children)
          if (!hasAppliedDropCap && fullText.trim().length > 5) {
            hasAppliedDropCap = true
            const firstChar = fullText.trim().charAt(0)
            return (
              <div className="flex gap-4 items-start relative pl-14 min-h-[60px] mb-8">
                <span className="absolute left-0 top-0 text-[56px] font-bold text-[#1a1a1a] leading-none mt-1 uppercase">
                  {firstChar}
                </span>
                <div className="text-[16px] text-[#444] leading-relaxed font-mono">
                   {React.Children.map(children, (child, i) => {
                     if (i === 0 && typeof child === 'string') return child.slice(1)
                     return child
                   })}
                </div>
              </div>
            )
          }
          return <p className="text-[16px] text-[#444] leading-relaxed font-mono mb-8 last:mb-0">{children}</p>
        },
        ul: ({ children }) => <ul className="space-y-6 list-none p-0 my-10">{children}</ul>,
        li: ({ children }) => (
          <li className="flex items-start gap-4 group">
            <CheckCircle2 className="w-5 h-5 text-[#1e7e34] shrink-0 mt-0.5" strokeWidth={1.5} />
            <span className="text-[14px] text-[#555] font-medium leading-tight group-hover:text-[#1a1a1a] transition-colors">{children}</span>
          </li>
        ),
        code: ({ node, inline, className, children, ...props }: any) => {
          const match = /language-(\w+)/.exec(className || '')
          return !inline && match ? (
            <div className="my-8 rounded-md overflow-hidden shadow-lg border border-[#333]">
              <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-[#3d3d3d]">
                <span className="text-[10px] font-bold text-[#888] uppercase tracking-widest">{match[1]}</span>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-[#ff5f56]" /><div className="w-2 h-2 rounded-full bg-[#ffbd2e]" /><div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                </div>
              </div>
              <SyntaxHighlighter {...props} style={vscDarkPlus} language={match[1]} PreTag="div" customStyle={{ margin: 0, padding: '1.5rem', fontSize: '13px', backgroundColor: '#1e1e1e' }}>
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            </div>
          ) : <code className="bg-[#f5f5f5] px-1.5 py-0.5 rounded-sm text-[13px] font-mono text-[#e83e8c] border border-[#eee]">{children}</code>
        },
        pre: ({ children }) => <>{children}</>,
      }}
    >
      {content || placeholder}
    </ReactMarkdown>
  )
}

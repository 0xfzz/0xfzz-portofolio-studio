'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { CheckCircle2 } from 'lucide-react'
import { Mermaid } from './Mermaid'

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
        h1: ({ children }) => (
          <h1 className="text-[32px] font-extrabold text-[#1a1a1a] tracking-tight leading-tight mt-16 mb-8 first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-[20px] font-bold text-[#1a1a1a] tracking-tight mt-12 mb-6 border-t border-[#eee] pt-12 first:mt-0 first:pt-0 first:border-0">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-[14px] font-extrabold text-[#1a1a1a] uppercase tracking-wider mt-10 mb-5 border-t border-[#eee] pt-10 first:mt-0 first:pt-0 first:border-0">
            {children}
          </h3>
        ),
        p: ({ children }) => {
          const extractText = (node: any): string => {
            if (typeof node === 'string') return node
            if (Array.isArray(node)) return node.map(extractText).join('')
            if (node?.props?.children) return extractText(node.props.children)
            return ''
          }

          const fullText = extractText(children)
          // Avoid drop caps on tables and short text
          if (!hasAppliedDropCap && fullText.trim().length > 30 && !fullText.includes('|')) {
            hasAppliedDropCap = true
            const trimmedText = fullText.trim()
            const firstChar = trimmedText.charAt(0)
            return (
              <div className="flex gap-6 items-start relative pl-16 min-h-[70px] mb-8">
                <span className="absolute left-0 top-0 text-[64px] font-sans font-bold text-[#1a1a1a] leading-[0.8] mt-2 uppercase select-none">
                  {firstChar}
                </span>
                <div className="text-[18px] text-[#444] leading-relaxed font-sans font-medium text-justify tracking-tight opacity-90">
                   {React.Children.map(children, (child, i) => {
                     if (i === 0 && typeof child === 'string') {
                       const charIndex = child.indexOf(firstChar)
                       if (charIndex !== -1) {
                         return child.slice(0, charIndex) + child.slice(charIndex + 1)
                       }
                     }
                     return child
                   })}
                 </div>
              </div>
            )
          }
          return <div className="text-[18px] text-[#444] leading-relaxed font-sans font-medium text-justify tracking-tight opacity-90 mb-8 last:mb-0">{children}</div>
        },
        li: ({ children }) => (
          <li className="flex items-start gap-4 group mb-4 last:mb-0">
            <CheckCircle2 className="w-5 h-5 text-[#1e7e34] shrink-0 mt-0.5" strokeWidth={1.5} />
            <span className="text-[14px] text-[#555] font-medium leading-tight group-hover:text-[#1a1a1a] transition-colors">{children}</span>
          </li>
        ),
        code: ({ node, inline, className, children, ...props }: any) => {
          const match = /language-(\w+)/.exec(className || '')
          const language = match ? match[1] : ''
          const content = String(children).replace(/\n$/, '')
          
          if (language === 'mermaid') {
            return <Mermaid chart={content} />
          }

          // If it's a multi-line block, render as a boxed code block
          if (!inline && content.includes('\n')) {
            return (
              <div className="my-8 rounded-md overflow-hidden border border-[#f0f0f0] bg-[#1e1e1e]">
                <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-[#3d3d3d]">
                  <span className="text-[11px] font-bold text-[#888] uppercase tracking-wider">{language || 'plaintext'}</span>
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#ff5f56]" /><div className="w-2 h-2 rounded-full bg-[#ffbd2e]" /><div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                  </div>
                </div>
                {match ? (
                  <SyntaxHighlighter {...props} style={vscDarkPlus} language={language} PreTag="div" customStyle={{ margin: 0, padding: '1.5rem', fontSize: '13px', backgroundColor: '#1e1e1e' }}>
                    {content}
                  </SyntaxHighlighter>
                ) : (
                  <pre className="p-6 overflow-x-auto text-[13px] font-mono text-[#d1d1d1] bg-[#1e1e1e]">
                    {content}
                  </pre>
                )}
              </div>
            )
          }

          // Otherwise, render as inline code (even if parser said !inline)
          return <code className="px-1.5 py-0.5 rounded-sm text-[13px] font-mono text-[#1a1a1a] bg-[#f5f5f5] border border-[#ebebeb] mx-0.5">{children}</code>
        },
        pre: ({ children }) => <>{children}</>,
        table: ({ children }) => (
          <div className="my-10 overflow-x-auto border border-[#f0f0f0] rounded-sm bg-white">
            <table className="w-full border-collapse text-left">
              {children}
            </table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-[#fafafa] border-b border-[#f0f0f0]">{children}</thead>,
        th: ({ children }) => (
          <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-[#1a1a1a] opacity-60">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-6 py-4 text-[14px] text-[#444] border-b border-[#f8f8f8] last:border-0 leading-relaxed font-medium tracking-tight">
            {children}
          </td>
        ),
        tr: ({ children }) => <tr className="hover:bg-[#fcfcfc] transition-colors">{children}</tr>,
        a: ({ children, href, title }) => (
          <a
            href={href}
            title={title}
            className="text-[#0366d6] hover:underline font-medium decoration-[#0366d6]/30 underline-offset-4"
            target={href?.startsWith('http') ? '_blank' : undefined}
            rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          >
            {children}
          </a>
        ),
      }}
    >
      {content || placeholder}
    </ReactMarkdown>
  )
}

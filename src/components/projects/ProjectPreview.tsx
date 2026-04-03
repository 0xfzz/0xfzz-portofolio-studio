import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import RefinedEditor from '@/components/editor/RefinedEditor'
import { PreviewWorkspace } from '@/components/editor/PreviewWorkspace'
import { ExternalLink, Code } from 'lucide-react'

interface ProjectPreviewProps {
  data: {
    title: string
    description: string
    imageUrl: string
    liveUrl?: string
    sourceUrl: string
    technologies: string[]
    content: string
  }
  onContentChange: (content: string) => void
}

export function ProjectPreview({ data, onContentChange }: ProjectPreviewProps) {
  return (
    <PreviewWorkspace title="Live Editor">
      {/* Project Hero */}
      <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center relative border border-gray-100 shadow-2xl">
        {data.imageUrl ? (
          <img src={data.imageUrl} className="w-full h-full object-cover" alt="Preview" />
        ) : (
          <div className="text-white opacity-20 font-mono text-[12px] uppercase tracking-wider">Project Cover Image</div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="space-y-10">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {data.technologies.map(tech => (
              <Badge key={tech} variant="tag" className="bg-gray-100 text-gray-600 border-none px-3 py-1">{tech}</Badge>
            ))}
          </div>
          <h1 className="text-[56px] font-sans font-black text-gray-900 tracking-tight leading-[1.1] mb-8">
            {data.title || 'Project Title'}
          </h1>
          <div className="text-[20px] text-gray-500 font-medium leading-relaxed max-w-[700px]">
            {data.description || 'Edit the description in the sidebar...'}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <a href={data.liveUrl || '#'} target="_blank" rel="noopener noreferrer">
            <Button variant="primary" className="h-12 px-8 rounded-full">
              <ExternalLink className="w-4 h-4 mr-2" /> Live Demo
            </Button>
          </a>
          <a href={data.sourceUrl || '#'} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="h-12 px-8 rounded-full border-gray-200">
              <Code className="w-4 h-4 mr-2" /> Source Code
            </Button>
          </a>
        </div>

        <div className="pt-20 border-t border-gray-100">
          <div className="mb-8">
            <span className="text-[13px] font-bold text-gray-400">Project Content</span>
          </div>
          <RefinedEditor
            markdown={data.content}
            onChange={onContentChange}
          />
        </div>
      </div>
    </PreviewWorkspace>
  )
}


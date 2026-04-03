import { Badge } from '@/components/ui/Badge'
import RefinedEditor from '@/components/editor/RefinedEditor'
import { PreviewWorkspace } from '@/components/editor/PreviewWorkspace'

interface BlogPreviewProps {
  data: {
    title: string
    slug: string
    description: string
    imageUrl: string
    tags: string[]
    content: string
  }
  onContentChange: (content: string) => void
}

export function BlogPreview({ data, onContentChange }: BlogPreviewProps) {
  return (
    <PreviewWorkspace title="Blog Editor">
      {/* Main Hero Image */}
      <div className="aspect-[16/9] bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center relative border border-gray-100 shadow-xl">
        {data.imageUrl ? (
          <img src={data.imageUrl} className="w-full h-full object-cover" alt="Preview" />
        ) : (
          <div className="text-white opacity-20 font-mono text-[12px] uppercase tracking-wider">Blog Cover Image</div>
        )}
      </div>

      <div className="space-y-8">
        <div className="flex flex-wrap gap-2">
          {data.tags.map(tag => (
            <Badge key={tag} variant="tag" className="bg-gray-50 text-gray-500 border-none">{tag}</Badge>
          ))}
        </div>

        <h1 className="text-[48px] font-sans font-black text-gray-900 tracking-tight leading-tight">
          {data.title || 'Entry Title'}
        </h1>

        {data.description && (
          <div className="text-[20px] text-gray-500 font-medium leading-relaxed italic border-l-4 border-gray-100 pl-8 py-2">
            {data.description}
          </div>
        )}

        <div className="pt-12 border-t border-gray-100">
          <div className="mb-8">
            <span className="text-[13px] font-bold text-gray-300">Article Content</span>
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


import { Handle, Position } from 'reactflow'
import { TYPE_META, type NodeType } from '../data'
import type { FlowNodeData } from '../graphData'

const SRC = { label: '真相源', color: '#2fe39a' }

export default function ArchNode({ data }: { data: FlowNodeData }) {
  const meta = data.kind === 'source' ? SRC : TYPE_META[data.kind as NodeType]
  return (
    <div
      className="group flex items-center gap-2.5 rounded-xl border bg-surface2/90 px-3.5 py-2.5 backdrop-blur transition-transform duration-200 hover:-translate-y-0.5"
      style={{ borderColor: meta.color + '66', boxShadow: `inset 0 0 0 1px ${meta.color}33` }}
    >
      <Handle type="target" position={Position.Left} />
      <span
        className="h-2.5 w-2.5 flex-none rounded-full"
        style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}99` }}
      />
      <div className="leading-tight">
        <div className="text-[13px] font-semibold text-ink">{data.label}</div>
        {data.sub && <div className="font-mono text-[10px] text-mute">{data.sub}</div>}
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  )
}

import { useMemo } from 'react'
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  type Edge,
  type Node,
} from 'reactflow'
import 'reactflow/dist/style.css'
import ArchNode from './ArchNode'
import { GRAPH_EDGES, GRAPH_NODES } from '../graphData'

const nodeTypes = { arch: ArchNode }

export default function TopologyGraph() {
  const nodes = useMemo<Node[]>(() => GRAPH_NODES, [])
  const edges = useMemo<Edge[]>(() => GRAPH_EDGES, [])

  return (
    <div
      className="h-[560px] w-full overflow-hidden rounded-2xl border border-bd bg-bg2/60"
      style={{ boxShadow: '0 8px 28px rgba(0,0,0,.4)' }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        minZoom={0.4}
        maxZoom={1.6}
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
        nodesDraggable
        elementsSelectable={false}
      >
        <Background variant={BackgroundVariant.Dots} gap={22} size={1} color="#1e2746" />
        <Controls
          showInteractive={false}
          className="!border-bd [&>button]:!border-bd [&>button]:!bg-surface2 [&>button]:!fill-dim [&>button:hover]:!bg-surface3"
        />
      </ReactFlow>
    </div>
  )
}

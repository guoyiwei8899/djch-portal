// 全景关系图：Git → ArgoCD → 入口 → 服务 → 共享基础设施
// React Flow 节点 / 边定义。节点按类型上色（与 TYPE_META 对齐）。
import type { Edge, Node } from 'reactflow'
import { MarkerType } from 'reactflow'
import type { NodeType } from './data'

export interface FlowNodeData {
  label: string
  sub?: string
  kind: NodeType | 'source'
}

const COL = { src: 0, argo: 250, ing: 520, svc: 830, infra: 1140 }

const n = (
  id: string,
  x: number,
  y: number,
  label: string,
  kind: FlowNodeData['kind'],
  sub?: string,
): Node<FlowNodeData> => ({
  id,
  position: { x, y },
  data: { label, sub, kind },
  type: 'arch',
  sourcePosition: 'right' as any,
  targetPosition: 'left' as any,
})

export const GRAPH_NODES: Node<FlowNodeData>[] = [
  n('git', COL.src, 300, 'GitHub', 'source', 'k8s-gitops'),
  n('argocd', COL.argo, 300, 'ArgoCD', 'app', '持续同步'),

  // 入口
  n('traefik', COL.ing, 120, 'Traefik', 'net', 'LB .240'),
  n('cloudflared', COL.ing, 300, 'cloudflared', 'net', '公网隧道'),
  n('nginx', COL.ing, 460, 'ingress-nginx', 'net', 'uyuni'),

  // 服务
  n('aidc', COL.svc, 0, 'aidc', 'app'),
  n('netbox', COL.svc, 90, 'netbox', 'app'),
  n('wikijs', COL.svc, 180, 'Wiki.js', 'app'),
  n('semaphore', COL.svc, 270, 'Semaphore', 'app'),
  n('immich', COL.svc, 360, 'immich', 'app'),
  n('authentik', COL.svc, 470, 'Authentik', 'app'),
  n('uyuni', COL.svc, 560, 'Uyuni', 'app'),
  n('monitoring', COL.svc, 660, '监控栈', 'app'),

  // 共享基础设施
  n('zabbix', COL.infra, 0, 'Zabbix API', 'ext', '硬件数据'),
  n('valkey', COL.infra, 110, 'Valkey', 'cache', '缓存/队列'),
  n('pgha', COL.infra, 230, 'PostgreSQL-HA', 'data', 'pgpool ×3'),
  n('secrets', COL.infra, 360, 'sealed-secrets', 'sec', '机密'),
  n('ipa', COL.infra, 470, 'FreeIPA', 'ext', 'LDAP'),
  n('loki', COL.infra, 620, 'Loki', 'data', '日志'),
]

const e = (
  s: string,
  t: string,
  color: string,
  dashed = false,
  animated = false,
): Edge => ({
  id: `${s}-${t}`,
  source: s,
  target: t,
  style: { stroke: color, strokeWidth: 1.6, ...(dashed ? { strokeDasharray: '5 4' } : {}) },
  animated,
  markerEnd: { type: MarkerType.ArrowClosed, color, width: 16, height: 16 },
})

const GREEN = '#2fe39a'
const NET = '#38bdf8'
const DATA = '#b07cff'
const CACHE = '#21d4fd'
const EXT = '#ffb224'
const SEC = '#ff7b7b'

export const GRAPH_EDGES: Edge[] = [
  e('git', 'argocd', GREEN, false, true),
  // ArgoCD 持续同步（虚线代表“管理”）
  e('argocd', 'traefik', GREEN, true),
  e('argocd', 'cloudflared', GREEN, true),
  e('argocd', 'nginx', GREEN, true),
  e('argocd', 'monitoring', GREEN, true),
  e('argocd', 'secrets', GREEN, true),

  // 入口 → 服务
  e('traefik', 'aidc', NET),
  e('traefik', 'netbox', NET),
  e('traefik', 'wikijs', NET),
  e('traefik', 'semaphore', NET),
  e('cloudflared', 'immich', NET),
  e('nginx', 'uyuni', NET),

  // 服务 → 共享基础设施
  e('aidc', 'zabbix', EXT),
  e('aidc', 'secrets', SEC),
  e('immich', 'pgha', DATA),
  e('immich', 'valkey', CACHE),
  e('netbox', 'valkey', CACHE),
  e('semaphore', 'pgha', DATA),
  e('semaphore', 'secrets', SEC),
  e('authentik', 'ipa', EXT),
  e('monitoring', 'loki', DATA),
]

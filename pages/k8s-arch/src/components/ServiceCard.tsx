import { useState } from 'react'
import {
  Activity,
  BookText,
  Boxes,
  ChevronRight,
  Database,
  Image,
  LayoutGrid,
  RefreshCw,
  Settings2,
  ShieldCheck,
  Terminal,
  type LucideIcon,
} from 'lucide-react'
import { TYPE_META, type DepNode, type Service } from '../data'
import CodeBlock from './CodeBlock'

const ICONS: Record<string, LucideIcon> = {
  LayoutGrid,
  Image,
  Database,
  Boxes,
  BookText,
  RefreshCw,
  Terminal,
  ShieldCheck,
  Activity,
}

function Node({ node }: { node: DepNode }) {
  const meta = TYPE_META[node.type]
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg border bg-surface2 px-2.5 py-1.5 text-[12.5px] font-semibold transition-transform duration-200 hover:scale-105"
      style={{ borderColor: meta.color + '55', boxShadow: `inset 0 0 0 1px ${meta.color}33` }}
    >
      <span className="h-[7px] w-[7px] flex-none rounded-full" style={{ background: meta.color }} />
      {node.label}
      {node.sub && <small className="font-mono text-[10.5px] font-normal text-mute">{node.sub}</small>}
    </span>
  )
}

export default function ServiceCard({ svc }: { svc: Service }) {
  const [open, setOpen] = useState(false)
  const Icon = ICONS[svc.icon] ?? Boxes

  return (
    <div className="reveal group relative overflow-hidden rounded-2xl border border-bd bg-gradient-to-b from-surface to-bg2 p-[22px] transition-all duration-300 hover:-translate-y-1.5 hover:border-bd2 hover:shadow-card">
      {/* 头部 */}
      <div className="mb-1.5 flex items-start gap-3">
        <div className="grid h-[42px] w-[42px] flex-none place-items-center rounded-xl border border-bd bg-surface2">
          <Icon size={22} className="text-nApp" strokeWidth={1.7} />
        </div>
        <div>
          <div className="text-[18px] font-bold leading-tight">{svc.name}</div>
          <div className="font-mono text-[11.5px] text-mute">ns: {svc.ns}</div>
        </div>
      </div>
      <div className="mb-4 mt-1 text-[13.5px] text-dim">{svc.role}</div>

      {/* 关系图 / 依赖链 */}
      <div className="mb-4 rounded-xl border border-dashed border-bd2 bg-bg p-3.5">
        <div className="mb-3 flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-mute">
          <span className="h-1.5 w-1.5 rounded-full bg-nApp" /> 关系图 · 依赖链
        </div>
        <div className="flex flex-col gap-2.5">
          {svc.flow.map((step, i) => (
            <div key={i} className="flex items-center gap-2.5">
              {i > 0 && <span className="-ml-1 text-mute">↓</span>}
              {step.branch ? (
                <div className="flex flex-col gap-2 border-l-2 border-bd2 pl-2.5">
                  {step.row.map((nd, j) => (
                    <Node key={j} node={nd} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-2">
                  {step.row.map((nd, j) => (
                    <Node key={j} node={nd} />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 技术栈表 */}
      <table className="mb-1.5 w-full border-collapse">
        <tbody>
          {svc.stack.map((row, i) => (
            <tr key={i} className="border-b border-bd last:border-0">
              <td className="w-[42%] py-1.5 pr-2 align-top text-[12.5px] text-dim">{row.k}</td>
              <td className="break-all py-1.5 text-right align-top font-mono text-[11.5px] text-ink">
                {row.v}
                {row.tag && (
                  <span className="ml-1.5 rounded bg-surface3 px-1.5 py-0.5 font-mono text-[10px] text-nCache">
                    {row.tag}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 折叠：更新流程 */}
      <div className="mt-3.5">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-2 rounded-lg border border-bd bg-surface2 px-3 py-2.5 text-[13px] font-semibold text-nApp transition-colors hover:bg-surface3"
        >
          <Settings2 size={15} strokeWidth={2} />
          {svc.opsTitle}
          <ChevronRight
            size={16}
            className={`ml-auto text-mute transition-transform duration-300 ${open ? 'rotate-90' : ''}`}
          />
        </button>
        <div
          className="grid transition-all duration-300"
          style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden">
            <div className="space-y-3 pt-3">
              {svc.code.length > 0 && <CodeBlock lines={svc.code} />}
              {svc.note && <Note note={svc.note} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Note({ note }: { note: NonNullable<Service['note']> }) {
  const styles = {
    warn: 'bg-nExt/[0.07] border-nExt/25',
    ok: 'bg-nApp/[0.07] border-nApp/25',
    info: 'bg-nNet/[0.07] border-nNet/25',
  }[note.kind]
  const mark = { warn: '⚠', ok: '✓', info: 'ℹ' }[note.kind]
  return (
    <div
      className={`rounded-lg border px-3 py-2.5 text-[12.5px] leading-relaxed text-dim ${styles} [&_code]:rounded [&_code]:bg-black/30 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[11px] [&_code]:text-nCache`}
    >
      <span className="mr-1 font-bold">{mark}</span>
      <span dangerouslySetInnerHTML={{ __html: note.html }} />
    </div>
  )
}

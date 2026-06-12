import type { CodeLine } from '../data'

const CLR: Record<string, string> = {
  c: '#69749b', // 注释
  k: '#b07cff', // 命令
  s: '#2fe39a', // 字符串
  v: '#ffb224', // 值
  o: '#21d4fd', // 资源/对象
}

export default function CodeBlock({ lines }: { lines: CodeLine[] }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-bd bg-[#060a14] px-3.5 py-3 font-mono text-[12px] leading-[1.7] text-[#c9d6e6]">
      {lines.map((line, i) => (
        <div key={i}>
          {line.parts.map((p, j) => (
            <span key={j} style={p.c ? { color: CLR[p.c] } : undefined}>
              {p.t}
            </span>
          ))}
          {line.parts.length === 0 ? ' ' : ''}
        </div>
      ))}
    </pre>
  )
}

import { useEffect, useRef, useState } from 'react'

// 数字滚动计数
export default function Stat({ to, text, label }: { to?: number; text?: string; label: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const done = useRef(false)

  useEffect(() => {
    if (to == null) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || done.current) return
          done.current = true
          const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
          if (reduce) {
            setVal(to)
            return
          }
          let nNow = 0
          const step = Math.max(1, Math.ceil(to / 24))
          const t = setInterval(() => {
            nNow += step
            if (nNow >= to) {
              nNow = to
              clearInterval(t)
            }
            setVal(nNow)
          }, 28)
        })
      },
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [to])

  return (
    <div
      ref={ref}
      className="reveal relative overflow-hidden rounded-2xl border border-bd bg-surface px-[18px] py-5"
    >
      <span className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-nApp via-emerald2 to-teal2" />
      <div className="font-mono text-[30px] font-extrabold tracking-tight">{text ?? val}</div>
      <div className="mt-0.5 text-[12.5px] text-dim">{label}</div>
    </div>
  )
}

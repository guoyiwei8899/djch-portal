import { useEffect } from 'react'

// 滚动揭示：给所有 .reveal 元素加 IntersectionObserver，进入视口加 .in
export function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          const sibs = Array.from(el.parentElement?.children ?? []).filter((c) =>
            c.classList.contains('reveal'),
          )
          el.style.transitionDelay = `${(sibs.indexOf(el) % 6) * 55}ms`
          el.classList.add('in')
          io.unobserve(el)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

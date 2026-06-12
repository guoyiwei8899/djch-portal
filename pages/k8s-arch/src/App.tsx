import { useEffect, useState } from 'react'
import { GitBranch, KeyRound } from 'lucide-react'
import { useReveal } from './hooks/useReveal'
import { LAYERS, SERVICES, STATS, TYPE_META } from './data'
import Stat from './components/Stat'
import ServiceCard from './components/ServiceCard'
import TopologyGraph from './components/TopologyGraph'
import CodeBlock from './components/CodeBlock'

const NAV = [
  { id: 'overview', label: '总览' },
  { id: 'graph', label: '全景关系图' },
  { id: 'services', label: '服务架构' },
  { id: 'update', label: '更新流程' },
  { id: 'cheat', label: '命令速查' },
]

function SecHead({ tag, title, children }: { tag: string; title: string; children: React.ReactNode }) {
  return (
    <div className="reveal mb-7">
      <div className="font-mono text-[12px] tracking-wider text-nCache">{tag}</div>
      <h2 className="mt-1.5 text-[27px] font-extrabold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-[760px] text-[15px] text-dim">{children}</p>
    </div>
  )
}

function useScrollSpy() {
  const [active, setActive] = useState('overview')
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    document.querySelectorAll('section[id]').forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])
  return active
}

export default function App() {
  useReveal()
  const active = useScrollSpy()

  return (
    <>
      {/* NAV */}
      <nav className="sticky top-0 z-50 border-b border-bd bg-[#0a0e14]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center gap-4 px-6 py-3.5">
          <div className="flex items-center gap-2.5 text-[15px] font-bold">
            <svg className="h-[26px] w-[26px]" viewBox="0 0 24 24" fill="none">
              <path d="M12 1.5l9.5 4.2v8.6L12 22.5 2.5 14.3V5.7L12 1.5z" stroke="url(#g)" strokeWidth="1.6" />
              <circle cx="12" cy="12" r="3" fill="#2fe39a" />
              <defs>
                <linearGradient id="g" x1="2" y1="2" x2="22" y2="22">
                  <stop stopColor="#2fe39a" />
                  <stop offset="1" stopColor="#21d4fd" />
                </linearGradient>
              </defs>
            </svg>
            djch.one <span className="font-medium text-mute">/ k8s</span>
          </div>
          <div className="ml-auto flex flex-wrap gap-1">
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`rounded-lg px-2.5 py-1.5 text-[13px] transition-colors ${
                  active === item.id
                    ? 'bg-nApp/[0.18] text-white'
                    : 'text-dim hover:bg-surface2 hover:text-ink'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="mx-auto max-w-[1180px] px-6 pb-10 pt-[72px] text-center">
        <div className="reveal mb-[22px] inline-flex items-center gap-2 rounded-full border border-bd2 bg-surface px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[1.4px] text-nCache">
          <span className="relative inline-block h-2 w-2 rounded-full bg-nApp animate-pulse2" />
          RKE2 v1.33.5 · 3-node HA · Rocky Linux 9
        </div>
        <h1 className="reveal text-[clamp(30px,5.4vw,52px)] font-extrabold leading-[1.12] tracking-tight">
          djch.one <span className="grad-text animate-shine">Kubernetes</span> 集群架构
        </h1>
        <div className="reveal mt-3.5 font-mono text-[13px] text-mute">
          k8snode01-03 · 192.168.6.131-133 · control-plane + etcd + master
        </div>
      </header>

      {/* STATS */}
      <div className="mx-auto mt-2 grid max-w-[1180px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-3.5 px-6">
        {STATS.map((s, i) => (
          <Stat key={i} to={s.to} text={s.text} label={s.label} />
        ))}
      </div>

      {/* OVERVIEW */}
      <section id="overview" className="mx-auto max-w-[1180px] px-6 pb-2 pt-16">
        <SecHead tag="// 01 · TOPOLOGY" title="整体拓扑：一切从 Git 流入">
          ArgoCD 从 GitHub <code className="mono-code">guoyiwei8899/k8s-gitops</code> 把声明式清单持续同步进集群；流量经三种入口进出；数据落在 Longhorn / Lustre；机密由 sealed-secrets 治理。
        </SecHead>
        <div className="flex flex-col gap-3">
          {LAYERS.map((layer) => (
            <div
              key={layer.tag}
              className="reveal grid grid-cols-1 items-center gap-4 rounded-2xl border border-bd bg-surface px-[18px] py-4 transition-all duration-300 hover:translate-x-1 hover:border-bd2 sm:grid-cols-[160px_1fr]"
            >
              <div className="flex flex-col gap-0.5">
                <b className="text-[15px]">{layer.name}</b>
                <span className="font-mono text-[11.5px] text-mute">{layer.tag}</span>
                <span className="mt-1.5 h-[3px] w-[38px] rounded" style={{ background: layer.color }} />
              </div>
              <div className="flex flex-wrap gap-2">
                {layer.chips.map((chip, j) => (
                  <span
                    key={j}
                    className="inline-flex items-center gap-1.5 rounded-full border border-bd bg-surface2 px-3 py-1.5 text-[13px] transition-all duration-200 hover:-translate-y-0.5 hover:border-bd2 hover:bg-surface3"
                  >
                    <span className="h-2 w-2 flex-none rounded-full" style={{ background: chip.dot }} />
                    {chip.label}
                    {chip.sub && <small className="font-mono text-[11px] text-mute">{chip.sub}</small>}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GRAPH */}
      <section id="graph" className="mx-auto max-w-[1180px] px-6 pb-2 pt-16">
        <SecHead tag="// 02 · DEPENDENCY MAP" title="全景关系图：谁依赖谁">
          可拖拽的交互式依赖图 —— 从 Git 经 ArgoCD 持续同步，三种入口分流到各服务，再汇聚到共享的 PostgreSQL-HA / Valkey / sealed-secrets。按住节点可拖动，右下角可缩放。
        </SecHead>
        <Legend />
        <div className="reveal mt-1">
          <TopologyGraph />
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="mx-auto max-w-[1180px] px-6 pb-2 pt-16">
        <SecHead tag="// 03 · SERVICE ARCHITECTURE" title="各服务用了哪些组件">
          每张卡 = 一个服务的依赖链 + 技术栈（镜像/版本）+ 配置更新流程。点开「更新流程」看该服务怎么改 ConfigMap 才生效。
        </SecHead>
        <Legend />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(360px,1fr))] gap-5">
          {SERVICES.map((svc) => (
            <ServiceCard key={svc.id} svc={svc} />
          ))}
        </div>
      </section>

      {/* UPDATE FLOW */}
      <section id="update" className="mx-auto max-w-[1180px] px-6 pb-2 pt-16">
        <SecHead tag="// 04 · GITOPS WORKFLOW" title="通用更新流程：为什么改了 ConfigMap 不生效？">
          所有服务都由 ArgoCD 从 Git 管理。改配置 = 改 Git，不要直接 <code className="mono-code">kubectl edit</code>（会被 ArgoCD 同步回去）。
        </SecHead>
        <div className="reveal rounded-2xl border border-bd2 bg-gradient-to-br from-nApp/10 to-teal2/[0.06] px-6 py-[22px]">
          <h3 className="mb-1.5 flex items-center gap-2.5 text-[16px] font-bold">
            <GitBranch size={19} className="text-nApp" /> 四步：Git → ArgoCD → ConfigMap → 重启
          </h3>
          <p className="mb-3.5 text-[14px] text-dim">
            关键认知：<b>env 型</b> ConfigMap 改完 Pod 不会感知，必须重启；<b>volume 挂载型</b> kubelet 约 1 分钟更新文件，但应用通常仍需重启才重读。
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-3.5">
            {[
              { n: 1, t: '改 Git', d: '在 k8s-gitops 仓库改 manifest / values，commit + push。' },
              { n: 2, t: 'ArgoCD 同步', d: '自动检测漂移并 Sync（或 UI 手动 Sync / argocd app sync）。' },
              { n: 3, t: 'ConfigMap 生效', d: '新 ConfigMap 已下发，但运行中的 Pod 还拿着旧值。' },
              { n: 4, t: '滚动重启', d: 'kubectl rollout restart deploy/<x> -n <ns> 让 Pod 重读。' },
            ].map((step) => (
              <div key={step.n} className="rounded-lg border border-bd bg-surface p-4">
                <div className="mb-2.5 grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-nApp to-emerald2 font-mono text-[13px] font-extrabold text-[#06101f]">
                  {step.n}
                </div>
                <b className="text-[13.5px]">{step.t}</b>
                <p className="mt-1.5 text-[12.5px] text-dim">{step.d}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-lg border border-nExt/25 bg-nExt/[0.07] px-3 py-2.5 text-[12.5px] text-dim [&_code]:rounded [&_code]:bg-black/30 [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[11px] [&_code]:text-nCache">
            <b>🔐 改机密（密码/token）</b>：不走 ConfigMap，改 <code>k8s-gitops/sealed-secrets/seal.sh</code> 重新封 SealedSecret → push → controller 自动解密成 Secret。接管已有 Secret 需加注解 <code>sealedsecrets.bitnami.com/managed=true</code>。
          </div>
        </div>
      </section>

      {/* CHEATSHEET */}
      <section id="cheat" className="mx-auto max-w-[1180px] px-6 pb-2 pt-16">
        <SecHead tag="// 05 · CHEATSHEET" title="高频命令速查">
          本机无 kubeconfig，统一走 k8snode01。先设别名，后续命令用 <code className="mono-code">k</code>。
        </SecHead>
        <div className="reveal">
          <CodeBlock lines={CHEAT} />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mx-auto mt-10 flex max-w-[1180px] flex-wrap justify-between gap-2.5 border-t border-bd px-6 pb-14 pt-7 text-[13px] text-mute">
        <span className="inline-flex items-center gap-1.5">
          <KeyRound size={13} /> djch.one Kubernetes 架构
        </span>
        <span>RKE2 v1.33.5 · ArgoCD GitOps · 来源 guoyiwei8899/k8s-gitops</span>
      </footer>
    </>
  )
}

function Legend() {
  return (
    <div className="reveal -mt-2 mb-6 flex flex-wrap gap-4 text-[12.5px] text-dim">
      {Object.values(TYPE_META).map((m) => (
        <span key={m.label} className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: m.color }} />
          {m.label}
        </span>
      ))}
    </div>
  )
}

const CHEAT = [
  { parts: [{ t: '# 入口 + 别名（在节点上）', c: 'c' as const }] },
  { parts: [{ t: 'ssh yiwei@192.168.6.131' }] },
  {
    parts: [
      { t: 'alias ', c: 'k' as const },
      { t: "k='sudo /var/lib/rancher/rke2/bin/kubectl --kubeconfig /etc/rancher/rke2/rke2.yaml'", c: 's' as const },
    ],
  },
  { parts: [] },
  { parts: [{ t: 'k get pods -A | grep -v Running        ' }, { t: '# 找异常 Pod', c: 'c' as const }] },
  { parts: [{ t: 'k get applications -A                   ' }, { t: '# ArgoCD 同步状态', c: 'c' as const }] },
  { parts: [{ t: 'k -n <ns> logs <pod> -f                 ' }, { t: '# 跟日志', c: 'c' as const }] },
  { parts: [{ t: 'k -n <ns> describe pod <pod>            ' }, { t: '# 排查启动失败（看 Events）', c: 'c' as const }] },
  { parts: [{ t: 'k rollout restart deploy/<x> -n <ns>    ' }, { t: '# 改 ConfigMap 后让其生效', c: 'c' as const }] },
  { parts: [{ t: 'k get svc -A | grep LoadBalancer        ' }, { t: '# 谁占了 MetalLB IP', c: 'c' as const }] },
  { parts: [{ t: 'k get pvc -A ; k get certificate -A     ' }, { t: '# 存储卷 / 证书', c: 'c' as const }] },
  { parts: [{ t: 'k get sealedsecrets -A                  ' }, { t: '# 封装的机密', c: 'c' as const }] },
  { parts: [{ t: 'k top nodes ; k top pods -A             ' }, { t: '# 资源占用', c: 'c' as const }] },
]

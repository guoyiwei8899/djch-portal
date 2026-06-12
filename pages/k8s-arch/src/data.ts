// ─────────────────────────────────────────────────────────────
// djch.one k8s 集群架构数据 —— 全部内容蓝本，驱动卡片 + 关系图
// 数据源：/home/yiwei/k8s-arch.html + wiki-docs/infra/k8s-components.md
//          + 实地巡查 k8snode01 (2026-05-31)
// ─────────────────────────────────────────────────────────────

export type NodeType = 'app' | 'data' | 'cache' | 'ext' | 'sec' | 'net'

export const TYPE_META: Record<NodeType, { label: string; color: string }> = {
  app: { label: '应用 App', color: '#2fe39a' },
  data: { label: '数据库 DB', color: '#b07cff' },
  cache: { label: '缓存 Cache', color: '#21d4fd' },
  ext: { label: '外部依赖', color: '#ffb224' },
  sec: { label: '机密 Secret', color: '#ff7b7b' },
  net: { label: '网络入口', color: '#38bdf8' },
}

export interface DepNode {
  label: string
  type: NodeType
  sub?: string
}

export interface CodeLine {
  // 简单语法着色：c=注释 k=命令 s=字符串 v=值 o=对象/资源
  parts: { t: string; c?: 'c' | 'k' | 's' | 'v' | 'o' }[]
}

export interface Service {
  id: string
  name: string
  ns: string
  icon: string // lucide icon name
  role: string
  // 依赖链：每行是一组节点（链式），arrow 连接；branch=true 表示该行节点为并列分支
  flow: { row: DepNode[]; branch?: boolean }[]
  stack: { k: string; v: string; tag?: string }[]
  opsTitle: string
  code: CodeLine[]
  note?: { kind: 'warn' | 'ok' | 'info'; html: string }
}

const ln = (...parts: CodeLine['parts']): CodeLine => ({ parts })

export const SERVICES: Service[] = [
  {
    id: 'aidc',
    name: 'aidc',
    ns: 'aidc',
    icon: 'LayoutGrid',
    role: '自研前后端 · 硬件大屏数据来自 Zabbix',
    flow: [
      { row: [{ label: 'Traefik', type: 'net' }] },
      { row: [{ label: 'frontend', type: 'app', sub: '×2' }] },
      { row: [{ label: 'backend', type: 'app', sub: '×2' }] },
      {
        branch: true,
        row: [
          { label: 'Zabbix API', type: 'ext', sub: 'aidc.hw.snapshot' },
          { label: 'aidc-secrets', type: 'sec', sub: 'sealed' },
        ],
      },
    ],
    stack: [
      { k: '前端', v: 'registry.djch.one/aidc-frontend', tag: 'latest' },
      { k: '后端', v: 'registry.djch.one/aidc-backend', tag: 'latest' },
      { k: '外部数据', v: 'Zabbix item aidc.hw.snapshot' },
    ],
    opsTitle: '更新流程 / 改 ConfigMap',
    code: [
      ln({ t: '# 改后端配置（ConfigMap 在 git 仓库）', c: 'c' }),
      ln({ t: 'vim ', c: 'k' }, { t: 'apps/aidc/' }, { t: 'configmap.yaml', c: 'o' }),
      ln({ t: 'git commit -am ' }, { t: '"aidc: tweak config"', c: 's' }, { t: ' && git push' }),
      ln({ t: '# ArgoCD 自动同步，然后让 Pod 重新加载 env', c: 'c' }),
      ln({ t: 'kubectl rollout restart ' }, { t: 'deploy/aidc-backend', c: 'o' }, { t: ' -n aidc' }),
      ln({ t: '# 改了代码 → 重建镜像（:latest 必须手动滚更）', c: 'c' }),
      ln({ t: 'docker build -t registry.djch.one/aidc-backend:latest . && docker push ...' }),
    ],
    note: {
      kind: 'warn',
      html: '<b>env 型 ConfigMap</b> 改了不会自动生效，必须 <code>rollout restart</code>；改密码走 sealed-secrets（见底部）。',
    },
  },
  {
    id: 'immich',
    name: 'immich',
    ns: 'home-media',
    icon: 'Image',
    role: '自托管相册 · 公网经 Cloudflare Tunnel',
    flow: [
      { row: [{ label: 'cloudflared', type: 'net' }] },
      { row: [{ label: 'immich-server', type: 'app' }] },
      {
        branch: true,
        row: [
          { label: 'machine-learning', type: 'app' },
          { label: 'valkey', type: 'cache' },
          { label: 'PG-HA', type: 'data', sub: '共享 pgpool' },
        ],
      },
    ],
    stack: [
      { k: 'Server', v: 'immich-server', tag: 'v2.7.5' },
      { k: 'ML 识图', v: 'immich-machine-learning', tag: 'v2.7.5' },
      { k: '缓存', v: 'valkey', tag: '9.1' },
      { k: '数据库', v: '→ 共享 PostgreSQL-HA' },
    ],
    opsTitle: '更新流程 / 改 ConfigMap',
    code: [
      ln({ t: '# immich 配置 / 隧道路由在 git 仓库', c: 'c' }),
      ln({ t: 'vim ', c: 'k' }, { t: 'apps/home-media/immich/' }, { t: 'values.yaml', c: 'o' }),
      ln({ t: 'git commit -am ' }, { t: '"immich: bump v2.7.x"', c: 's' }, { t: ' && git push' }),
      ln({ t: '# 同步 + 重启 server 让新配置生效', c: 'c' }),
      ln({ t: 'kubectl rollout restart ' }, { t: 'deploy/immich-server', c: 'o' }, { t: ' -n home-media' }),
    ],
    note: {
      kind: 'warn',
      html: '升级跨大版本前看 immich release notes（DB migration 不可逆），先确保 PG-HA 已备份到 nfs01。',
    },
  },
  {
    id: 'pgha',
    name: 'PostgreSQL-HA',
    ns: 'home-media',
    icon: 'Database',
    role: '多应用共享的高可用数据库（immich / semaphore 都连它）',
    flow: [
      { row: [{ label: '消费者', type: 'app', sub: 'immich / semaphore' }] },
      { row: [{ label: 'pgpool', type: 'data', sub: '读写路由' }] },
      {
        branch: true,
        row: [
          { label: 'postgresql-0', type: 'data', sub: 'primary' },
          { label: 'postgresql-1 / 2', type: 'data', sub: 'repmgr 副本' },
        ],
      },
    ],
    stack: [
      { k: '主从 (repmgr)', v: 'postgresql-repmgr', tag: '17.6 ×3' },
      { k: '连接池', v: 'pgpool', tag: '4.6.3' },
      { k: '管理界面', v: 'pgadmin4', tag: '9.8' },
      { k: '连接点', v: '…pgpool.home-media.svc:5432' },
    ],
    opsTitle: '关键约束 / 备份',
    code: [
      ln({ t: '# 应用连接必须用 postgres 用户（pgpool SCRAM 不认新角色）', c: 'c' }),
      ln({ t: 'host=…pgpool.home-media.svc  user=' }, { t: 'postgres', c: 'v' }, { t: '  sslmode=' }, { t: 'disable', c: 'v' }),
      ln({ t: '# 备份（双保险，均→ nfs01 192.168.6.135）', c: 'c' }),
      ln({ t: 'CronJob pg-dumpall-nfs   ' }, { t: '# 每日02:00 逻辑备份，留14天', c: 'c' }),
      ln({ t: 'Longhorn RecurringJob    ' }, { t: '# 每日03:00 卷级快照', c: 'c' }),
    ],
    note: {
      kind: 'warn',
      html: '镜像是 <code>bitnamilegacy</code>（Bitnami 2025 后迁移），升级前确认镜像来源仍可拉取。',
    },
  },
  {
    id: 'netbox',
    name: 'netbox',
    ns: 'infra-nt',
    icon: 'Boxes',
    role: 'IPAM / DCIM · 网络与机房资产真相源',
    flow: [
      { row: [{ label: 'Traefik', type: 'net' }] },
      { row: [{ label: 'netbox', type: 'app' }] },
      {
        branch: true,
        row: [
          { label: 'worker', type: 'app', sub: 'RQ 任务' },
          { label: 'valkey', type: 'cache', sub: 'primary +3 副本' },
          { label: 'PostgreSQL', type: 'data', sub: 'local-netbox SC' },
        ],
      },
    ],
    stack: [
      { k: 'App + Worker', v: 'netbox-community/netbox', tag: 'v4.5.7' },
      { k: '缓存', v: 'valkey (主 + 3 副本)' },
      { k: '清理任务', v: 'housekeeping CronJob' },
    ],
    opsTitle: '更新流程 / 改 ConfigMap',
    code: [
      ln({ t: 'vim ', c: 'k' }, { t: 'apps/infra-nt/netbox/' }, { t: 'values.yaml', c: 'o' }, { t: '   # 插件/配置', c: 'c' }),
      ln({ t: 'git commit -am ' }, { t: '"netbox: ..."', c: 's' }, { t: ' && git push' }),
      ln({ t: 'kubectl rollout restart ' }, { t: 'deploy/my-netbox deploy/my-netbox-worker', c: 'o' }, { t: ' -n infra-nt' }),
    ],
  },
  {
    id: 'wikijs',
    name: 'Wiki.js',
    ns: 'infra-nt',
    icon: 'BookText',
    role: '文档 Wiki · 本文档及基础设施手册都在这',
    flow: [
      { row: [{ label: 'Traefik', type: 'net' }] },
      { row: [{ label: 'wikijs', type: 'app', sub: 'Node.js' }] },
      { row: [{ label: 'wikijs-postgresql', type: 'data', sub: '专用' }] },
    ],
    stack: [
      { k: '应用', v: 'requarks/wiki', tag: '2' },
      { k: '数据库', v: 'postgres', tag: '18' },
      { k: '内容源', v: 'github djch-wiki（Git 同步）' },
    ],
    opsTitle: '更新内容 / 推文档',
    code: [
      ln({ t: '# 文档源在 wiki-docs 仓库，推到 wiki.js', c: 'c' }),
      ln({ t: 'cd ~/git-ops/wiki-docs' }),
      ln({ t: 'git add infra/xxx.md && git commit -m ' }, { t: '"..."', c: 's' }, { t: ' && git push' }),
      ln({ t: 'python3 push-to-wiki.py infra/xxx.md infra/xxx ' }, { t: '"标题"', c: 's' }, { t: '  # .env 自动给 token', c: 'c' }),
    ],
  },
  {
    id: 'uyuni',
    name: 'Uyuni',
    ns: 'uyuni',
    icon: 'RefreshCw',
    role: 'Linux 机群补丁 / 配置管理（SUSE Manager 开源版）',
    flow: [
      { row: [{ label: 'ingress-nginx', type: 'net', sub: 'uyuni.djch.one' }] },
      { row: [{ label: 'uyuni server', type: 'app', sub: 'Salt master' }] },
      { row: [{ label: 'server-postgresql', type: 'data' }] },
    ],
    stack: [
      { k: 'Server', v: 'uyuni/server', tag: 'latest' },
      { k: '数据库', v: 'uyuni/server-postgresql', tag: 'latest' },
      { k: '入口', v: 'uyuni.djch.one (ssl/nossl/redirect)' },
    ],
    opsTitle: '更新流程',
    code: [
      ln({ t: 'vim ', c: 'k' }, { t: 'apps/uyuni/' }, { t: 'deployment.yaml', c: 'o' }),
      ln({ t: 'git commit -am ' }, { t: '"uyuni: ..."', c: 's' }, { t: ' && git push' }),
      ln({ t: 'kubectl rollout restart ' }, { t: 'deploy/uyuni', c: 'o' }, { t: ' -n uyuni' }),
    ],
    note: {
      kind: 'warn',
      html: '与 Foreman/Katello 功能重叠（并行方案）；ArgoCD 里 uyuni 部分 OutOfSync 属已知。',
    },
  },
  {
    id: 'semaphore',
    name: 'Semaphore',
    ns: 'semaphore',
    icon: 'Terminal',
    role: 'Terraform / Ansible 的 Web GUI（管 infra-terraform）',
    flow: [
      { row: [{ label: 'Traefik', type: 'net', sub: 'semaphore.djch.one' }] },
      { row: [{ label: 'semaphore', type: 'app' }] },
      {
        branch: true,
        row: [
          { label: 'PG-HA', type: 'data', sub: 'state backend' },
          { label: 'semaphore-secrets', type: 'sec', sub: 'sealed' },
        ],
      },
    ],
    stack: [
      { k: '应用', v: 'semaphoreui/semaphore', tag: 'v2.18.3' },
      { k: '数据库', v: '→ 共享 PG-HA (pgpool)' },
      { k: 'chart', v: 'semaphoreui/semaphore 16.2.2' },
    ],
    opsTitle: '更新流程 / 坑',
    code: [
      ln({ t: 'vim ', c: 'k' }, { t: 'apps/semaphore/' }, { t: 'values.yaml', c: 'o' }),
      ln({ t: 'git commit -am ' }, { t: '"semaphore: ..."', c: 's' }, { t: ' && git push' }),
      ln({ t: 'kubectl rollout restart ' }, { t: 'deploy/semaphore', c: 'o' }, { t: ' -n semaphore' }),
    ],
    note: {
      kind: 'warn',
      html: '<b>坑</b>：Terraform workspace 必须设 <code>default</code> 才对上迁移来的 state；confirm 接口传 false <b>也会</b>触发 apply，plan-only 别调 confirm。',
    },
  },
  {
    id: 'authentik',
    name: 'Authentik',
    ns: 'authentik',
    icon: 'ShieldCheck',
    role: '统一登录 SSO / OIDC 身份提供方（Web 应用层）',
    flow: [
      { row: [{ label: 'authentik-server', type: 'app' }] },
      {
        branch: true,
        row: [
          { label: 'worker', type: 'app' },
          { label: 'postgresql', type: 'data', sub: '17.9' },
          { label: 'FreeIPA', type: 'ext', sub: 'LDAP 用户源' },
        ],
      },
    ],
    stack: [
      { k: 'Server + Worker', v: 'goauthentik/server', tag: '2026.2.2' },
      { k: '数据库', v: 'postgres', tag: '17.9' },
    ],
    opsTitle: '分工说明',
    code: [],
    note: {
      kind: 'ok',
      html: '<b>Authentik vs FreeIPA</b> —— Authentik 管 <b>Web 应用 SSO</b>（OIDC/SAML），FreeIPA 管 <b>主机 SSH / sudo</b> 身份。两套并存、各司其职。',
    },
  },
  {
    id: 'monitoring',
    name: '监控栈',
    ns: 'monitoring',
    icon: 'Activity',
    role: 'Prometheus 全家桶 + 飞书告警',
    flow: [
      { row: [{ label: 'exporters', type: 'ext', sub: 'node/snmp/ipmi/blackbox' }] },
      { row: [{ label: 'Prometheus', type: 'app' }] },
      {
        branch: true,
        row: [
          { label: 'Grafana', type: 'app', sub: '看板' },
          { label: 'feishu 告警桥', type: 'app' },
        ],
      },
      { row: [{ label: 'promtail → Loki', type: 'data', sub: '日志 → Grafana' }] },
    ],
    stack: [
      { k: '指标', v: 'prometheus', tag: 'v2.51.2' },
      { k: '看板', v: 'grafana', tag: '12.3.1' },
      { k: '日志', v: 'loki 3.6.7 + promtail' },
      { k: '告警', v: 'feishu-bot / webhook-bridge' },
    ],
    opsTitle: '改告警规则 / ConfigMap',
    code: [
      ln({ t: '# Prometheus 规则就在 ConfigMap 里', c: 'c' }),
      ln({ t: 'vim ', c: 'k' }, { t: 'apps/monitoring/' }, { t: 'prometheus-rules.yaml', c: 'o' }),
      ln({ t: 'git commit -am ' }, { t: '"alert: ..."', c: 's' }, { t: ' && git push' }),
    ],
    note: {
      kind: 'ok',
      html: '<b>例外</b>：Prometheus 带 <code>configmap-reload</code> sidecar —— 规则 ConfigMap 改了会<b>自动热加载</b>，无需重启 Pod。',
    },
  },
]

// 整体拓扑分层（overview）
export interface Layer {
  name: string
  tag: string
  color: string
  chips: { label: string; dot: string; sub?: string }[]
}

const C = {
  green: '#2fe39a',
  blue: '#38bdf8',
  violet: '#b07cff',
  cyan: '#21d4fd',
  amber: '#ffb224',
  red: '#ff7b7b',
  pink: '#ff5da2',
}

export const LAYERS: Layer[] = [
  {
    name: 'Git（真相源）',
    tag: 'k8s-gitops',
    color: C.green,
    chips: [
      { label: 'GitHub repo', dot: C.green, sub: 'guoyiwei8899/k8s-gitops' },
      { label: 'ArgoCD', dot: C.blue, sub: '192.168.6.241' },
      { label: 'Rancher + Fleet', dot: C.blue },
    ],
  },
  {
    name: '流量入口',
    tag: 'ingress',
    color: C.pink,
    chips: [
      { label: 'Traefik', dot: C.pink, sub: 'LB .240 · infra-nt' },
      { label: 'ingress-nginx', dot: C.pink, sub: 'uyuni/rancher' },
      { label: 'cloudflared', dot: C.pink, sub: 'immich 公网隧道' },
      { label: 'MetalLB', dot: C.pink, sub: '.240–.250' },
      { label: 'CoreDNS', dot: C.pink },
    ],
  },
  {
    name: '存储',
    tag: 'storage',
    color: C.violet,
    chips: [
      { label: 'Longhorn', dot: C.violet, sub: '默认 SC · 多副本' },
      { label: 'lustre-csi', dot: C.violet, sub: 'HPE · 生产 Lustre' },
      { label: 'local-netbox', dot: C.violet },
    ],
  },
  {
    name: '机密 / 证书',
    tag: 'security',
    color: C.red,
    chips: [
      { label: 'sealed-secrets', dot: C.red, sub: '0.37.0' },
      { label: 'cert-manager', dot: C.red, sub: 'letsencrypt-dns01' },
      { label: 'Authentik', dot: C.amber, sub: 'SSO / OIDC' },
    ],
  },
  {
    name: '可观测',
    tag: 'observability',
    color: C.cyan,
    chips: [
      { label: 'Prometheus', dot: C.cyan },
      { label: 'Grafana', dot: C.cyan },
      { label: 'Loki + promtail', dot: C.cyan },
      { label: 'exporters', dot: C.cyan, sub: 'node/blackbox/snmp/ipmi' },
      { label: 'feishu 告警桥', dot: C.green },
    ],
  },
  {
    name: '共享数据',
    tag: 'data',
    color: C.violet,
    chips: [
      { label: 'PostgreSQL-HA', dot: C.violet, sub: 'repmgr ×3 + pgpool' },
      { label: 'Valkey', dot: C.cyan, sub: '缓存 / 队列' },
    ],
  },
]

export const STATS = [
  { to: 3, label: '控制平面节点 (HA)' },
  { to: 12, label: 'ArgoCD Applications' },
  { to: 10, label: '业务 / 平台服务' },
  { to: 3, label: '流量入口 (三种)' },
  { text: 'SSH', label: '入口 yiwei@.131' },
]

# djch-portal

内部技术门户 **portal.djch.one** —— 动画可视化图库 + 系统入口导航。

- 站点纯静态(无后端):k8s 里 nginx serve,`git-sync` sidecar 自动拉本仓库,**push 即上线**。
- 访问受 Authentik SSO 保护(公司内部员工可看);增删由 sysops 经 git 完成,**网页只读**。

## 怎么加一个可视化页

1. 把项目生成的 html 丢进 `viz/`,例如 `viz/lustre-topo.html`(单文件、零依赖最佳)。
2. 在 `portal.json` 的 `viz` 数组加一条:
   ```json
   { "domain": "storage", "icon": "🗄️", "title": "Lustre 集群拓扑",
     "desc": "OST/MDT/IB fabric 全景", "path": "viz/lustre-topo.html" }
   ```
   `domain` 取 `portal.json > domains` 里的 key(storage/network/k8s/infra/identity)。
3. `git add -A && git commit -m "add: lustre 拓扑" && git push` —— 约 30s 后线上可见。

## 加一个系统入口

在 `portal.json` 的 `system` 数组加一条 `{ icon, title, desc, url }` 即可。

## 本地预览

```bash
python3 -m http.server 8090   # 然后开 http://<本机>:8090/
```

## 部署

manifest 在 `k8s-gitops/manifests/portal/`(ArgoCD 管)。本仓只管内容,改完 push 由 git-sync 同步。

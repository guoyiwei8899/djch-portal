# k8s-arch — djch.one Kubernetes 集群架构页(源码)

portal 子页面之一。React + Vite + Tailwind,`vite-plugin-singlefile` 打包成**单个自包含 HTML**,
产物即 `../../viz/k8s-arch.html`(viewer iframe 加载)。

## 改内容 / 改样式后发布

```bash
cd pages/k8s-arch
npm ci            # 首次或依赖变更后
npm run build     # 产物 dist/index.html(~390KB 单文件)
cp dist/index.html ../../viz/k8s-arch.html
cd ../.. && git add -A && git commit -m "k8s-arch: <改了什么>" && git push
# git-sync 30s 内自动上线 portal.djch.one
```

## 约定

- 集群数据都在 `src/data.ts` / `src/graphData.ts`,改数据只动这两个文件。
- 主题色统一走 `tailwind.config.js` 语义色(2026-06-12 起与 portal「Ops Deck」深空霓虹同款),
  不要在组件里写裸 hex。
- 字体引 portal 的 `/assets/fonts/`(绝对路径),本页不自带字体文件。
- 历史:曾部署在 money.djch.one/k8s(ConfigMap k8s-arch-html),2026-06-12 已下线,portal 为唯一入口。

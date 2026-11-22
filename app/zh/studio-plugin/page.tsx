import type { Metadata } from "next";
import Link from "next/link";
import { ZhShell } from "../_components/ZhShell";

const PAGE_URL = "https://robloxguimaker.app/zh/studio-plugin";
const EN_URL = "https://robloxguimaker.app/studio-plugin";

export const metadata: Metadata = {
  title: "Roblox GUI Maker 离线 Studio 插件 — 免联网权限一键粘贴同步（.lua）",
  description:
    "下载开源零联网权限的 Roblox Studio 离线伴侣插件 RobloxGuiMakerSync.lua。在网页编辑器点击「Copy Plugin JSON」，粘贴到 Studio 插件窗口即可还原完整 ScreenGui 实例树并支持撤销。",
  alternates: {
    canonical: "/zh/studio-plugin",
    languages: {
      en: EN_URL,
      zh: PAGE_URL,
      "x-default": EN_URL,
    },
  },
  openGraph: {
    title: "Roblox GUI Maker 离线 Studio 同步插件 (.lua)",
    description:
      "零 HTTP 请求、零远程 require，安全安装进本地 Plugins 目录，一键把网页端搭建的 GUI 粘贴还原为原生 Studio 实例。",
    url: PAGE_URL,
    type: "website",
  },
};

const FAQ_ITEMS = [
  {
    q: "为什么采用「复制 JSON + 本地粘贴」而不是要求开启 HttpService 联网？",
    a: "需要外部联网权限或远程 require() 的 Studio 插件往往会引发安全警报。使用离线单文件 .lua 插件配合剪贴板粘贴，无需开启 HttpRequests 权限，源码也完全可读、透明且可审计。",
  },
  {
    q: "插件支持还原哪些 Roblox UI 实例和样式约束？",
    a: "完整支持 ScreenGui 及 7 种 UI 控件（Frame、TextLabel、TextButton、ImageLabel、ImageButton、TextBox、ScrollingFrame）与 8 种修饰器（UICorner、UIStroke、UIGradient、UIListLayout、UIGridLayout、UIPadding、UIAspectRatioConstraint、UISizeConstraint）。",
  },
  {
    q: "导入之后如果位置不对，能直接 Ctrl+Z 撤销吗？",
    a: "可以。插件每次创建 GUI 都会包裹在 ChangeHistoryService:SetWaypoint() 中，按 Ctrl+Z / Cmd+Z 就能完整撤销。",
  },
  {
    q: "Roblox Studio 的本地插件目录在哪里？",
    a: "Windows 路径为 %LOCALAPPDATA%\\Roblox\\Plugins；macOS 路径为 ~/Documents/Roblox/Plugins（也可以直接在 Studio 顶部菜单「插件 → 插件文件夹」一键打开）。",
  },
];

const SCHEMA_GRAPH = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      name: "Roblox GUI Maker Studio 离线同步插件",
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Windows, macOS (Roblox Studio)",
      url: PAGE_URL,
      downloadUrl: "https://robloxguimaker.app/studio-plugin/RobloxGuiMakerSync.lua",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      description:
        "零联网权限的 Roblox Studio 离线伴侣插件，支持把 robloxguimaker.app/editor 的 v1 JSON 直接还原为原生 ScreenGui 层次结构。",
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ_ITEMS.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ],
};

export default function ZhStudioPluginPage() {
  return (
    <ZhShell>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA_GRAPH) }}
        />

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel px-3 py-1 text-xs font-mono text-success mb-4">
            100% 本地离线 • 无任何 HTTP 请求或远程 require()
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink mb-3">
            Roblox Studio 离线同步伴侣插件
          </h1>
          <p className="text-base text-ink-dim max-w-2xl leading-relaxed">
            将在{" "}
            <Link href="/editor" className="text-focus hover:underline">
              /editor
            </Link>{" "}
            中搭建好的界面通过剪贴板一键同步回 Roblox Studio，自动生成原生{" "}
            <span className="font-mono text-ink">ScreenGui</span> 层级、UI 修饰器并记录{" "}
            <span className="font-mono text-ink">ChangeHistoryService</span> 撤销节点。
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/studio-plugin/RobloxGuiMakerSync.lua"
              download="RobloxGuiMakerSync.lua"
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-on-primary hover:opacity-90"
            >
              免费下载 RobloxGuiMakerSync.lua
            </a>
            <Link
              href="/editor"
              className="rounded-lg border border-line bg-panel px-5 py-2.5 text-sm font-medium text-ink hover:bg-raised"
            >
              打开 GUI 编辑器 →
            </Link>
          </div>
        </div>

        <section className="rounded-xl border border-line bg-panel p-6 mb-10">
          <h2 className="text-xl font-semibold text-ink mb-4">60 秒快速安装与使用（Windows &amp; macOS）</h2>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-ink-dim">
            <div className="space-y-3">
              <div>
                <p className="font-medium text-ink mb-1">1. 打开 Studio 本地插件目录</p>
                <p>在 Roblox Studio 顶部打开「Plugins（插件）」页签并点击「Plugins Folder」，或手动进入：</p>
              </div>
              <div className="rounded-lg border border-line bg-base p-3 font-mono text-xs text-ink space-y-1.5">
                <p>
                  <span className="text-ink-mute">Windows:</span> %LOCALAPPDATA%\Roblox\Plugins
                </p>
                <p>
                  <span className="text-ink-mute">macOS:</span> ~/Documents/Roblox/Plugins
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <p className="font-medium text-ink mb-1">2. 复制 Plugin JSON 并导入</p>
                <ol className="list-decimal list-inside space-y-1.5 leading-relaxed">
                  <li>
                    把下载好的 <span className="font-mono text-ink">RobloxGuiMakerSync.lua</span>{" "}
                    放进该文件夹，重启 Studio（或刷新本地插件）。
                  </li>
                  <li>
                    回到网页{" "}
                    <Link href="/editor" className="text-focus hover:underline">
                      GUI 编辑器
                    </Link>
                    ，在右侧代码栏点击 <span className="font-mono text-ink">Copy Plugin JSON</span>。
                  </li>
                  <li>
                    在 Studio 工具栏点击 <span className="font-mono text-ink">Import GUI</span>，粘贴
                    JSON 后选择导入到 <span className="text-ink">StarterGui</span> 或当前选中父节点。
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-4 mb-10">
          <div className="rounded-xl border border-line bg-panel p-5">
            <h3 className="text-sm font-semibold text-ink mb-2">安全零权限</h3>
            <p className="text-sm text-ink-dim leading-relaxed">
              源码中不包含任何 <span className="font-mono text-ink">HttpService:RequestAsync</span>、
              <span className="font-mono text-ink">GetAsync</span> 或远程{" "}
              <span className="font-mono text-ink">require(id)</span>，仅使用本地{" "}
              <span className="font-mono text-ink">JSONDecode</span>。
            </p>
          </div>
          <div className="rounded-xl border border-line bg-panel p-5">
            <h3 className="text-sm font-semibold text-ink mb-2">7 类控件 + 8 类修饰器全还原</h3>
            <p className="text-sm text-ink-dim leading-relaxed">
              精准还原 Frame、TextLabel、TextButton、ImageLabel、ImageButton、TextBox、ScrollingFrame 与
              UICorner / UIStroke / UIGradient / Layout / Constraint。
            </p>
          </div>
          <div className="rounded-xl border border-line bg-panel p-5">
            <h3 className="text-sm font-semibold text-ink mb-2">想要直接拖入 .rbxmx 模型？</h3>
            <p className="text-sm text-ink-dim leading-relaxed">
              如果不想装插件而希望直接下载模型文件，可升级{" "}
              <Link href="/zh/pricing" className="text-focus hover:underline">
                Studio Pro
              </Link>{" "}
              解锁无限 <span className="font-mono text-ink">.rbxmx</span> 导出与 10× AI 配额。
            </p>
          </div>
        </section>

        <section className="pt-8 border-t border-line">
          <h2 className="text-2xl font-semibold text-ink mb-6">常见问题</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {FAQ_ITEMS.map((item) => (
              <div key={item.q} className="rounded-xl border border-line bg-panel p-5">
                <h3 className="text-sm font-semibold text-ink mb-2">{item.q}</h3>
                <p className="text-sm text-ink-dim leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ZhShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ScenePreview } from "../../editor/ScenePreview";
import { getTemplate } from "../../editor/templates";
import { CATEGORIES_ZH, TEMPLATES_ZH } from "../../editor/templates.zh";
import { ZhShell } from "../_components/ZhShell";

export const metadata: Metadata = {
  title: "免费 Roblox GUI 模板 — 菜单、商店、HUD | Roblox GUI Maker",
  description:
    "免费 Roblox GUI 模板:主菜单、商店、设置、背包、加载界面、排行榜。自定义响应式布局,导出 Luau、JSON 或 ZIP。",
  openGraph: {
    title: "免费 Roblox GUI 模板 — 菜单、商店、HUD",
    description:
      "免费 Roblox GUI 模板:主菜单、商店、设置、背包、加载界面、排行榜。自定义后导出 Luau,粘进 Roblox Studio。",
    url: "https://robloxguimaker.app/zh/templates",
  },
  twitter: {
    card: "summary_large_image",
    title: "免费 Roblox GUI 模板 — 菜单、商店、HUD",
    description:
      "免费 Roblox GUI 模板:主菜单、商店、设置、背包、加载界面、排行榜。",
  },
  alternates: {
    canonical: "/zh/templates",
    languages: {
      en: "https://robloxguimaker.app/templates",
      zh: "https://robloxguimaker.app/zh/templates",
    },
  },
};

export default function TemplatesPage() {
  return (
    <ZhShell>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
          免费 Roblox GUI 模板
        </h1>
        <p className="text-ink-dim max-w-2xl mb-10">
          现成的 Roblox 界面,可在编辑器里打开、自定义,导出为干净的 Luau。每个模板都由真实的 Roblox 实例和布局构成。
        </p>

        {CATEGORIES_ZH.map((cat) => {
          const items = TEMPLATES_ZH.filter((t) => t.category === cat);
          if (items.length === 0) return null;
          return (
            <section key={cat} className="mb-12">
              <h2 className="text-xl font-semibold mb-4">{cat}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((t) => {
                  const en = getTemplate(t.slug);
                  return (
                    <Link
                      key={t.slug}
                      href={`/zh/templates/${t.slug}`}
                      className="group rounded-xl overflow-hidden ring-1 ring-line hover:ring-focus transition"
                    >
                      {en && <ScenePreview scene={en.scene} />}
                      <div className="p-3 bg-panel">
                        <p className="text-sm font-medium text-ink">
                          {t.title.replace("Roblox ", "").replace(" GUI", "")}
                        </p>
                        <p className="text-xs text-ink-mute">{t.tagline}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        <section className="mx-auto mt-16 max-w-3xl space-y-4 text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">如何挑选 Roblox GUI 模板</h2>
          <p>
            从最贴近玩家当下任务的界面开始,而不是只看配色。主菜单需要一个主导操作和一条通往设置的清晰路径;商店要放得下真实的物品名、价格和服务端校验后的购买状态;背包需要一种能随物品增加而不挡住选中项或装备操作的层级结构。
          </p>
          <p>
            在编辑器里打开模板,把每个占位文本换成真实的游戏文字。检查层级、给重要的面板和按钮改名,然后依次看桌面、平板、手机三种尺寸,最后再打磨细节。
          </p>
        </section>

        <section className="mx-auto mt-12 max-w-3xl space-y-4 text-ink-dim leading-relaxed">
          <h2 className="text-2xl font-semibold text-ink">自定义、预览、导出</h2>
          <p>
            模板用的是和从零搭建的项目相同的响应式几何与交互工具。组合 scale 和 offset、设置锚点和约束,导出前预览显示、隐藏、切换、RemoteEvent 或 Teleport 动作。
          </p>
          <p>
            下载界面用的客户端 Luau、可选的服务端 Luau（用于配置好的服务端动作）、供日后编辑的 JSON，或包含项目文件与放置说明的 ZIP 压缩包。你可以查看{" "}
            <Link
              href="/zh/guides/roblox-gui-script-generator"
              className="font-medium text-focus hover:underline"
            >
              生成脚本结构与安全边界
            </Link>
            、阅读{" "}
            <Link
              href="/zh/guides/how-to-import-rbxmx-into-roblox-studio"
              className="font-medium text-focus hover:underline"
            >
              Studio 原生 .rbxmx 导入教程
            </Link>
            ，或顺便制作{" "}
            <Link
              href="/zh/gamepass-icon-maker"
              className="font-medium text-focus hover:underline"
            >
              512×512 Gamepass 通行证图标
            </Link>
            。
          </p>
        </section>
      </div>
    </ZhShell>
  );
}

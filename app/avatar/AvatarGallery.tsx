"use client";

// Interactive part of the /avatar gallery: style filters, item thumbnails via
// the site's Roblox-thumbnail proxy, copy-ID actions and outbound catalog
// clicks. All conversion-relevant actions emit GA4 events so the TikTok
// validation loop can measure which styles actually pull players in.

import { useMemo, useState } from "react";
import Link from "next/link";
import { Check, Copy, ExternalLink } from "lucide-react";
import {
  AVATAR_LOOKS,
  STYLE_LABELS,
  catalogUrl,
  lookTotalRs,
  type AvatarItem,
  type AvatarLook,
  type AvatarStyle,
} from "./data";
import { resolveThumbnail } from "../editor/image-assets";
import { trackEvent } from "../lib/track";

const TYPE_LABELS: Record<AvatarItem["type"], { en: string; zh: string }> = {
  hair: { en: "Hair", zh: "发型" },
  face: { en: "Face", zh: "表情" },
  head: { en: "Head", zh: "头部" },
  top: { en: "Top", zh: "上装" },
  bottom: { en: "Bottom", zh: "下装" },
  shoes: { en: "Shoes", zh: "鞋子" },
  extra: { en: "Extra", zh: "配饰" },
};

function ItemThumbnail({ item }: { item: AvatarItem }) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useMemo(() => {
    let alive = true;
    resolveThumbnail(`rbxassetid://${item.id}`).then((resolved) => {
      if (!alive) return;
      if (resolved) setUrl(resolved);
      else setFailed(true);
    });
    return () => {
      alive = false;
    };
  }, [item.id]);

  return (
    <span className="grid place-items-center w-16 h-16 rounded-lg bg-input border border-line overflow-hidden shrink-0">
      {url ? (
        // Roblox CDN thumbnails; plain img — next/image offers nothing for
        // third-party hosts we don't control and CSP already allows.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={item.name} className="w-full h-full object-contain" loading="lazy" />
      ) : (
        <span className="text-[10px] text-ink-mute text-center px-1 leading-tight">
          {failed ? item.type : "…"}
        </span>
      )}
    </span>
  );
}

function LookCard({ look, zh }: { look: AvatarLook; zh: boolean }) {
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const total = lookTotalRs(look);

  async function copyId(item: AvatarItem) {
    try {
      await navigator.clipboard.writeText(String(item.id));
      setCopiedId(item.id);
      trackEvent("copy_avatar_item", { assetId: item.id, look: look.slug });
      setTimeout(() => setCopiedId((current) => (current === item.id ? null : current)), 1500);
    } catch {
      // Clipboard denied (permissions/no HTTPS): the ID is visible as text anyway.
    }
  }

  return (
    <article className="rounded-2xl border border-line bg-panel p-5 flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-1">
        <h3 className="text-lg font-semibold text-ink">
          {zh ? look.nameZh : look.name}
        </h3>
        <span
          className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            total === 0
              ? "bg-success/15 text-success"
              : "bg-input text-ink-dim"
          }`}
        >
          {total === 0 ? (zh ? "免费" : "Free") : `R$ ${total}`}
        </span>
      </div>
      <p className="text-sm text-ink-mute mb-4 leading-relaxed">
        {zh ? look.blurbZh : look.blurb}
      </p>
      <ul className="flex flex-col gap-3 mb-4">
        {look.items.map((item) => (
          <li key={item.id} className="flex items-center gap-3">
            <ItemThumbnail item={item} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-ink truncate">
                {zh ? item.nameZh : item.name}
              </p>
              <p className="text-xs text-ink-mute">
                {zh ? TYPE_LABELS[item.type].zh : TYPE_LABELS[item.type].en} ·{" "}
                <span className="font-mono">{item.id}</span> ·{" "}
                {item.price === 0 ? (zh ? "免费" : "Free") : `R$ ${item.price}`}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => copyId(item)}
                aria-label={zh ? `复制物品 ID ${item.id}` : `Copy item ID ${item.id}`}
                title={zh ? "复制物品 ID" : "Copy item ID"}
                className="grid place-items-center w-8 h-8 rounded-md text-ink-mute hover:text-ink hover:bg-raised transition-colors"
              >
                {copiedId === item.id ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
              <a
                href={catalogUrl(item.id)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("avatar_shop_click", { assetId: item.id, look: look.slug })}
                aria-label={zh ? `在 Roblox 商店查看 ${item.name}` : `View ${item.name} in the Roblox catalog`}
                title={zh ? "在 Roblox 商店打开" : "Open in the Roblox catalog"}
                className="grid place-items-center w-8 h-8 rounded-md text-ink-mute hover:text-ink hover:bg-raised transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-auto text-[11px] text-ink-mute">
        {zh
          ? "价格为抓取时的最低价,社区定价会浮动,以 Roblox 商店为准。"
          : "Prices are the lowest at pull time — community pricing shifts, the catalog page is the source of truth."}
      </p>
    </article>
  );
}

export function AvatarGallery({
  zh = false,
  looks = AVATAR_LOOKS,
  trackLookSet = "hub",
}: {
  zh?: boolean;
  /** Subset of looks to show (spoke pages pass their own); defaults to all. */
  looks?: AvatarLook[];
  trackLookSet?: string;
}) {
  const [filter, setFilter] = useState<"all" | "free" | AvatarStyle>("all");

  const styles = Array.from(new Set(looks.map((l) => l.style)));
  const visible =
    filter === "all"
      ? looks
      : filter === "free"
        ? looks.filter((l) => lookTotalRs(l) === 0)
        : looks.filter((l) => l.style === filter);

  function pick(next: typeof filter) {
    setFilter(next);
    trackEvent("avatar_filter", { style: next, set: trackLookSet });
  }

  const chip = (active: boolean) =>
    `rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
      active ? "bg-primary text-on-primary" : "border border-line text-ink-dim hover:text-ink"
    }`;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label={zh ? "筛选搭配" : "Filter looks"}>
        <button type="button" onClick={() => pick("all")} className={chip(filter === "all")}>
          {zh ? "全部" : "All"}
        </button>
        <button type="button" onClick={() => pick("free")} className={chip(filter === "free")}>
          {zh ? "免费" : "Free"}
        </button>
        {styles.map((s) => (
          <button key={s} type="button" onClick={() => pick(s)} className={chip(filter === s)}>
            {zh ? STYLE_LABELS[s].zh : STYLE_LABELS[s].en}
          </button>
        ))}
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {visible.map((look) => (
          <LookCard key={look.slug} look={look} zh={zh} />
        ))}
      </div>

      {/* Funnel CTA: players -> (someday) creators. The whole point of
          hosting avatar content on the GUI-maker domain. */}
      <section className="mt-14 rounded-2xl border border-line bg-panel p-6 text-center">
        <h2 className="text-xl font-semibold text-ink mb-2">
          {zh ? "想让你的形象出现在自己的游戏里?" : "Want your avatar style inside your own game?"}
        </h2>
        <p className="text-ink-dim leading-relaxed mb-4 max-w-xl mx-auto">
          {zh ? (
            <>
              每个热门游戏都有一套好看的界面。用免费的{" "}
              <Link href="/zh" className="text-focus hover:underline font-medium">
                Roblox GUI 制作器
              </Link>
              拖拽搭建主菜单、商店和背包界面,导出干净的 Luau 直接粘进 Studio。
            </>
          ) : (
            <>
              Every popular game has a polished interface. Build yours with the free{" "}
              <Link href="/" className="text-focus hover:underline font-medium">
                Roblox GUI maker
              </Link>{" "}
              — drag, drop, and export clean Luau for Studio, no coding needed.
            </>
          )}
        </p>
        <Link
          href="/editor"
          className="inline-block rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary transition hover:brightness-110"
        >
          {zh ? "打开编辑器 →" : "Open the editor →"}
        </Link>
      </section>
    </div>
  );
}

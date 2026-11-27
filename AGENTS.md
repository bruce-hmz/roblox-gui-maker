> **2026-11-27 起，robloxguimaker.app 在网站引擎上的内容以私有仓库 [bruce-hmz/my-sites-src](https://github.com/bruce-hmz/my-sites-src) 的 `sites/robloxguimaker.app/` 为准**，用那边的 `scripts/gfs.py` 推送。这里的 `scripts/import-gfs.mjs` 已停用（直接运行会退出），不要再用它往引擎写。注意：线上还由旧 Next.js Worker 渲染的路径（/editor、/pricing、各工具页、/kits/*、/gallery/*、/api/*，见 deploy.yml）仍以本仓库为准，照旧推 main 部署；只有引擎里的页面和主题改到 my-sites-src 去做。

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

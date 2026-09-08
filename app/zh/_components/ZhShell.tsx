import { SiteNav } from "../../components/SiteNav";
import { SiteFooter } from "../../components/SiteFooter";
import { ZhLangSetter } from "./ZhLangSetter";

// Shared shell for every zh page: locale-aware chrome + a `lang="zh-CN"` main.
// (App Router only allows <html>/<body> in the root layout, so we tag the
// content region rather than the document root — pragmatic, not perfect.)
export function ZhShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ZhLangSetter />
      <SiteNav locale="zh" />
      <main lang="zh-CN">{children}</main>
      <SiteFooter locale="zh" />
    </>
  );
}

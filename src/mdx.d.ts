declare module "*.mdx" {
  import type { ComponentType } from "react";
  import type { PageMeta } from "./app-shell/Router";

  export const meta: PageMeta | undefined;
  const MDXComponent: ComponentType;
  export default MDXComponent;
}
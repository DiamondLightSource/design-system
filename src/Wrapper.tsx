import { MDXProvider } from "@mdx-js/react";
import { mdxComponents } from "./mdx/components";

type PageProps = {
  component: React.ComponentType;
};

export default function MdxWrapper({ component: Component }: PageProps) {
  return (
    <MDXProvider components={mdxComponents}>
      <Component />
    </MDXProvider>
  );
}

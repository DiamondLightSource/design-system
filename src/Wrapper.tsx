import { MDXProvider } from "@mdx-js/react";
import { mdxComponents } from "./mdx/components";
import { ProsePage } from "./mdx/ProsePage";

type PageProps = {
  component: React.ComponentType;
  /**
   * Style markdown elements (headings, lists, tables, code) as documentation,
   * with an outline of the page's sections.
   * Turn off for pages that are laid out by hand.
   */
  prose?: boolean;
};

export default function MdxWrapper({
  component: Component,
  prose = true,
}: PageProps) {
  if (!prose) return <Component />;

  return (
    <MDXProvider components={mdxComponents}>
      <ProsePage>
        <Component />
      </ProsePage>
    </MDXProvider>
  );
}

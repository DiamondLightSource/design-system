import { MDXProvider } from "@mdx-js/react";
import { Box } from "@mui/material";
import { mdxComponents } from "./mdx/components";
import { readingWidth } from "./mdx/layout";

type PageProps = {
  component: React.ComponentType;
  /**
   * Style markdown elements (headings, lists, tables, code) as documentation.
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
      {/* Only top-level paragraphs: MDX also wraps text inside JSX tags (a
          button label, say) in a paragraph, which must keep its parent's style */}
      <Box
        sx={{
          "& > p": { typography: "body1", mb: 2, maxWidth: readingWidth },
        }}
      >
        <Component />
      </Box>
    </MDXProvider>
  );
}

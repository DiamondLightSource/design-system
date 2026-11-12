import Box from "@mui/material/Box";
import type { ReactNode } from "react";

/**
 * Padded content area for a page. It must not scroll on its own: the page
 * scrolls instead, so that sticky elements inside it can stay in view.
 */
export function ContentPanel({ children }: { children: ReactNode }) {
  return <Box sx={{ p: 2 }}>{children}</Box>;
}

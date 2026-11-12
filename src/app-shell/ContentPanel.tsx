import Box from "@mui/material/Box";
import type { ReactNode } from "react";

/** Padded, scrollable content area for a page */
export function ContentPanel({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        overflow: "auto",
        p: 2,
      }}
    >
      {children}
    </Box>
  );
}

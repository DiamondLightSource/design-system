import Box from "@mui/material/Box";
import type { MouseEvent } from "react";

export const MAIN_CONTENT_ID = "main-content";

/**
 * First focusable element on the page. Hidden until it receives keyboard
 * focus, then lets keyboard users jump past the navigation to the page.
 */
export function SkipLink() {
  // Moves focus by hand rather than following the `#main-content` fragment,
  // which would add a hash to the URL and an extra history entry.
  const skip = (event: MouseEvent<HTMLAnchorElement>) => {
    const main = document.getElementById(MAIN_CONTENT_ID);
    if (!main) return;
    event.preventDefault();
    main.focus();
  };

  return (
    <Box
      component="a"
      href={`#${MAIN_CONTENT_ID}`}
      onClick={skip}
      sx={{
        position: "fixed",
        top: 8,
        left: 8,
        zIndex: (theme) => theme.zIndex.drawer + 2,
        px: 2,
        py: 1,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        color: "text.primary",
        typography: "body2",
        textDecoration: "underline",
        transform: "translateY(-200%)",
        "&:focus": {
          transform: "none",
          outline: "2px solid",
          outlineColor: "primary.main",
          outlineOffset: 2,
        },
      }}
    >
      Skip to main content
    </Box>
  );
}

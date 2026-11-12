import { Box, Link, Typography } from "@mui/material";
import type { MouseEvent } from "react";
import type { OutlineHeading } from "./usePageOutline";

function OutlineLinks({
  headings,
  activeId,
  onNavigate,
}: {
  headings: OutlineHeading[];
  activeId?: string;
  onNavigate?: (event: MouseEvent<HTMLElement>) => void;
}) {
  return (
    <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
      {headings.map(({ id, text, level }) => {
        const active = id === activeId;
        return (
          <li key={id}>
            <Link
              href={`#${id}`}
              onClick={onNavigate}
              underline="none"
              variant="body2"
              aria-current={active ? "location" : undefined}
              sx={{
                display: "block",
                py: 0.5,
                pl: level === 2 ? 1.5 : 3,
                borderLeft: "2px solid",
                borderColor: active ? "primary.main" : "border.subtle",
                color: active ? "text.primary" : "text.secondary",
                fontWeight: active ? 600 : undefined,
                "&:hover": { color: "text.primary" },
              }}
            >
              {text}
            </Link>
          </li>
        );
      })}
    </Box>
  );
}

/** Sticky outline for wide pages, shown beside the content */
export function OutlineRail({
  headings,
  activeId,
}: {
  headings: OutlineHeading[];
  activeId?: string;
}) {
  return (
    <Box component="nav" aria-labelledby="page-outline-title">
      <Typography
        id="page-outline-title"
        variant="overline"
        color="text.secondary"
        sx={{ display: "block", pl: 1.5, mb: 0.5 }}
      >
        On this page
      </Typography>
      <OutlineLinks headings={headings} activeId={activeId} />
    </Box>
  );
}

/** Collapsed list at the top of the page, for when there is no room for the rail */
export function OutlineDisclosure({
  headings,
  activeId,
  top,
}: {
  headings: OutlineHeading[];
  activeId?: string;
  /** Distance from the top of the window to where the list is pinned */
  top: number;
}) {
  return (
    <Box
      component="details"
      sx={{
        px: 2,
        py: 1,
        border: "1px solid",
        borderColor: "border.subtle",
        borderRadius: 1,
      }}
    >
      <Typography
        component="summary"
        variant="body2"
        sx={{ cursor: "pointer", fontWeight: 600 }}
      >
        On this page
      </Typography>
      <Box
        sx={{
          mt: 1,
          maxHeight: `calc(100vh - ${top + 120}px)`,
          overflowY: "auto",
        }}
      >
        <OutlineLinks
          headings={headings}
          activeId={activeId}
          onNavigate={closeDisclosure}
        />
      </Box>
    </Box>
  );
}

/** Folds the list away once a link is chosen, so it does not cover the section */
function closeDisclosure(event: MouseEvent<HTMLElement>) {
  event.currentTarget.closest("details")?.removeAttribute("open");
}

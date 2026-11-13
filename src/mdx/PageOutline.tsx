import { Box, Button, Link, Popover, Typography } from "@mui/material";
import { ChevronDown } from "lucide-react";
import { useState, type MouseEvent } from "react";
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

/**
 * Collapsed list for when there is no room for the rail, in the flow of the
 * page between its introduction and the main text
 */
export function OutlineDisclosure({
  headings,
  activeId,
}: {
  headings: OutlineHeading[];
  activeId?: string;
}) {
  return (
    <Box component="nav" aria-label="On this page" sx={{ mb: 3 }}>
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
        <Box sx={{ mt: 1 }}>
          <OutlineLinks
            headings={headings}
            activeId={activeId}
            onNavigate={closeDisclosure}
          />
        </Box>
      </Box>
    </Box>
  );
}

/**
 * The same list as a button and a popover, for the page title bar, so it stays
 * in reach once the page has scrolled past the list in the flow
 */
export function OutlineMenu({
  headings,
  activeId,
}: {
  headings: OutlineHeading[];
  activeId?: string;
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const close = () => setAnchor(null);

  return (
    <>
      <Button
        size="small"
        endIcon={<ChevronDown size={16} aria-hidden />}
        aria-haspopup="true"
        aria-expanded={anchor !== null}
        onClick={(event) => setAnchor(event.currentTarget)}
      >
        On this page
      </Button>
      <Popover
        open={anchor !== null}
        anchorEl={anchor}
        onClose={close}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        // Locking the scroll would make the page jump as the scrollbar goes
        disableScrollLock
        slotProps={{
          paper: {
            sx: {
              mt: 0.5,
              p: 1,
              maxWidth: "calc(100vw - 32px)",
              maxHeight: "calc(100vh - 120px)",
            },
          },
        }}
      >
        <OutlineLinks
          headings={headings}
          activeId={activeId}
          onNavigate={close}
        />
      </Popover>
    </>
  );
}

/** Folds the list away once a link is chosen, so it does not cover the section */
function closeDisclosure(event: MouseEvent<HTMLElement>) {
  event.currentTarget.closest("details")?.removeAttribute("open");
}

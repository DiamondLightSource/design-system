import { useEffect, useRef, useState } from "react";
import { Box, Button, Drawer, useMediaQuery } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { PanelLeftOpen } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { routePath, type PagedSection, type SectionGroup } from "./Router";
import { APP_BAR_HEIGHT } from "./dimensions";
import { MAIN_CONTENT_ID } from "./SkipLink";
import {
  SectionNavToggleContext,
  SHOW_SECTION_NAV_ATTRIBUTE,
  usePersistentSectionNavCollapsed,
} from "./sectionNavState";
import { HideSectionNavButton } from "./sectionNavToggle";
import { NAV_WIDTH, SubNavContent } from "./SubNav";

/** The navigation beside the primary one, when it is on screen */
export const SECTION_NAV_ID = "section-nav";

/** The navigation beside the primary one, unless the reader has collapsed it */
export const SECTION_NAV_EXPANDED_SELECTOR = `#${SECTION_NAV_ID}:not([data-collapsed])`;

function useCurrentPagedSection(navigation: SectionGroup[]) {
  const { pathname } = useLocation();
  const [, currentPath] = pathname.split("/");

  return navigation
    .flatMap((group) => group.sections)
    .find(
      (section): section is PagedSection =>
        section.pages !== undefined && routePath(section) === currentPath,
    );
}

function toSubNavProps(section: PagedSection) {
  const sectionPath = routePath(section);

  return {
    title: section.name,
    groups: [
      {
        items: section.pages.map((page) => ({
          label: page.name,
          badge: page.soon ? "Soon" : undefined,
          linkProps: {
            component: NavLink,
            to: `/${sectionPath}/${routePath(page)}`,
          },
        })),
      },
    ],
  };
}

/**
 * Navigation between the pages of the current section, shown beside the
 * primary navigation on wider screens and in a drawer on narrow ones.
 * Renders nothing for sections without pages.
 */
export function SectionNav({
  navigation,
  children,
}: {
  navigation: SectionGroup[];
  children: React.ReactNode;
}) {
  const section = useCurrentPagedSection(navigation);
  // `md` rather than `sm`: beside the primary navigation, the sub navigation
  // leaves too little room for content between the two.
  const isWide = useMediaQuery((theme: Theme) => theme.breakpoints.up("md"));

  const { collapsed, setCollapsed } = usePersistentSectionNavCollapsed();
  const subNavProps = section && toSubNavProps(section);
  const showBeside = subNavProps && isWide;

  // Pressing either button removes it from the page, which would drop focus
  // to the top of the document; carry it to the button that takes its place.
  // Not on the first load, nor when the change came from resizing the window.
  const moveFocus = useRef(false);
  const toggle = (nextCollapsed: boolean) => {
    moveFocus.current = true;
    setCollapsed(nextCollapsed);
  };
  useEffect(() => {
    if (!moveFocus.current) return;
    moveFocus.current = false;
    if (collapsed) {
      // The title bar's button is there but not focusable while the bar is hidden
      for (const button of document.querySelectorAll<HTMLElement>(
        `[${SHOW_SECTION_NAV_ATTRIBUTE}]`,
      )) {
        button.focus({ preventScroll: true });
        if (document.activeElement === button) break;
      }
    } else {
      document
        .querySelector<HTMLElement>(`#${SECTION_NAV_ID} button`)
        ?.focus({ preventScroll: true });
    }
  }, [collapsed]);

  const sectionNavToggle =
    showBeside && collapsed ? { show: () => toggle(false) } : null;

  return (
    <>
      {showBeside && (
        <Box
          component="nav"
          id={SECTION_NAV_ID}
          aria-label={`${subNavProps.title} pages`}
          data-collapsed={collapsed ? "" : undefined}
          sx={{
            display: "flex",
            width: collapsed ? 0 : NAV_WIDTH + 1, // +1 pixel for the border
            flexShrink: 0,
            // Clipped, not hidden: the content inside is sticky, and a
            // scroll container would stop it sticking to the window
            overflowX: "clip",
            bgcolor: (theme: Theme) => theme.palette.surface.elevated(1),
            // Hidden once it has slid away, so Tab cannot reach what is not
            // on screen; shown again at the start of the slide back
            visibility: collapsed ? "hidden" : "visible",
            transition: `width 150ms, visibility 0s linear ${collapsed ? "150ms" : "0s"}`,
            "@media (prefers-reduced-motion: reduce)": { transition: "none" },
          }}
        >
          {/* Keeps its width while the panel around it narrows, so its text does not re-wrap */}
          <Box
            sx={{
              width: NAV_WIDTH + 1,
              flexShrink: 0,
              pt: `${APP_BAR_HEIGHT}px`,
              borderRight: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                position: "sticky",
                top: APP_BAR_HEIGHT,
                height: `calc(100vh - ${APP_BAR_HEIGHT}px)`,
              }}
            >
              <SubNavContent
                {...subNavProps}
                titleEndSlot={
                  <HideSectionNavButton onClick={() => toggle(true)} />
                }
              />
            </Box>
          </Box>
        </Box>
      )}

      <Box
        component="main"
        id={MAIN_CONTENT_ID}
        // Focusable by script only, as the skip link's target. Without this
        // the skip link scrolls but leaves the next Tab starting back at the top.
        tabIndex={-1}
        sx={{
          flexGrow: 1,
          minWidth: 0,
          pt: 6,
          outline: "none",
          // Focused by script after a page change so it is read out; it is
          // not a control, so a ring on it would suggest it can be used
          "& h1:focus": { outline: "none" },
        }}
      >
        {subNavProps && !isWide && <NarrowSectionNav {...subNavProps} />}
        <SectionNavToggleContext.Provider value={sectionNavToggle}>
          {children}
        </SectionNavToggleContext.Provider>
      </Box>
    </>
  );
}

/**
 * The section's pages on a narrow screen: a button at the top of the page that
 * opens them in a drawer. The drawer's open state lives here, so it starts
 * closed each time the screen narrows to this layout.
 */
function NarrowSectionNav(props: ReturnType<typeof toSubNavProps>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box sx={{ px: 2, pt: 1 }}>
        <Button
          size="small"
          startIcon={<PanelLeftOpen size={16} aria-hidden />}
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
        >
          Show {props.title} pages
        </Button>
      </Box>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        onClick={() => setOpen(false)}
        slotProps={{ paper: { sx: { width: NAV_WIDTH, pt: 6 } } }}
      >
        <SubNavContent {...props} onBack={() => setOpen(false)} />
      </Drawer>
    </>
  );
}

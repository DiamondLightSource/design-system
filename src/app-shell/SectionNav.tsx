import { useState } from "react";
import { Box, Button, Drawer, useMediaQuery } from "@mui/material";
import type { Theme } from "@mui/material/styles";
import { ChevronRight } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { routePath, type PagedSection, type SectionGroup } from "./Router";
import { NAV_WIDTH, SubNavContent } from "./SubNav";

const APP_BAR_HEIGHT = 48;

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
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [wasWide, setWasWide] = useState(isWide);
  if (isWide !== wasWide) {
    setWasWide(isWide);
    if (isWide) {
      setDrawerOpen(false);
    }
  }

  if (!section) {
    return <Box component="main" sx={{ flexGrow: 1, pt: 6 }}>{children}</Box>;
  }

  const subNavProps = toSubNavProps(section);

  return (
    <>
      {isWide && (
        <Box
          component="nav"
          aria-label={`${section.name} pages`}
          sx={{
            width: NAV_WIDTH + 1, // +1 pixel for the border
            flexShrink: 0,
            pt: `${APP_BAR_HEIGHT}px`,
            bgcolor: (theme: Theme) => theme.palette.surface.elevated(1),
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
            <SubNavContent {...subNavProps} />
          </Box>
        </Box>
      )}

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, pt: 6 }}>
        {!isWide && (
          <Box sx={{ px: 2, pt: 1 }}>
            <Button
              size="small"
              endIcon={<ChevronRight size={16} />}
              aria-haspopup="dialog"
              onClick={() => setDrawerOpen(true)}
            >
              {section.name} pages
            </Button>
          </Box>
        )}
        {children}
      </Box>

      {!isWide && (
        <Drawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onClick={() => setDrawerOpen(false)}
          slotProps={{ paper: { sx: { width: NAV_WIDTH, pt: 6 } } }}
        >
          <SubNavContent
            {...subNavProps}
            onBack={() => setDrawerOpen(false)}
          />
        </Drawer>
      )}
    </>
  );
}

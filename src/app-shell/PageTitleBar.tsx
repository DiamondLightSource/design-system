import { Bar } from "@diamondlightsource/sci-react-ui";
import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { APP_BAR_HEIGHT, TITLE_BAR_HEIGHT } from "./dimensions";
import { TitleBarSlotContext } from "./titleBarSlot";
import type { PageTitleBarState } from "./usePageTitleBar";

interface PageTitleBarProps {
  /** From `usePageTitleBar`, called by the page that holds the title */
  state: PageTitleBarState;
  /** The page; the bar is drawn first inside it, over the top of it */
  children: ReactNode;
}

/**
 * Wraps a page with a bar that pins its title under the app bar once the
 * heading has scrolled away. The bar takes no room of its own and overlays the
 * content while it shows. Content inside can add a control to the bar's
 * right-hand end through `useTitleBarSlot`.
 * The heading is still on the page, so the bar's text is hidden from screen
 * readers to avoid reading the title twice; any control in it is not.
 */
export function PageTitleBar({ state, children }: PageTitleBarProps) {
  const { title, shown, slot, setSlot } = state;

  return (
    <>
      {title && (
        <TitleStrip title={title} shown={shown} slotRef={setSlot} />
      )}
      <TitleBarSlotContext.Provider value={slot}>
        {children}
      </TitleBarSlotContext.Provider>
    </>
  );
}

function TitleStrip({
  title,
  shown,
  slotRef,
}: {
  title: string;
  shown: boolean;
  slotRef: (slot: HTMLElement | null) => void;
}) {
  return (
    <Box
      sx={{
        position: "sticky",
        top: APP_BAR_HEIGHT,
        height: 0,
        zIndex: 2,
        pointerEvents: "none",
      }}
    >
      <Bar
        surface="paper"
        containerWidth={false}
        leftSlot={
          <Typography variant="h5" component="div" noWrap aria-hidden="true">
            {title}
          </Typography>
        }
        rightSlot={<Box ref={slotRef} />}
        sx={{
          position: "absolute",
          insetInline: 0,
          top: 0,
          height: TITLE_BAR_HEIGHT,
          borderBottom: 1,
          borderColor: "divider",
          pointerEvents: shown ? "auto" : "none",
          opacity: shown ? 1 : 0,
          visibility: shown ? "visible" : "hidden",
          transition: "opacity 150ms, visibility 150ms",
          "@media (prefers-reduced-motion: reduce)": { transition: "none" },
          // Bar's own side padding is wider than the page's from 600px
          "& .MuiContainer-root": { px: 2 },
          // So a long title is cut short with an ellipsis and not the button
          "& .left-slot": { minWidth: 0, flex: 1 },
        }}
      />
    </Box>
  );
}

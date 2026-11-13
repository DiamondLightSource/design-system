import { IconButton, Tooltip } from "@mui/material";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import {
  SHOW_SECTION_NAV_ATTRIBUTE,
  useSectionNavToggle,
} from "./sectionNavState";

export function HideSectionNavButton({ onClick }: { onClick: () => void }) {
  const label = "Collapse sidebar";
  return (
    <Tooltip title={label}>
      <IconButton size="small" aria-label={label} edge="end" onClick={onClick}>
        <PanelLeftClose size={20} strokeWidth={1.75} aria-hidden />
      </IconButton>
    </Tooltip>
  );
}

/**
 * Brings back the hidden section navigation; renders nothing while it is showing.
 * `concealed` hides it from sight, Tab and screen readers but keeps its space.
 */
export function ShowSectionNavButton({
  concealed = false,
}: {
  concealed?: boolean;
}) {
  const toggle = useSectionNavToggle();
  if (!toggle) return null;

  const label = "Expand sidebar";
  return (
    <Tooltip title={label}>
      <IconButton
        size="small"
        aria-label={label}
        onClick={toggle.show}
        sx={concealed ? { visibility: "hidden" } : undefined}
        {...{ [SHOW_SECTION_NAV_ATTRIBUTE]: "" }}
      >
        <PanelLeftOpen size={20} strokeWidth={1.75} aria-hidden />
      </IconButton>
    </Tooltip>
  );
}

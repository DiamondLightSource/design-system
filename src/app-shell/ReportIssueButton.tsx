import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import { Bug } from "lucide-react";
import { useLocation } from "react-router-dom";

const NEW_ISSUE_URL =
  "https://github.com/DiamondLightSource/design-system/issues/new";

const LABEL = "Report an issue";

/** The new issue form, with the page being read and a short template filled in */
function newIssueUrl(page: string) {
  const params = new URLSearchParams({
    body: [
      `Page: ${page}`,
      "## What is the issue?",
      "Describe what you saw, or what is missing or unclear.",
      "## What did you expect?",
      "",
    ].join("\n\n"),
  });
  return `${NEW_ISSUE_URL}?${params}`;
}

/**
 * Opens a new GitHub issue about the page the reader is on, in a new tab.
 * Sits in the foot of the primary navigation, which draws the divider above it,
 * and is styled like the navigation items.
 */
export function ReportIssueButton({ open }: { open: boolean }) {
  const { pathname, search, hash } = useLocation();
  // A development address, even one on the local network, means nothing to the
  // people reading the issue
  const local =
    import.meta.env.DEV ||
    ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);
  const href = newIssueUrl(
    `${local ? "" : window.location.origin}${pathname}${search}${hash}`,
  );

  const icon = (
    <ListItemIcon
      sx={{
        minWidth: 32,
        width: 32,
        height: 32,
        justifyContent: "center",
        alignItems: "center",
        color: open ? "text.secondary" : "text.primary",
      }}
    >
      <Bug />
    </ListItemIcon>
  );

  return (
    <List disablePadding>
      <ListItem disablePadding>
        <Tooltip title={open ? "" : LABEL} placement="right">
          <ListItemButton
            component="a"
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${LABEL} (opens GitHub in a new tab)`}
            sx={{ p: 1, borderRadius: 2, gap: 1.5 }}
          >
            {icon}
            <ListItemText
              primary={LABEL}
              slotProps={{ primary: { noWrap: true } }}
              sx={{
                overflow: "hidden",
                opacity: open ? 1 : 0,
                transition: (theme) =>
                  theme.transitions.create("opacity", {
                    duration: theme.transitions.duration.shorter,
                  }),
              }}
            />
          </ListItemButton>
        </Tooltip>
      </ListItem>
    </List>
  );
}

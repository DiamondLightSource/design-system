import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import type { Theme } from "@mui/material/styles";

import { Menu } from "lucide-react";
import { Link as RouterLink } from "react-router-dom";

import {
  ColourSchemeButton,
  Logo,
  Navbar,
} from "@diamondlightsource/sci-react-ui";

type Props = {
  title: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export function TopBar({ title, open, setOpen }: Props) {
  const isNarrow = useMediaQuery((theme: Theme) =>
    theme.breakpoints.down("sm"),
  );

  return (
    <Navbar
      surface="surface"
      variant="base"
      containerWidth={false}
      leftSlot={
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            ml: -2,
          }}
        >
          <IconButton
            size="small"
            aria-label="menu"
            sx={{ color: "inherit" }}
            onClick={() => setOpen(!open)}
          >
            <Menu />
          </IconButton>
          <Logo short={isNarrow} />
          <Divider orientation="vertical" flexItem sx={{ my: 0.5 }} />
          <Typography
            variant="h2Display"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              fontSize: "var(--ds-type-h5-size)",
              color: "var(--ds-on-brand-container)",
              textDecoration: "none",
              borderRadius: 0.5,
              transition: "color 120ms",
              "&:hover": { color: "var(--ds-brand-accent)" },
              "&:focus-visible": {
                color: "var(--ds-brand-accent)",
                outline: "2px solid var(--ds-brand-accent)",
                outlineOffset: 2,
              },
            }}
          >
            {title}
          </Typography>
          <Chip label="Beta" size="small" variant="outlined" />
        </Box>
      }
      rightSlot={<ColourSchemeButton />}
      sx={{
        position: "fixed",
        top: 0,
        minHeight: 48,
        height: 48,
        zIndex: (theme) => theme.zIndex.drawer + 1,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    />
  );
}

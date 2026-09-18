import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import { Menu } from "lucide-react";

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
          <Logo />
          <Divider orientation="vertical" flexItem sx={{ my: 1 }} />
          <Typography variant="h6" noWrap component="div">
            {title}
          </Typography>
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

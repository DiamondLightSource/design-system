import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme } from "@mui/material/styles";
import {
  DiamondDSTheme,
  ThemeProvider,
} from "@diamondlightsource/sci-react-ui";
import "@diamondlightsource/sci-react-ui/font-styles.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router.tsx";

const appTheme = createTheme(DiamondDSTheme, {
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          minHeight: 48,
          height: 48,
          "@media (min-width: 600px)": {
            minHeight: 48,
            height: 48,
          },
        },
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={appTheme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
);

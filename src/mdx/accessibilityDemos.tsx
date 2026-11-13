import { Box, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { InlineCode } from "./elements";

type Mode = "light" | "dark";

/**
 * A panel that shows its contents in a chosen colour mode, whatever mode the
 * page itself is in. Setting `data-mode` re-scopes the `--ds-*` tokens.
 */
function ModePanel({
  mode,
  title,
  children,
}: {
  mode: Mode;
  title: string;
  children: ReactNode;
}) {
  return (
    <Box
      component="section"
      data-mode={mode}
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid",
        borderColor: "var(--ds-border-subtle)",
        backgroundColor: "var(--ds-background)",
        color: "var(--ds-on-surface)",
      }}
    >
      <Typography
        variant="subtitle1"
        component="h4"
        data-outline="skip"
        sx={{
          pb: 0.75,
          mb: 1.5,
          borderBottom: "1px solid",
          borderColor: "var(--ds-border-subtle)",
          color: "inherit",
        }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  );
}

/** Light and dark panels side by side, stacked on narrow screens */
function ModePanels({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        mb: 3,
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
      }}
    >
      {children}
    </Box>
  );
}

const caption = {
  fontSize: 13,
  color: "var(--ds-on-surface-variant)",
  m: 0,
} as const;

/** A token name and its value, in the monospace chip used for tokens */
function TokenChip({ children }: { children: ReactNode }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-block",
        px: 0.75,
        py: 0.25,
        borderRadius: 0.75,
        border: "1px solid",
        borderColor: "var(--ds-border-subtle)",
        backgroundColor: "var(--ds-surface-container)",
        color: "var(--ds-on-surface-variant)",
        fontFamily: "var(--ds-font-family-mono, monospace)",
        fontSize: 13,
      }}
    >
      {children}
    </Box>
  );
}

function Chip({
  background,
  colour,
  children,
}: {
  background: string;
  colour: string;
  children: ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        width: "fit-content",
        maxWidth: "100%",
        px: 1.5,
        py: 1.25,
        borderRadius: 1,
        backgroundColor: background,
        color: colour,
        fontSize: 14,
        fontWeight: 650,
        lineHeight: 1.2,
      }}
    >
      {children}
    </Box>
  );
}

const statuses = ["Success", "Warning", "Danger"] as const;

type Variant = "text" | "chip";
type SimulatedRole = {
  role: string;
  variant: Variant;
  /** Colour on the chip's text, for roles that sit on a coloured background */
  onColour: string;
  rows: [label: string, success: string, warning: string, danger: string][];
};

/** Status colours as designed and under simulated colour vision deficiency */
const simulated: Record<Mode, SimulatedRole[]> = {
  light: [
    {
      role: "Main",
      variant: "text",
      onColour: "",
      rows: [
        ["As designed", "#137329", "#a95703", "#ae1e13"],
        ["Simulated: protanopia", "#756821", "#706100", "#4e450f"],
        ["Simulated: deuteranopia", "#6a602f", "#837401", "#716406"],
      ],
    },
    {
      role: "Solid",
      variant: "chip",
      onColour: "#ffffff",
      rows: [
        ["As designed", "#1b8834", "#e97b12", "#d63c41"],
        ["Simulated: protanopia", "#8a7b2b", "#9c8900", "#686040"],
        ["Simulated: deuteranopia", "#7e733b", "#b6a20f", "#8f813c"],
      ],
    },
    {
      role: "Container",
      variant: "chip",
      onColour: "#1a1c23",
      rows: [
        ["As designed", "#d4f3df", "#fef0df", "#fde7e5"],
        ["Simulated: protanopia", "#f3eede", "#f5f0de", "#ebe9e5"],
        ["Simulated: deuteranopia", "#edeae0", "#f9f3df", "#f0ede5"],
      ],
    },
  ],
  dark: [
    {
      role: "Main",
      variant: "text",
      onColour: "",
      rows: [
        ["As designed", "#6fd88a", "#ffb067", "#ff9088"],
        ["Simulated: protanopia", "#d9c985", "#c9b660", "#a9a187"],
        ["Simulated: deuteranopia", "#cabf8f", "#dbc868", "#c4b886"],
      ],
    },
    {
      role: "Solid",
      variant: "chip",
      onColour: "#ffffff",
      rows: [
        ["As designed", "#23913c", "#f07a13", "#d63c41"],
        ["Simulated: protanopia", "#938434", "#9d8a00", "#686040"],
        ["Simulated: deuteranopia", "#867b43", "#b9a50e", "#8f813c"],
      ],
    },
    {
      role: "Container",
      variant: "chip",
      onColour: "#e8eaf0",
      rows: [
        ["As designed", "#10341a", "#382006", "#3a1613"],
        ["Simulated: protanopia", "#342f18", "#282204", "#1f1c13"],
        ["Simulated: deuteranopia", "#302c1c", "#2d2806", "#282412"],
      ],
    },
  ],
};

/** Success, warning and danger as designed and as seen with colour blindness */
export function CvdSimulation() {
  return (
    <ModePanels>
      {(["light", "dark"] as const).map((mode) => (
        <ModePanel
          key={mode}
          mode={mode}
          title={`${mode === "light" ? "Light" : "Dark"}: under CVD simulation`}
        >
          {simulated[mode].map(({ role, variant, onColour, rows }) => (
            <Box key={role} sx={{ mt: 2.25 }}>
              <Typography variant="subtitle2" component="p" sx={{ m: 0 }}>
                {role}
              </Typography>
              {rows.map(([label, ...colours]) => (
                <Box key={label} sx={{ mt: 1 }}>
                  <p style={caption}>{label}</p>
                  <Box
                    sx={{
                      mt: 0.5,
                      display: "grid",
                      gridAutoFlow: "column",
                      gridAutoColumns: "1fr",
                      gap: 1.25,
                    }}
                  >
                    {statuses.map((status, index) =>
                      variant === "text" ? (
                        <Box
                          key={status}
                          component="span"
                          sx={{ color: colours[index], fontWeight: 650 }}
                        >
                          {status}
                        </Box>
                      ) : (
                        <Chip
                          key={status}
                          background={colours[index]}
                          colour={onColour}
                        >
                          {status}
                        </Chip>
                      ),
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          ))}
        </ModePanel>
      ))}
    </ModePanels>
  );
}

const warningMessage = "Beamline temperature near limit";

/** Black and white text on the warning button, with ratio and APCA scores */
export function WarningButtonComparison() {
  const modes = [
    {
      mode: "light",
      title: "Light: Warning button",
      value: "#e97b12",
      wcag: ["5.9:1", "2.9:1"],
      apca: ["48", "60"],
    },
    {
      mode: "dark",
      title: "Dark: Warning button",
      value: "#f07a13",
      wcag: ["6.1:1", "2.8:1"],
      apca: ["49", "59"],
    },
  ] as const;

  return (
    <ModePanels>
      {modes.map(({ mode, title, value, wcag, apca }) => (
        <ModePanel key={mode} mode={mode} title={title}>
          <TokenChip>--ds-warning-solid: {value}</TokenChip>
          <Box sx={{ mt: 1.5, display: "grid", gap: 2 }}>
            <Box sx={{ display: "grid", gap: 0.75 }}>
              <p style={caption}>
                <strong>WCAG 2.2 would favour this</strong>: {wcag[0]}, clears
                AA
              </p>
              <Chip background={value} colour="#1a1c23">
                {warningMessage}
              </Chip>
              <p style={caption}>APCA Lc ≈ {apca[0]}, reads as strained</p>
            </Box>
            <Box sx={{ display: "grid", gap: 0.75 }}>
              <p style={caption}>
                <strong>What we ship</strong>: {wcag[1]}, fails AA on the ratio
                alone
              </p>
              <Chip background={value} colour="#ffffff">
                {warningMessage}
              </Chip>
              <p style={caption}>APCA Lc ≈ {apca[1]}, reads as legible</p>
            </Box>
          </Box>
        </ModePanel>
      ))}
    </ModePanels>
  );
}

const dangerMessage = "Connection to detector lost: retry required";

/** Danger text as shipped and darkened or lightened further for contrast */
export function DangerTradeoff() {
  const text = (colour: string) => (
    <Box
      component="span"
      sx={{ color: colour, fontFamily: "var(--ds-font-family-mono)" }}
    >
      {dangerMessage}
    </Box>
  );

  return (
    <ModePanels>
      <ModePanel mode="light" title="Light: Danger text on surface">
        <TokenChip>--ds-danger: #ae1e13</TokenChip>
        <Box sx={{ mt: 1.5, display: "grid", gap: 2 }}>
          <Box sx={{ display: "grid", gap: 0.75 }}>
            <p style={caption}>
              <strong>Shipped today</strong>: 7.0:1, clears WCAG
            </p>
            {text("#ae1e13")}
            <p style={caption}>
              APCA Lc ≈ 83, still just under where APCA would like body-sized
              text
            </p>
          </Box>
          <Box sx={{ display: "grid", gap: 0.75 }}>
            <p style={caption}>
              <strong>Pushed further for compliance</strong>: 9.9:1
            </p>
            {text("#8a0000")}
            <p style={caption}>
              APCA Lc ≈ 91, and <InlineCode>#8a0000</InlineCode> still reads
              plainly as danger red: a deep brick red, not a different colour.
              Darkening barely costs “obvious” anything here.
            </p>
          </Box>
        </Box>
      </ModePanel>
      <ModePanel mode="dark" title="Dark: Danger text on surface">
        <TokenChip>--ds-danger: #ff9088</TokenChip>
        <Box sx={{ mt: 1.5, display: "grid", gap: 2 }}>
          <Box sx={{ display: "grid", gap: 0.75 }}>
            <p style={caption}>
              <strong>Shipped today</strong>: 8.1:1, comfortably clears WCAG
            </p>
            {text("#ff9088")}
            <p style={caption}>
              APCA Lc ≈ 58, below where APCA would like body-sized text, but
              still unmistakably read as danger red
            </p>
          </Box>
          <Box sx={{ display: "grid", gap: 0.75 }}>
            <p style={caption}>
              <strong>Pushed further for compliance</strong>: 14.5:1
            </p>
            {text("#ffe2e0")}
            <p style={caption}>
              APCA Lc ≈ 92, but <InlineCode>#ffe2e0</InlineCode> is only a few
              RGB points off white (255, 226, 224). Say it plainly: this no
              longer reads as red at all, let alone danger. Obvious has been
              traded away to get there.
            </p>
          </Box>
        </Box>
      </ModePanel>
    </ModePanels>
  );
}

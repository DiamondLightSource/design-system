import { useTheme } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { createContext, Fragment, useContext, useId, type ReactNode } from "react";

/**
 * Building blocks for schematic layout diagrams.
 *
 * The diagrams are skeletons: blocks for regions, bars for text and small
 * squares for icons. They don't render real components. Every colour comes
 * from the theme's neutral tokens, so the diagrams follow light and dark mode.
 *
 * Coordinates are in diagram units, with the whole diagram on a 1080 x 640 grid.
 */

/** Tones available to a diagram, named by role and not by value */
export type Tone =
  | "canvas" // background.default: the workspace behind its content
  | "paper" // background.paper: panels and drawers
  | "subtle" // surface.subtle: quiet grouped regions
  | "strong" // surface.strong: selected or nested regions
  | "none";

type Ink = "primary" | "secondary" | "line" | "faint" | "edge" | "placeholder";

function usePalette() {
  const theme = useTheme();
  const palette = (theme.vars?.palette ?? theme.palette) as unknown as Record<
    string,
    Record<string, string>
  >;

  const tone: Record<Tone, string> = {
    canvas: palette.background.default,
    paper: palette.background.paper,
    subtle: palette.surface.subtle,
    strong: palette.surface.strong,
    none: "none",
  };

  const ink: Record<Ink, string> = {
    primary: palette.text.primary,
    secondary: palette.text.secondary,
    // Dividers where regions meet, to reinforce the tone changes
    line: palette.border.emphasis,
    // Fainter bars for body content behind the main labels
    faint: palette.border.subtle,
    // Outlines of controls and icons
    edge: palette.border.emphasis,
    // Bars standing in for text, a step above the lines so they read as content
    placeholder: palette.border.strong,
  };

  return { tone, ink, backdrop: palette.common?.backdrop ?? "#000" };
}

type Rect = { x: number; y: number; w: number; h: number };

/**
 * Borders and dividers are one device pixel wide however far the diagram is
 * scaled, and snap to the pixel grid, so every one reads at the same strength.
 */
function hairline(colour: string) {
  return {
    stroke: colour,
    strokeWidth: 1,
    vectorEffect: "non-scaling-stroke",
    shapeRendering: "crispEdges",
  } as const;
}

/** The sides of a block that carry a subtle dividing line */
export type Sides = Partial<Record<"top" | "right" | "bottom" | "left", true>>;

/**
 * A filled block. Regions are told apart mainly by tone, with a subtle line on
 * the sides where two regions meet.
 */
export function Block({
  x,
  y,
  w,
  h,
  tone,
  sides,
  children,
}: Rect & { tone: Tone; sides?: Sides; children?: ReactNode }) {
  const { tone: tones, ink } = usePalette();
  const line = hairline(ink.line);

  // Each line sits just inside its block, so a neighbour painted later can't
  // cover half of it
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} style={{ fill: tones[tone] }} />
      {children}
      {sides?.top && (
        <line x1={x} x2={x + w} y1={y + 0.5} y2={y + 0.5} style={line} />
      )}
      {sides?.bottom && (
        <line
          x1={x}
          x2={x + w}
          y1={y + h - 0.5}
          y2={y + h - 0.5}
          style={line}
        />
      )}
      {sides?.left && (
        <line x1={x + 0.5} x2={x + 0.5} y1={y} y2={y + h} style={line} />
      )}
      {sides?.right && (
        <line
          x1={x + w - 0.5}
          x2={x + w - 0.5}
          y1={y}
          y2={y + h}
          style={line}
        />
      )}
    </g>
  );
}

/** A box with an outline, for a field, button or the content viewport */
export function Outlined({
  x,
  y,
  w,
  h,
  tone = "paper",
  stroke = "edge",
}: Rect & { tone?: Tone; stroke?: "edge" | "line" }) {
  const { tone: tones, ink } = usePalette();

  return (
    <rect
      x={x + 0.5}
      y={y + 0.5}
      width={w - 1}
      height={h - 1}
      style={{ fill: tones[tone], ...hairline(ink[stroke]) }}
    />
  );
}

/** A small square standing in for an icon or control */
export function IconBox({
  x,
  y,
  size = 10,
}: {
  x: number;
  y: number;
  size?: number;
}) {
  return <Outlined x={x} y={y} w={size} h={size} />;
}

/** A bar standing in for a line of text */
export function Bar({
  x,
  y,
  w,
  h = 5.333,
  light = false,
}: {
  x: number;
  y: number;
  w: number;
  h?: number;
  /** Fainter, for body content behind the main labels */
  light?: boolean;
}) {
  const { ink } = usePalette();

  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      style={{ fill: light ? ink.faint : ink.placeholder }}
    />
  );
}

/** The bold letter-and-name label that identifies a region */
export function RegionLabel({
  x,
  y,
  size = 13,
  anchor = "start",
  children,
}: {
  x: number;
  y: number;
  size?: number;
  anchor?: "start" | "middle";
  children: ReactNode;
}) {
  const { ink } = usePalette();

  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      style={{
        fill: ink.primary,
        fontSize: size,
        fontWeight: 600,
        fontFamily: "inherit",
      }}
    >
      {children}
    </text>
  );
}

/** Quieter text for hints and group labels */
export function Hint({
  x,
  y,
  size = 11,
  anchor = "start",
  children,
}: {
  x: number;
  y: number;
  size?: number;
  anchor?: "start" | "middle";
  children: ReactNode;
}) {
  const { ink } = usePalette();

  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      style={{ fill: ink.secondary, fontSize: size, fontFamily: "inherit" }}
    >
      {children}
    </text>
  );
}

/** A disclosure chevron, pointing up for an open group and down for a closed one */
export function Chevron({
  x,
  y,
  open,
}: {
  x: number;
  y: number;
  open: boolean;
}) {
  const { ink } = usePalette();
  const d = open ? "M2.667 0 0 -2.667 -2.667 0" : "M-2.667 0 0 2.667 2.667 0";

  return (
    <path
      d={d}
      transform={`translate(${x} ${y})`}
      style={{
        fill: "none",
        stroke: ink.secondary,
        strokeWidth: 1.333,
        strokeLinecap: "round",
      }}
    />
  );
}

/** A circled cross for a close control */
export function CloseIcon({ x, y, r = 5.5 }: { x: number; y: number; r?: number }) {
  const { ink } = usePalette();
  const arm = r * 0.4;

  return (
    <g style={{ stroke: ink.primary, fill: "none", strokeWidth: 1.2 }}>
      <circle cx={x} cy={y} r={r} />
      <path
        d={`M${x - arm} ${y - arm}L${x + arm} ${y + arm}M${x + arm} ${y - arm}L${x - arm} ${y + arm}`}
        strokeLinecap="round"
      />
    </g>
  );
}

/** A straight line between two points, in the divider colour */
export function Line({
  x1,
  y1,
  x2,
  y2,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}) {
  const { ink } = usePalette();

  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      style={hairline(ink.line)}
    />
  );
}

/** Dims what sits behind an overlay, such as a temporary drawer or a modal */
export function Scrim({ x, y, w, h }: Rect) {
  const { backdrop } = usePalette();
  const { mode, systemMode } = useColorScheme();
  const dark = (mode === "system" ? systemMode : mode) === "dark";

  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      style={{ fill: backdrop }}
      // A dark surface needs more of the backdrop than a light one to read as dimmed
      fillOpacity={dark ? 0.4 : 0.12}
    />
  );
}

/** Layers of the drop shadow for a floating surface: offset, blur and opacity */
const shadowLayers = [
  { dy: 3, blur: 1.2, opacity: 0.2 },
  { dy: 2, blur: 2, opacity: 0.14 },
  { dy: 1, blur: 5, opacity: 0.12 },
];

const ShadowContext = createContext<string | undefined>(undefined);

/**
 * Lifts what it holds with a shadow, for surfaces that float above the page.
 * Pass `clip` to stop the shadow spilling outside an area, such as onto the
 * header and status bar that a pane doesn't float over.
 */
export function Elevated({
  clip,
  children,
}: {
  clip?: Rect;
  children: ReactNode;
}) {
  const id = useContext(ShadowContext);
  const clipId = `${useId().replace(/:/g, "")}-clip`;

  return (
    <>
      {clip && (
        <clipPath id={clipId}>
          <rect x={clip.x} y={clip.y} width={clip.w} height={clip.h} />
        </clipPath>
      )}
      <g
        filter={id ? `url(#${id})` : undefined}
        clipPath={clip ? `url(#${clipId})` : undefined}
      >
        {children}
      </g>
    </>
  );
}

/** The drawing surface: a framed, scalable canvas with an accessible name */
export function Canvas({
  title,
  description,
  width,
  height,
  children,
}: {
  title: string;
  description: string;
  width: number;
  height: number;
  children: ReactNode;
}) {
  const { tone, ink } = usePalette();
  // Ids must be unique per diagram, as several share a page
  const id = useId().replace(/:/g, "");
  const titleId = `${id}-title`;
  const descriptionId = `${id}-description`;
  const shadowId = `${id}-shadow`;

  return (
    <svg
      role="img"
      aria-labelledby={`${titleId} ${descriptionId}`}
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      style={{ display: "block", minWidth: 640, height: "auto" }}
    >
      <title id={titleId}>{title}</title>
      <desc id={descriptionId}>{description}</desc>
      <defs>
        <filter
          id={shadowId}
          x="-10%"
          y="-10%"
          width="120%"
          height="125%"
          colorInterpolationFilters="sRGB"
        >
          {shadowLayers.map((layer, i) => (
            <Fragment key={i}>
              <feGaussianBlur
                in="SourceAlpha"
                stdDeviation={layer.blur}
                result={`blur${i}`}
              />
              <feOffset in={`blur${i}`} dy={layer.dy} result={`offset${i}`} />
              <feColorMatrix
                in={`offset${i}`}
                type="matrix"
                values={`0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 ${layer.opacity} 0`}
                result={`shadow${i}`}
              />
            </Fragment>
          ))}
          <feMerge>
            {shadowLayers.map((_, i) => (
              <feMergeNode key={i} in={`shadow${i}`} />
            ))}
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <ShadowContext.Provider value={shadowId}>
        <rect width={width} height={height} style={{ fill: tone.paper }} />
        {children}
        <rect
          x={0.5}
          y={0.5}
          width={width - 1}
          height={height - 1}
          style={{ fill: "none", ...hairline(ink.line) }}
        />
      </ShadowContext.Provider>
    </svg>
  );
}

import { Box, Button, Stack, Typography, useMediaQuery } from "@mui/material";
import { Check, Pause, Play, X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableRow,
  InlineCode,
  ListItem,
  UnorderedList,
} from "./elements";
import { PAGE_LEAD_ATTRIBUTE } from "../app-shell/usePageTitleBar";
import { describeLayout } from "./diagrams/describe";
import type { LayoutConfig } from "./diagrams/layout";
import { LayoutDiagram } from "./diagrams/patterns";
import { resolveLayout, type PatternName } from "./diagrams/presets";
import { readingWidth } from "./layout";

/** Column headings that carry a positive or negative meaning */
const columnTone = {
  Prefer: { Icon: Check, intent: "success" },
  Avoid: { Icon: X, intent: "error" },
} as const;

/** How long the diagram holds each backdrop state, in milliseconds */
const backdropCycleMs = 2000;

/**
 * Alternates a diagram's backdrop on a timer. It starts paused for people who
 * ask for reduced motion, and anyone can pause or resume it.
 */
function useBackdropCycle(enabled: boolean) {
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [backdropOn, setBackdropOn] = useState(true);
  const [paused, setPaused] = useState<boolean | undefined>(undefined);

  // Until the person chooses, follow their motion preference
  const playing = enabled && !(paused ?? reduceMotion);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(
      () => setBackdropOn((on) => !on),
      backdropCycleMs,
    );
    return () => clearInterval(timer);
  }, [playing]);

  return { backdropOn, playing, toggle: () => setPaused(playing) };
}

function toneFor(column: string) {
  return Object.hasOwn(columnTone, column)
    ? columnTone[column as keyof typeof columnTone]
    : undefined;
}

/** A table from column headings and rows of cell content */
export function ReferenceTable({
  columns,
  rows,
  equalColumns = false,
  noWrapColumns = [],
}: {
  columns: string[];
  rows: ReactNode[][];
  /** Indexes of columns to keep on one line, such as names and tokens */
  noWrapColumns?: number[];
  /** Give every column the same width instead of sizing to content */
  equalColumns?: boolean;
}) {
  // Prefer/Avoid tables compare side by side, so divide their columns
  const isComparison = columns.some((column) => toneFor(column));
  const divider = (columnIndex: number) =>
    isComparison && columnIndex > 0
      ? { borderLeft: "1px solid", borderLeftColor: "border.subtle" }
      : {};

  return (
    <DataTable equalColumns={equalColumns}>
      <DataTableHead>
        <DataTableRow>
          {columns.map((column, columnIndex) => {
            const tone = toneFor(column);
            if (!tone) {
              return (
                <DataTableCell
                  key={columnIndex}
                  sx={{
                    ...(noWrapColumns.includes(columnIndex)
                      ? { whiteSpace: "nowrap" }
                      : {}),
                    ...divider(columnIndex),
                  }}
                >
                  {column}
                </DataTableCell>
              );
            }
            const { Icon, intent } = tone;
            return (
              <DataTableCell
                key={columnIndex}
                sx={{
                  backgroundColor: `${intent}.container`,
                  color: `${intent}.onContainer`,
                  ...divider(columnIndex),
                }}
              >
                <Stack direction="row" spacing={1} alignItems="center">
                  <Icon size={16} strokeWidth={2} aria-hidden="true" />
                  <span>{column}</span>
                </Stack>
              </DataTableCell>
            );
          })}
        </DataTableRow>
      </DataTableHead>
      <DataTableBody>
        {rows.map((row, rowIndex) => (
          <DataTableRow key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <DataTableCell
                key={cellIndex}
                sx={{
                  verticalAlign: "top",
                  ...(noWrapColumns.includes(cellIndex)
                    ? { whiteSpace: "nowrap" }
                    : {}),
                  ...divider(cellIndex),
                }}
              >
                {cell}
              </DataTableCell>
            ))}
          </DataTableRow>
        ))}
      </DataTableBody>
    </DataTable>
  );
}

/** Opening paragraph for a page, set larger than body text */
export function Lead({ children }: { children: ReactNode }) {
  return (
    <Typography
      variant="lead"
      component="div"
      color="text.secondary"
      {...{ [PAGE_LEAD_ATTRIBUTE]: "" }}
      sx={{
        mb: 3,
        maxWidth: readingWidth,
        "& > p": {
          m: 0,
          maxWidth: "none",
          font: "inherit",
          letterSpacing: "inherit",
        },
      }}
    >
      {children}
    </Typography>
  );
}

/** A quiet panel for a note that sits beside the main text */
export function Callout({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <Box
      role="note"
      sx={{
        mb: 3,
        px: 2,
        py: 1.5,
        maxWidth: readingWidth,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "border.subtle",
        borderLeft: "4px solid",
        borderLeftColor: "primary.accent",
        backgroundColor: "surface.subtle",
        "& > p": { typography: "body1", mb: 2 },
        "& > :last-child": { mb: 0 },
      }}
    >
      {title && (
        <Typography variant="subtitle2" component="p" sx={{ mb: 0.5 }}>
          {title}
        </Typography>
      )}
      {children}
    </Box>
  );
}

/** Shared look for the small cards used in grids */
const cardSx = {
  display: "flex",
  flexDirection: "column",
  p: 2,
  borderRadius: 1,
  border: "1px solid",
  borderColor: "border.subtle",
  backgroundColor: "surface.subtle",
} as const;

export type TypefaceCardProps = {
  name: string;
  /** CSS font-family value, such as a --ds-font-family-* variable */
  family: string;
  /** One line on what the typeface is for */
  summary: string;
  uses: string[];
  /** Closing guidance, such as when not to use it */
  note: string;
};

/** Typefaces side by side, each name set in its own font */
export function TypefaceCards({ items }: { items: TypefaceCardProps[] }) {
  return (
    <Box
      data-outline="skip"
      sx={{
        mb: 3,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
        gap: 2,
      }}
    >
      {items.map(({ name, family, summary, uses, note }) => (
        <Box key={name} component="section" sx={cardSx}>
          <Typography
            variant="h5"
            component="h3"
            sx={{ fontFamily: family, mb: 1 }}
          >
            {name}
          </Typography>
          <Typography variant="body2" sx={{ mb: 1.5 }}>
            {summary}
          </Typography>
          <Box component="ul" sx={{ m: 0, mb: 2, pl: 2.5, flexGrow: 1 }}>
            {uses.map((use) => (
              <Typography
                key={use}
                component="li"
                variant="body2"
                sx={{ mb: 0.5 }}
              >
                {use}
              </Typography>
            ))}
          </Box>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              pt: 1.5,
              borderTop: "1px solid",
              borderColor: "border.subtle",
            }}
          >
            {note}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

export type PrincipleCardProps = {
  title: string;
  children: ReactNode;
};

/**
 * Short principles as cards, three to a row on wide screens. A last row of two
 * or one cards shares the row equally rather than leaving a gap.
 */
export function PrincipleCards({ items }: { items: PrincipleCardProps[] }) {
  // Columns a card spans, on a grid of six: a full row of three takes two each
  const spanFor = (index: number) => {
    const remaining = items.length - index;
    const lastRow = items.length % 3;
    if (lastRow === 1 && remaining === 1) return 6;
    if (lastRow === 2 && remaining <= 2) return 3;
    return 2;
  };

  return (
    <Box
      data-outline="skip"
      sx={{
        mb: 3,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "repeat(6, 1fr)" },
        gap: 2,
      }}
    >
      {items.map(({ title, children }, index) => {
        return (
          <Box
            key={title}
            component="section"
            sx={{
              ...cardSx,
              gridColumn: { md: `span ${spanFor(index)}` },
            }}
          >
            <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
              {title}
            </Typography>
            <Typography
              variant="body2"
              component="div"
              sx={{ "& > p": { m: 0 } }}
            >
              {children}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}

function Guidance({ kind, items }: { kind: "do" | "dont"; items: string[] }) {
  const isDo = kind === "do";
  const Icon = isDo ? Check : X;
  const intent = isDo ? "success" : "error";

  return (
    <Box
      role="group"
      aria-label={isDo ? "Do" : "Don’t"}
      sx={{
        borderRadius: 1,
        border: "1px solid",
        borderColor: "border.subtle",
        overflow: "hidden",
      }}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{
          px: 2,
          py: 1,
          backgroundColor: `${intent}.container`,
          color: `${intent}.onContainer`,
        }}
      >
        <Icon size={16} strokeWidth={2} aria-hidden="true" />
        <Typography variant="subtitle2" component="p" aria-hidden="true">
          {isDo ? "Do" : "Don’t"}
        </Typography>
      </Stack>
      <Box component="ul" sx={{ m: 0, py: 1.5, pl: 5, pr: 2 }}>
        {items.map((item) => (
          <Typography
            key={item}
            component="li"
            variant="body2"
            sx={{ mb: 0.5 }}
          >
            {item}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

/** Side-by-side lists of what to do and what to avoid */
export function DoDont({ dos, donts }: { dos: string[]; donts: string[] }) {
  return (
    <Box
      sx={{
        mb: 3,
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
        gap: 2,
      }}
    >
      <Guidance kind="do" items={dos} />
      <Guidance kind="dont" items={donts} />
    </Box>
  );
}

/**
 * A small colour chip for use beside a role name in a table.
 * `colour` is a palette path such as "primary.solid" or "surface.strong".
 */
export function Swatch({ colour }: { colour: string }) {
  return (
    <Box
      component="span"
      aria-hidden="true"
      sx={{
        display: "inline-block",
        width: 14,
        height: 14,
        mr: 1,
        verticalAlign: "-2px",
        borderRadius: 0.5,
        border: "1px solid",
        borderColor: "border.emphasis",
        backgroundColor: colour,
      }}
    />
  );
}

export interface TreeNode {
  label: string;
  children?: TreeNode[];
}

const connector = {
  position: "absolute",
  content: '""',
  backgroundColor: "border.emphasis",
} as const;

function Branch({ nodes, depth }: { nodes: TreeNode[]; depth: number }) {
  return (
    <Box component="ul" role="list" sx={{ listStyle: "none", m: 0, p: 0 }}>
      {nodes.map((node, index) => (
        <Box
          component="li"
          key={index}
          sx={{
            position: "relative",
            py: 0.5,
            // Nested items sit in a gutter holding their connector lines
            ...(depth > 0 && {
              pl: 3,
              "&::before": {
                ...connector,
                left: 8,
                top: 0,
                bottom: 0,
                width: "1px",
              },
              "&:last-child::before": { bottom: "auto", height: "1.1em" },
              "&::after": {
                ...connector,
                left: 8,
                top: "1.1em",
                width: 12,
                height: "1px",
              },
            }),
          }}
        >
          <Typography component="span" variant="body1">
            {node.label}
          </Typography>
          {node.children && <Branch nodes={node.children} depth={depth + 1} />}
        </Box>
      ))}
    </Box>
  );
}

/** A read-only tree, such as a sequence of choices or a hierarchy, shown as a nested list with connector lines */
export function TreeList({
  label,
  nodes,
}: {
  label: string;
  nodes: TreeNode[];
}) {
  return (
    <Box
      aria-label={label}
      role="group"
      sx={{
        mb: 3,
        p: 2,
        maxWidth: readingWidth,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "border.subtle",
        backgroundColor: "surface.subtle",
      }}
    >
      <Branch nodes={nodes} depth={0} />
    </Box>
  );
}

/** Text with `code` marked in backticks, as inline code */
function WithCode({ text }: { text: string }) {
  return (
    <>
      {text
        .split("`")
        .map((part, i) =>
          i % 2 === 1 ? <InlineCode key={i}>{part}</InlineCode> : part,
        )}
    </>
  );
}

/**
 * A layout drawn as a skeleton diagram, with a list of its regions and the
 * components to use for each. Name one of the patterns, and change parts of it
 * by passing `layout`. Or pass `layout` and `title` to draw a layout of its own.
 * The list is generated from the same layout as the diagram, so they agree.
 */
export function LayoutFigure({
  pattern,
  layout,
  title,
  description,
}: {
  pattern?: PatternName;
  layout?: LayoutConfig;
  title?: string;
  description?: string;
}) {
  const resolved = resolveLayout(pattern, layout).layout;
  const regions = describeLayout(resolved);
  const cycling =
    resolved.aux?.overlay === true && resolved.aux.cycleBackdrop === true;
  const { backdropOn, playing, toggle } = useBackdropCycle(cycling);

  return (
    <Box component="figure" sx={{ m: 0, mb: 3 }}>
      <Box
        sx={{
          overflowX: "auto",
          borderRadius: 1,
          border: "1px solid",
          borderColor: "border.subtle",
        }}
      >
        <LayoutDiagram
          pattern={pattern}
          layout={layout}
          title={title}
          description={description}
          backdropOn={backdropOn}
        />
      </Box>
      {cycling && (
        <Stack
          direction="row"
          spacing={1.5}
          alignItems="center"
          sx={{ mt: 1.5 }}
        >
          <Button
            size="small"
            variant="outlined"
            onClick={toggle}
            startIcon={
              playing ? (
                <Pause size={16} aria-hidden="true" />
              ) : (
                <Play size={16} aria-hidden="true" />
              )
            }
          >
            {playing ? "Pause animation" : "Play animation"}
          </Button>
          <Typography variant="body2" color="text.secondary">
            {backdropOn ? "With the default backdrop" : "With hideBackdrop"}
          </Typography>
        </Stack>
      )}
      <Typography variant="body1" sx={{ mt: 2, mb: 1 }}>
        Components:
      </Typography>
      <UnorderedList>
        {regions.map((region) => (
          <ListItem key={region.id}>
            <strong>{region.id}</strong> {region.name}:{" "}
            <WithCode text={region.components} />
          </ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
}

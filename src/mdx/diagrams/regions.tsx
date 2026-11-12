import {
  Bar,
  Block,
  Chevron,
  CloseIcon,
  Hint,
  IconBox,
  Line,
  Outlined,
  RegionLabel,
} from "./skeleton";

/**
 * One component per region of the layout patterns. Each takes the rectangle it
 * fills, so a pattern decides where a region goes and the region draws itself.
 * The letters match the Layout patterns tables.
 */

export type Frame = { x: number; y: number; w: number; h: number };

/** A: app identity, optional breadcrumb, and global utilities */
export function GlobalHeader({
  x,
  y,
  w,
  h,
  breadcrumb = false,
}: Frame & { breadcrumb?: boolean }) {
  const base = y + h / 2;

  return (
    <Block x={x} y={y} w={w} h={h} tone="strong" sides={{ bottom: true }}>
      <IconBox x={x + 16} y={base - 5} />
      <RegionLabel x={x + 40} y={base + 4.7}>
        A · Global header
      </RegionLabel>
      {breadcrumb &&
        [0, 1, 2].map((i) => (
          <g key={i}>
            <Bar
              x={x + 158.667 + i * 118.667}
              y={base - 3.333}
              w={93.333}
              h={6.667}
            />
            {i < 2 && (
              <Hint x={x + 262.667 + i * 118.667} y={base + 4}>
                /
              </Hint>
            )}
          </g>
        ))}
      <Hint x={x + w - 170} y={base + 4}>
        Global utilities
      </Hint>
      {[0, 1, 2].map((i) => (
        <IconBox
          key={i}
          x={x + w - 85 + i * 26.667}
          y={base - 7.667}
          size={15.333}
        />
      ))}
    </Block>
  );
}

const navLabelWidths = [72, 58.667, 82.667, 53.333, 66.667];

/** A short list of navigation links, with the third one selected */
function NavItems({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <>
      {navLabelWidths.map((width, i) => {
        const top = y + i * 34.667;
        return (
          <g key={i}>
            {i === 2 && <Block x={x} y={top} w={w} h={29.333} tone="strong" />}
            <IconBox x={x + 8} y={top + 9.667} />
            <Bar x={x + 26.667} y={top + 12} w={width} />
          </g>
        );
      })}
    </>
  );
}

/** B: primary navigation rail, with a persistent block of actions at the foot */
export function PrimaryNav({ x, y, w, h }: Frame) {
  const footTop = y + h - 90;

  return (
    <Block x={x} y={y} w={w} h={h} tone="subtle" sides={{ right: true }}>
      <RegionLabel x={x + 8} y={y + 20.7}>
        B · Primary navigation
      </RegionLabel>
      <NavItems x={x + 8} y={y + 32} w={w - 16} />
      <Block
        x={x + 8}
        y={footTop}
        w={w - 16}
        h={0}
        tone="none"
        sides={{ top: true }}
      />
      <Hint x={x + 8} y={footTop + 21}>
        Persistent actions / Text
      </Hint>
      <Outlined x={x + 8} y={footTop + 32} w={w - 16} h={26} tone="strong" />
      <Bar x={x + 52} y={footTop + 42.333} w={66.667} />
      <Hint x={x + 8} y={footTop + 76.8}>
        Some more text
      </Hint>
    </Block>
  );
}

const groupHeaderHeight = 30.667;
const groupGap = 2.667;

const accordion = [
  { open: true, items: 2 },
  { open: false, items: 0 },
  { open: false, items: 0 },
  { open: false, items: 0 },
];

/** Offset of each accordion group from the first one, and the group's height */
const accordionLayout = accordion.reduce<{ offset: number; height: number }[]>(
  (layout, group) => {
    const previous = layout[layout.length - 1];
    const offset = previous ? previous.offset + previous.height + groupGap : 0;
    return [
      ...layout,
      { offset, height: groupHeaderHeight + group.items * 20 },
    ];
  },
  [],
);

/** How the items of a context panel are shown */
export type ContextKind = "accordion" | "cards" | "links";

const cardCount = 6;
const cardHeight = 44.667;
const cardPitch = 48;

/** The search field and filters that top a panel of items to choose from */
function PanelControls({ x, y, w }: { x: number; y: number; w: number }) {
  const filterWidth = (w - 6) / 2;

  return (
    <>
      <Outlined x={x} y={y + 28.333} w={w} h={26} />
      <Hint x={x + 8} y={y + 45.333}>
        Search / filter
      </Hint>
      {[0, 1].map((i) => (
        <g key={i}>
          <Outlined
            x={x + i * (filterWidth + 6)}
            y={y + 63}
            w={filterWidth}
            h={23.333}
            tone="subtle"
          />
          <Bar
            x={x + 7.667 + i * (filterWidth + 6)}
            y={y + 72.667}
            w={42.667}
            h={4}
          />
        </g>
      ))}
    </>
  );
}

/**
 * C, or E2 when it sits inside the workspace: a panel of items that set what
 * the workspace shows. It lists links, cards to choose from, or accordion groups.
 */
export function ContextPanel({
  x,
  y,
  w,
  h,
  kind = "accordion",
  label = "C · Context panel",
}: Frame & { kind?: ContextKind; label?: string }) {
  const inner = x + 8;
  const innerWidth = w - 16;
  const accordionTop = y + 97.333;

  return (
    <Block x={x} y={y} w={w} h={h} tone="paper" sides={{ right: true }}>
      <RegionLabel x={x + 10.667} y={y + 18.7}>
        {label}
      </RegionLabel>

      {kind === "links" && (
        <>
          <Hint x={x + 10.667} y={y + 40}>
            Secondary navigation
          </Hint>
          <NavItems x={inner} y={y + 52} w={innerWidth} />
        </>
      )}

      {kind !== "links" && <PanelControls x={inner} y={y} w={innerWidth} />}

      {kind === "cards" && (
        <>
          <Hint x={x + 10.667} y={y + 112}>
            Item list
          </Hint>
          {Array.from({ length: cardCount }, (_, i) => {
            const top = y + 121.667 + i * cardPitch;
            const left = x + 5.667;
            const width = w - 11.333;
            return (
              <g key={i}>
                <Block
                  x={left}
                  y={top}
                  w={width}
                  h={cardHeight}
                  tone={i === 0 ? "strong" : "subtle"}
                />
                <Outlined
                  x={left}
                  y={top}
                  w={width}
                  h={cardHeight}
                  tone="none"
                  stroke="line"
                />
                <IconBox x={left + 6.667} y={top + 6.667} size={8.667} />
                <Bar x={left + 23.667} y={top + 8.333} w={100} />
                <Bar x={left + 6.333} y={top + 22.333} w={60} h={4} />
                <Bar x={left + width - 42.333} y={top + 22.333} w={36} h={4} />
              </g>
            );
          })}
        </>
      )}

      {kind === "accordion" &&
        accordion.map((group, i) => {
          const { height, offset } = accordionLayout[i];
          const groupTop = accordionTop + offset;

          return (
            <g key={i}>
              <Block
                x={inner}
                y={groupTop}
                w={innerWidth}
                h={height}
                tone="subtle"
              >
                <Chevron
                  x={inner + 13.333}
                  y={groupTop + 16.667}
                  open={group.open}
                />
                <IconBox x={inner + 23} y={groupTop + 11} size={8.667} />
                <Bar x={inner + 40} y={groupTop + 12.667} w={100} />
                {Array.from({ length: group.items }, (_, item) => {
                  const itemTop = groupTop + groupHeaderHeight + item * 20;
                  return (
                    <g key={item}>
                      <Block
                        x={inner}
                        y={itemTop}
                        w={innerWidth}
                        h={20}
                        tone={item === 0 ? "strong" : "none"}
                        sides={{ bottom: true }}
                      />
                      <IconBox
                        x={inner + 40.333}
                        y={itemTop + 5.667}
                        size={8.667}
                      />
                      <Bar x={inner + 57.333} y={itemTop + 7.333} w={100} />
                    </g>
                  );
                })}
                <Block
                  x={inner}
                  y={groupTop + groupHeaderHeight}
                  w={innerWidth}
                  h={0}
                  tone="none"
                  sides={{ top: true }}
                />
              </Block>
              <Outlined
                x={inner}
                y={groupTop}
                w={innerWidth}
                h={height}
                tone="none"
                stroke="line"
              />
            </g>
          );
        })}
    </Block>
  );
}

const tabGap = 5.333;

const tabs = [
  { w: 96, label: 64, active: true },
  { w: 88, label: 56, active: false },
  { w: 80, label: 48, active: false },
].reduce<{ w: number; label: number; active: boolean; offset: number }[]>(
  (list, tab) => {
    const previous = list[list.length - 1];
    const offset = previous ? previous.offset + previous.w + tabGap : 0;
    return [...list, { ...tab, offset }];
  },
  [],
);

/** D: tabs that switch between workspaces */
export function WorkspaceSelector({ x, y, w, h }: Frame) {
  return (
    <Block x={x} y={y} w={w} h={h} tone="canvas" sides={{ bottom: true }}>
      <RegionLabel x={x + 4} y={y + 16.7}>
        D · Workspace selector
      </RegionLabel>
      {tabs.map((tab, i) => {
        const tabLeft = x + 4 + tab.offset;
        return (
          <g key={i}>
            <Block
              x={tabLeft}
              y={y + 24}
              w={tab.w}
              h={24}
              tone={tab.active ? "paper" : "subtle"}
            />
            <IconBox x={tabLeft + 8.333} y={y + 31} />
            <Bar x={tabLeft + 24} y={y + 33.333} w={tab.label} />
          </g>
        );
      })}
    </Block>
  );
}

/** E3: local tools and view controls above the workspace content */
export function WorkspaceToolbar({ x, y, w, h }: Frame) {
  return (
    <Block x={x} y={y} w={w} h={h} tone="subtle" sides={{ bottom: true }}>
      <RegionLabel x={x + 8} y={y + 19.4}>
        E3 · Workspace toolbar
      </RegionLabel>
      {[0, 1, 2].map((i) => (
        <IconBox
          key={i}
          x={x + 162.333 + i * 26.667}
          y={y + 4.333}
          size={20.667}
        />
      ))}
    </Block>
  );
}

const tableColumns = [32, 180, 130, 130];
const tableRowHeight = 29.333;
const tableRows = 10;
const rowBarBase = [96, 60, 80, 64];
const rowBarFactors = [1, 0.75, 1.1, 0.6, 0.9];

/**
 * A data table: a header row, a checkbox column, rows of placeholder cells with
 * the first row selected, and a pagination footer.
 */
export function DataTable({ x, y, w }: Omit<Frame, "h">) {
  const columnLeft = tableColumns.reduce<number[]>(
    (lefts, width) => [...lefts, lefts[lefts.length - 1] + width],
    [0],
  );
  const dividers = columnLeft.slice(1);
  const bodyTop = y + tableRowHeight;
  const footerTop = bodyTop + tableRows * tableRowHeight;

  return (
    <g>
      <Block
        x={x}
        y={y}
        w={w}
        h={tableRowHeight}
        tone="subtle"
        sides={{ bottom: true }}
      >
        <IconBox x={x + 11} y={y + 9.667} />
        {[80, 60, 50, 64].map((width, c) => (
          <Bar key={c} x={x + columnLeft[c + 1] + 8} y={y + 12} w={width} />
        ))}
      </Block>
      {Array.from({ length: tableRows }, (_, r) => {
        const top = bodyTop + r * tableRowHeight;
        return (
          <Block
            key={r}
            x={x}
            y={top}
            w={w}
            h={tableRowHeight}
            tone={r === 0 ? "strong" : "paper"}
            sides={{ bottom: true }}
          >
            <IconBox x={x + 11} y={top + 9.667} />
            {rowBarBase.map((base, c) => (
              <Bar
                key={c}
                x={x + columnLeft[c + 1] + 8}
                y={top + 12}
                w={Math.round(base * rowBarFactors[(r * 2 + c) % 5])}
                light
              />
            ))}
          </Block>
        );
      })}
      {dividers.map((left) => (
        <Line key={left} x1={x + left} x2={x + left} y1={y} y2={footerTop} />
      ))}
      <Block x={x} y={footerTop} w={w} h={tableRowHeight} tone="subtle">
        <Hint x={x + 8.5} y={footerTop + 18.7}>
          1–10 of 48
        </Hint>
        <Outlined x={x + w - 56} y={footerTop + 7} w={21} h={15.333} />
        <Outlined x={x + w - 29} y={footerTop + 7} w={21} h={15.333} />
      </Block>
    </g>
  );
}

/** How the workspace content is shown */
export type ContentKind = "viewport" | "table";

/** E, or E1: the workspace content, as a viewport or as a data table */
export function WorkspaceContent({
  x,
  y,
  w,
  h,
  kind = "viewport",
  label = "E · Primary workspace",
}: Frame & { kind?: ContentKind; label?: string }) {
  const inset = 6.5;

  if (kind === "table") {
    return (
      <Block x={x} y={y} w={w} h={h} tone="canvas">
        <RegionLabel x={x + 16} y={y + 31.3} size={16}>
          {label}
        </RegionLabel>
        <Hint x={x + 16} y={y + 60.6} size={14}>
          Content viewport
        </Hint>
        <DataTable x={x + 16} y={y + 76} w={w - 32} />
      </Block>
    );
  }

  const centre = x + w / 2;
  const middle = y + h / 2;

  return (
    <Block x={x} y={y} w={w} h={h} tone="canvas">
      <Block
        x={x + inset}
        y={y + inset}
        w={w - inset * 2}
        h={h - inset * 2}
        tone="paper"
      />
      <Outlined
        x={x + inset}
        y={y + inset}
        w={w - inset * 2}
        h={h - inset * 2}
        tone="none"
        stroke="line"
      />
      <RegionLabel x={centre} y={middle + 5} size={16} anchor="middle">
        {label}
      </RegionLabel>
      <Hint x={centre} y={middle + 34} size={14} anchor="middle">
        Content viewport
      </Hint>
    </Block>
  );
}

/** Fractions of the pane width for the placeholder rows of a single column */
const bodyRowFractions = [0.75, 0.89, 0.66, 0.82, 0.59, 0.89, 0.71, 0.8];
const columnRows = [
  [220, 260, 193.333, 240],
  [173.333, 260, 206.667, 233.333],
];
const columnGap = 370.667;

/** What a pane carries besides its toolbar and body */
export type PaneParts = {
  /** A close control in the toolbar */
  close?: boolean;
  /** A line of local status above the actions */
  status?: boolean;
  /** A bar of local actions along the foot */
  actions?: boolean;
  /** One column of body content, or two for a wide pane */
  columns?: 1 | 2;
};

/**
 * A pane for supporting content, with a toolbar and a body, and optionally
 * status and actions. The auxiliary pane (F) and the modal pane (H) are both
 * drawn with it.
 */
export function Pane({
  x,
  y,
  w,
  h,
  label,
  close = false,
  status = false,
  actions = false,
  columns = 1,
}: Frame & { label: string } & PaneParts) {
  const toolbarHeight = 28;
  const statusHeight = 18.667;
  const actionsHeight = 28;
  const actionsTop = y + h - (actions ? actionsHeight : 0);
  const statusTop = actionsTop - (status ? statusHeight : 0);
  const toolRight = close ? 77 : 45;

  return (
    <Block x={x} y={y} w={w} h={h} tone="paper" sides={{ left: true }}>
      <Block
        x={x}
        y={y}
        w={w}
        h={toolbarHeight}
        tone="strong"
        sides={{ bottom: true }}
      >
        <RegionLabel x={x + 10.667} y={y + 18.7}>
          {label}
        </RegionLabel>
        <IconBox x={x + w - toolRight} y={y + 8.333} size={11.333} />
        <IconBox x={x + w - toolRight + 22.667} y={y + 8.333} size={11.333} />
        {close && <CloseIcon x={x + w - 21.333} y={y + 14} />}
      </Block>
      <Hint x={x + 16} y={y + 54.5}>
        Secondary content
      </Hint>
      {columns === 1 &&
        bodyRowFractions.map((fraction, i) => (
          <Bar
            key={i}
            x={x + 12.346}
            y={y + 71.333 + i * 17.333}
            w={Math.round((w - 24) * fraction)}
            light
          />
        ))}
      {columns === 2 &&
        columnRows.map((widths, column) =>
          widths.map((width, i) => (
            <Bar
              key={`${column}-${i}`}
              x={x + 16 + column * columnGap}
              y={y + 73 + i * 17.333}
              w={width}
              light
            />
          )),
        )}
      {status && (
        <Block
          x={x}
          y={statusTop}
          w={w}
          h={statusHeight}
          tone="subtle"
          sides={{ top: true }}
        >
          <Hint x={x + 10.667} y={statusTop + 13.3}>
            Local status
          </Hint>
        </Block>
      )}
      {actions && (
        <Block
          x={x}
          y={actionsTop}
          w={w}
          h={actionsHeight}
          tone="strong"
          sides={{ top: true }}
        >
          <Hint x={x + 10.667} y={actionsTop + 18}>
            Local actions
          </Hint>
          <Outlined x={x + w - 101} y={actionsTop + 6.333} w={42} h={15.333} />
          <Outlined x={x + w - 53} y={actionsTop + 6.333} w={42} h={15.333} />
        </Block>
      )}
    </Block>
  );
}

/** F: an auxiliary pane, beside or below the workspace */
export function AuxiliaryPane(props: Frame & PaneParts) {
  return <Pane label="F · Auxiliary pane" {...props} />;
}

/** H: a pane laid over existing content, for a form or other content */
export function ModalPane(props: Frame & PaneParts) {
  return <Pane label="H · Modal pane" {...props} />;
}

function StatusBar({
  x,
  y,
  w,
  h,
  label,
  tone,
}: Frame & { label: string; tone: "subtle" | "strong" }) {
  return (
    <Block x={x} y={y} w={w} h={h} tone={tone} sides={{ top: true }}>
      <RegionLabel x={x + 10.667} y={y + 19.2}>
        {label}
      </RegionLabel>
      <Bar x={x + w - 144} y={y + 12.5} w={80} h={4} light />
      <Bar x={x + w - 53.333} y={y + 12.5} w={42.667} h={4} light />
    </Block>
  );
}

/** E4: status for the active workspace only */
export function WorkspaceStatus(frame: Frame) {
  return <StatusBar {...frame} tone="subtle" label="E4 · Workspace status" />;
}

/** G: app-wide status */
export function GlobalStatus(frame: Frame) {
  return <StatusBar {...frame} tone="strong" label="G · Global status" />;
}

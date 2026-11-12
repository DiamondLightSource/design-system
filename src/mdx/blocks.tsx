import { Box, Stack, Typography } from "@mui/material";
import { Check, X } from "lucide-react";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import type { ReactNode } from "react";
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableRow,
} from "./elements";
import { readingWidth } from "./layout";

/** A table from column headings and rows of cell content */
export function ReferenceTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: ReactNode[][];
}) {
  return (
    <DataTable>
      <DataTableHead>
        <DataTableRow>
          {columns.map((column) => (
            <DataTableCell key={column}>{column}</DataTableCell>
          ))}
        </DataTableRow>
      </DataTableHead>
      <DataTableBody>
        {rows.map((row, rowIndex) => (
          <DataTableRow key={rowIndex}>
            {row.map((cell, index) => (
              <DataTableCell key={columns[index]}>{cell}</DataTableCell>
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

function Guidance({
  kind,
  items,
}: {
  kind: "do" | "dont";
  items: string[];
}) {
  const isDo = kind === "do";
  const Icon = isDo ? Check : X;
  const intent = isDo ? "success" : "error";

  return (
    <Box
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
        <Typography variant="subtitle2" component="h3">
          {isDo ? "Do" : "Don’t"}
        </Typography>
      </Stack>
      <Box component="ul" sx={{ m: 0, py: 1.5, pl: 5, pr: 2 }}>
        {items.map((item) => (
          <Typography key={item} component="li" variant="body2" sx={{ mb: 0.5 }}>
            {item}
          </Typography>
        ))}
      </Box>
    </Box>
  );
}

/** Side-by-side lists of what to do and what to avoid */
export function DoDont({
  dos,
  donts,
}: {
  dos: string[];
  donts: string[];
}) {
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

interface TreeItemData {
  id: string;
  label: string;
  children?: TreeItemData[];
}

export interface TreeNode {
  label: string;
  children?: TreeNode[];
}

function toTreeItems(
  nodes: TreeNode[],
  parentId = "",
  expandable: string[] = [],
): { items: TreeItemData[]; expandable: string[] } {
  const items = nodes.map((node, index): TreeItemData => {
    const id = parentId ? `${parentId}-${index}` : `${index}`;
    if (!node.children?.length) return { id, label: node.label };

    expandable.push(id);
    return {
      id,
      label: node.label,
      children: toTreeItems(node.children, id, expandable).items,
    };
  });
  return { items, expandable };
}

/** A read-only tree, fully expanded, for showing a sequence of choices */
export function DecisionTree({
  label,
  nodes,
}: {
  label: string;
  nodes: TreeNode[];
}) {
  const { items, expandable } = toTreeItems(nodes);

  return (
    <Box
      sx={{
        mb: 3,
        p: 1.5,
        maxWidth: readingWidth,
        borderRadius: 1,
        border: "1px solid",
        borderColor: "border.subtle",
        backgroundColor: "surface.subtle",
      }}
    >
      <RichTreeView
        aria-label={label}
        items={items}
        defaultExpandedItems={expandable}
        disableSelection
        itemChildrenIndentation={24}
      />
    </Box>
  );
}

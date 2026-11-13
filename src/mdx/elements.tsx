import {
  Box,
  Link as MuiLink,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useId, type ComponentProps, type ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

import { useSectionNavToggle } from "../app-shell/sectionNavState";
import { ShowSectionNavButton } from "../app-shell/sectionNavToggle";
import { useTitleBarSlot } from "../app-shell/titleBarSlot";
import { PAGE_TITLE_ATTRIBUTE } from "../app-shell/usePageTitleBar";
import { readingWidth } from "./layout";

type Children = { children?: ReactNode };

export const H1 = ({ children }: Children) => {
  const sectionNavHidden = useSectionNavToggle() !== null;
  // The title bar has its own button once it is showing; two would be read out
  const { shown: titleBarShown } = useTitleBarSlot();
  const textId = useId();

  return (
    <Typography
      variant="h2Display"
      component="h1"
      sx={{
        mb: 2,
        ...(sectionNavHidden && {
          display: "flex",
          alignItems: "center",
          gap: 1,
        }),
      }}
      // The button is inside the heading, so name the heading by its text alone
      aria-labelledby={sectionNavHidden ? textId : undefined}
      {...{ [PAGE_TITLE_ATTRIBUTE]: "" }}
    >
      {sectionNavHidden ? (
        <>
          <ShowSectionNavButton concealed={titleBarShown} />
          <span id={textId}>{children}</span>
        </>
      ) : (
        children
      )}
    </Typography>
  );
};

export const H2 = ({ children }: Children) => (
  <Typography variant="h4" component="h2" sx={{ mt: 5, mb: 1.5 }}>
    {children}
  </Typography>
);

export const H3 = ({ children }: Children) => (
  <Typography variant="h5" component="h3" sx={{ mt: 3.5, mb: 1 }}>
    {children}
  </Typography>
);

export const H4 = ({ children }: Children) => (
  <Typography variant="h6" component="h4" sx={{ mt: 3, mb: 1 }}>
    {children}
  </Typography>
);

export const UnorderedList = ({ children }: Children) => (
  <Box component="ul" sx={{ mt: 0, mb: 2, pl: 3, maxWidth: readingWidth }}>
    {children}
  </Box>
);

export const OrderedList = ({ children }: Children) => (
  <Box component="ol" sx={{ mt: 0, mb: 2, pl: 3, maxWidth: readingWidth }}>
    {children}
  </Box>
);

export const ListItem = ({ children }: Children) => (
  <Typography component="li" variant="body1" sx={{ mb: 0.5 }}>
    {children}
  </Typography>
);

export const Emphasis = ({ children }: Children) => (
  <Box component="em" sx={{ fontStyle: "italic" }}>
    {children}
  </Box>
);

export const Rule = () => (
  <Box
    component="hr"
    sx={{
      my: 4,
      border: 0,
      borderTop: "1px solid",
      borderColor: "border.subtle",
    }}
  />
);

export const InlineCode = ({ children }: Children) => (
  <Typography
    component="code"
    variant="mono2"
    sx={{
      px: 0.5,
      py: 0.25,
      borderRadius: 0.5,
      backgroundColor: "surface.subtle",
      color: "text.primary",
      overflowWrap: "anywhere",
    }}
  >
    {children}
  </Typography>
);

export const CodeBlock = ({ children }: Children) => (
  <Box
    component="pre"
    tabIndex={0}
    sx={{
      m: 0,
      mb: 2,
      p: 2,
      overflow: "auto",
      borderRadius: 1,
      border: "1px solid",
      borderColor: "border.subtle",
      backgroundColor: "surface.subtle",
      "& > code": {
        p: 0,
        backgroundColor: "transparent",
        whiteSpace: "pre",
      },
    }}
  >
    {children}
  </Box>
);

export const DataTable = ({
  children,
  equalColumns = false,
}: Children & { equalColumns?: boolean }) => (
  <TableContainer
    sx={{
      mb: 3,
      border: "1px solid",
      borderColor: "border.subtle",
      borderRadius: 1,
    }}
  >
    <Table
      size="small"
      sx={equalColumns ? { tableLayout: "fixed" } : undefined}
    >
      {children}
    </Table>
  </TableContainer>
);

export const DataTableHead = TableHead;
export const DataTableBody = TableBody;
export const DataTableRow = TableRow;

export const DataTableCell = ({
  children,
  ...props
}: ComponentProps<typeof TableCell>) => (
  <TableCell sx={{ verticalAlign: "top" }} {...props}>
    {children}
  </TableCell>
);

export const MdxLink = ({
  href = "",
  children,
}: { href?: string } & Children) => {
  // A web address, or "//host/path", points to another site
  if (/^(https?:)?\/\//i.test(href)) {
    return (
      <MuiLink href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </MuiLink>
    );
  }

  // Anchors and other schemes, such as mailto: and tel:, stay as they are
  if (/^(#|[a-z][a-z0-9+.-]*:)/i.test(href)) {
    return <MuiLink href={href}>{children}</MuiLink>;
  }

  return (
    <MuiLink component={RouterLink} to={href}>
      {children}
    </MuiLink>
  );
};

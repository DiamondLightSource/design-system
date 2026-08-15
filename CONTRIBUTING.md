# Contributing pages

This describes how pages and sections in the website are structured — for guidance on writing the
content itself, see `PROJECT_GUIDELINES.md`.

## Adding a page to an existing section

Drop a new `.mdx` file into that section's folder under `src/pages/` (e.g. `src/pages/Foundations/`).
No changes to `router.tsx` are needed — the page is discovered automatically and added as a tab.

By default, a page's title is derived from its filename by splitting PascalCase into words
(`ApplicationStructure.mdx` becomes "Application Structure"), and pages sort alphabetically by
filename — except a file named exactly `Overview.mdx`, which always sorts first.

To override the title, sort order, or URL, export a `meta` object from the top of the file:

```mdx
export const meta = { name: "Actual Page Name", order: 2, path: "actual-page" };

# Actual Page Name
```

- `name` — the tab label and page title. Overrides the humanised filename.
- `order` — forces the page's sort position among its siblings (lower sorts first; ties break
  alphabetically by name). Use this when the default filename-based order isn't right — for
  example, to move a page without renaming its file.
- `path` — the URL segment for the page. Overrides the default, which is derived from `name`.

All three are optional and independent — set only the ones you need.

## Adding a new section

Add one entry to the `sections` array in `src/router.tsx`: a `name`, an `icon` (from
`lucide-react`), and a `folder` naming the corresponding `src/pages/<folder>` directory. Then add
its pages as described above.

A section can also be a single page with no tabs — point `folder` at a file
(`src/pages/<folder>.mdx`) instead of a directory.

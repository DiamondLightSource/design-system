import { useMatches } from "react-router-dom";
import type { PageHandle } from "./Router";

/** The name of the section the page being read belongs to, if it has one */
export function useSectionName() {
  return useMatches()
    .map((match) => (match.handle as PageHandle | undefined)?.section)
    .find((section) => section !== undefined);
}

import { createContext, useContext } from "react";

/**
 * What a page's outline is called. Inside a tab it lists that tab's sections,
 * not the whole page's, so the tab's panel changes it.
 */
export const OutlineLabelContext = createContext("On this page");

export function useOutlineLabel() {
  return useContext(OutlineLabelContext);
}

import { createContext, useContext } from "react";

/**
 * The right-hand end of the page title bar, where the page can place a control
 * of its own. Empty until the bar has been drawn, and on pages without one.
 */
export const TitleBarSlotContext = createContext<HTMLElement | null>(null);

export function useTitleBarSlot() {
  return useContext(TitleBarSlotContext);
}

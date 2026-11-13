import { createContext, useContext, useState } from "react";

const COLLAPSED_KEY = "section_nav_collapsed";

/** Marks the buttons that bring the section navigation back, so focus can be sent to one */
export const SHOW_SECTION_NAV_ATTRIBUTE = "data-show-section-nav";

export function usePersistentSectionNavCollapsed() {
  const [collapsed, setCollapsedState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(COLLAPSED_KEY) === "true";
    } catch {
      return false;
    }
  });

  const setCollapsed = (value: boolean) => {
    try {
      localStorage.setItem(COLLAPSED_KEY, String(value));
    } catch {
      // The choice then lasts only until the page is reloaded
    }
    setCollapsedState(value);
  };

  return { collapsed, setCollapsed };
}

export interface SectionNavToggle {
  show: () => void;
}

/**
 * Set only while the section navigation is hidden on a screen wide enough to
 * show it beside the content: then the page's heading and title bar offer the
 * button that brings it back.
 */
export const SectionNavToggleContext = createContext<SectionNavToggle | null>(
  null,
);

export function useSectionNavToggle() {
  return useContext(SectionNavToggleContext);
}

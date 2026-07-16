import {
  Home as HomeIcon,
  Palette,
  Shapes,
  Blocks,
  ShieldCheck,
  Rocket,
} from "lucide-react";
import { createRouter, type SectionGroup } from "./app-shell";

const navigation: SectionGroup[] = [
  {
    sections: [
      { name: "Home", icon: <HomeIcon />, path: "Home", folder: "Home" },
      { name: "Getting Started", icon: <Rocket />, folder: "GettingStarted" },
      { name: "Foundations", icon: <Palette />, folder: "Foundations" },
      { name: "Components", icon: <Shapes />, folder: "Components" },
      { name: "Patterns", icon: <Blocks />, folder: "Patterns" },
      { name: "Standards", icon: <ShieldCheck />, folder: "Standards" },
    ],
  },
];

export const router = createRouter({
  title: "Diamond Design System",
  navigation,
});

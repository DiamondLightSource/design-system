import {
  Home as HomeIcon,
  Palette,
  Shapes,
  Blocks,
  ShieldCheck,
  Rocket,
} from "lucide-react";
import { createRouter, type SectionGroup } from "./app-shell";

import Home from "./pages/Home.mdx";

import Introduction from "./pages/GettingStarted/Introduction.mdx";
import More from "./pages/GettingStarted/More.mdx";

import Foundations from "./pages/Foundations/Overview.mdx";
import Colours from "./pages/Foundations/Colours.mdx";
import Typography from "./pages/Foundations/Typography.mdx";

import Components from "./pages/Components/Overview.mdx";
import Inputs from "./pages/Components/Inputs.mdx";
import Navigation from "./pages/Components/Navigation.mdx";

import Patterns from "./pages/Patterns/Overview.mdx";
import ApplicationStructure from "./pages/Patterns/ApplicationStructure.mdx";
import NavigationP from "./pages/Patterns/Navigation.mdx";

import Standards from "./pages/Standards/Overview.mdx";
import Accessibility from "./pages/Standards/Accessibility.mdx";
import InteractionStandards from "./pages/Standards/InteractionStandards.mdx";

import MdxWrapper from "./Wrapper";

const navigation: SectionGroup[] = [
  {
    sections: [
      {
        name: "Home",
        icon: <HomeIcon />,
        path: "Home",
        element: <MdxWrapper component={Home} />,
      },
      {
        name: "Getting Started",
        icon: <Rocket />,
        path: "GettingStarted",
        pages: [
          {
            name: "Introduction",
            element: <MdxWrapper component={Introduction} />,
          },
          {
            name: "Yes!",
            element: <MdxWrapper component={More} />,
          },
        ],
      },
      {
        name: "Foundations",
        icon: <Palette />,
        pages: [
          {
            name: "Overview",
            element: <MdxWrapper component={Foundations} />,
          },
          {
            name: "Colours",
            element: <MdxWrapper component={Colours} />,
          },
          {
            name: "Typography",
            element: <MdxWrapper component={Typography} />,
          },
        ],
      },
      {
        name: "Components",
        icon: <Shapes />,
        pages: [
          {
            name: "Overview",
            element: <MdxWrapper component={Components} />,
          },
          {
            name: "Inputs",
            element: <MdxWrapper component={Inputs} />,
          },
          {
            name: "Navigation",
            element: <MdxWrapper component={Navigation} />,
          },
        ],
      },
      {
        name: "Patterns",
        icon: <Blocks />,
        pages: [
          {
            name: "Overview",
            element: <MdxWrapper component={Patterns} />,
          },
          {
            name: "Application Structure",
            element: <MdxWrapper component={ApplicationStructure} />,
          },
          {
            name: "Navigation",
            element: <MdxWrapper component={NavigationP} />,
          },
        ],
      },
      {
        name: "Standards",
        icon: <ShieldCheck />,
        pages: [
          {
            name: "Overview",
            element: <MdxWrapper component={Standards} />,
          },
          {
            name: "Accessibility",
            element: <MdxWrapper component={Accessibility} />,
          },
          {
            name: "Interaction Standards",
            element: <MdxWrapper component={InteractionStandards} />,
          },
        ],
      },
    ],
  },
];

export const router = createRouter({
  title: "Diamond Design System",
  navigation,
});

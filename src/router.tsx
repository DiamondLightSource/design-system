import { LucideHome, LucidePalette, LucideWorm } from "lucide-react";
import { createRouter, type SectionGroup } from "./app-shell";
import Home from "./pages/Home.mdx";
import Design from "./pages/Introduction/Design.mdx";
import More from "./pages/Introduction/More.mdx";
import Colours from "./pages/Foundations/Colours.mdx";
import Typography from "./pages/Foundations/Typography.mdx";
import MdxWrapper from "./Wrapper";

const navigation: SectionGroup[] = [
  {
    sections: [
      {
        name: "Home",
        icon: <LucideHome />,
        path: "Home",
        element: <MdxWrapper component={Home} />,
      },
      {
        name: "Introduction",
        icon: <LucideWorm />,
        path: "introduction",
        pages: [
          {
            name: "Design",
            element: <MdxWrapper component={Design} />,
          },
          {
            name: "Yes!",
            element: <MdxWrapper component={More} />,
          },
        ],
      },
      {
        name: "Foundations",
        icon: <LucidePalette />,
        pages: [
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
    ],
  },
];

export const router = createRouter({
  title: "Diamond Design System",
  navigation,
});

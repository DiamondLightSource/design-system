import { lazy, Suspense, type ComponentType } from "react";
import { LucidePalette, LucideWorm } from "lucide-react";
import { createRouter, type SectionGroup } from "./app-shell";
import MdxWrapper from "./Wrapper";

const loadMdxPage = (loader: () => Promise<{ default: ComponentType }>) => {
  const Component = lazy(loader);

  return function MdxPage() {
    return (
      <Suspense fallback={null}>
        <Component />
      </Suspense>
    );
  };
};

const Design = loadMdxPage(() => import("./pages/Introduction/Design.mdx"));
const More = loadMdxPage(() => import("./pages/Introduction/More.mdx"));
const Colours = loadMdxPage(() => import("./pages/Foundations/Colours.mdx"));
const Typography = loadMdxPage(() => import("./pages/Foundations/Typography.mdx"));

const navigation: SectionGroup[] = [
  {
    sections: [
      {
        name: "Introduction",
        icon: <LucideWorm />,
        path: "introduction",
        pages: [
          {
            name: "Design",
            element: <MdxWrapper component={Design} />
          },
          {
            name: "Yes!",
            element: <MdxWrapper component={More} />
          }
        ]
      },
      {
        name: "Foundations",
        icon: <LucidePalette />,
        pages: [
          {
            name: "Colours",
            element: <MdxWrapper component={Colours} />
          },
          {
            name: "Typography",
            element: <MdxWrapper component={Typography} />
          },
        ]
      }
    ]
  }
]

export const router = createRouter({ title: "Diamond Design System", navigation});
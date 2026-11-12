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
import PracticalGuide from "./pages/GettingStarted/PracticalGuide.mdx";
import Outline from "./pages/GettingStarted/Outline.mdx";

import Foundations from "./pages/Foundations/Overview.mdx";
import FoundationsOutline from "./pages/Foundations/Outline.mdx";
import ColoursIntro from "./pages/Foundations/ColoursIntro.mdx";
import Colours from "./pages/Foundations/Colours.mdx";
import ColoursSurfaces from "./pages/Foundations/ColoursSurfaces.mdx";
import ColoursInPractice from "./pages/Foundations/ColoursInPractice.mdx";
import ColoursTokens from "./pages/Foundations/ColoursTokens.mdx";
import ThemeColours from "./pages/Foundations/ThemeColours.mdx";
import TypographyIntro from "./pages/Foundations/TypographyIntro.mdx";
import Typography from "./pages/Foundations/Typography.mdx";
import TypographyScales from "./pages/Foundations/TypographyScales.mdx";
import TypographyInPractice from "./pages/Foundations/TypographyInPractice.mdx";
import TypographySpecimens from "./pages/Foundations/TypographySpecimens.mdx";
import ElevationIntro from "./pages/Foundations/ElevationIntro.mdx";
import Elevation from "./pages/Foundations/Elevation.mdx";
import ElevationExamples from "./pages/Foundations/ElevationExamples.mdx";
import Borders from "./pages/Foundations/Borders.mdx";
import Icons from "./pages/Foundations/Icons.mdx";

import Components from "./pages/Components/Overview.mdx";
import ComponentsOutline from "./pages/Components/Outline.mdx";
import Inputs from "./pages/Components/Inputs.mdx";
import Navigation from "./pages/Components/Navigation.mdx";
import FeedbackIntro from "./pages/Components/FeedbackIntro.mdx";
import Feedback from "./pages/Components/Feedback.mdx";
import FeedbackErrors from "./pages/Components/FeedbackErrors.mdx";

import Patterns from "./pages/Patterns/Overview.mdx";
import PatternsOutline from "./pages/Patterns/Outline.mdx";
import ApplicationStructure from "./pages/Patterns/ApplicationStructure.mdx";
import NavigationP from "./pages/Patterns/Navigation.mdx";

import Standards from "./pages/Standards/Overview.mdx";
import StandardsOutline from "./pages/Standards/Outline.mdx";
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
        element: <MdxWrapper component={Home} prose={false} />,
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
            name: "Practical guide",
            element: <MdxWrapper component={PracticalGuide} />,
          },
          {
            name: "Outline plan",
            element: <MdxWrapper component={Outline} />,
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
            header: <MdxWrapper component={ColoursIntro} />,
            tabs: [
              {
                name: "Guidance",
                element: <MdxWrapper component={Colours} />,
              },
              {
                name: "Surfaces and states",
                element: <MdxWrapper component={ColoursSurfaces} />,
              },
              {
                name: "In practice",
                element: <MdxWrapper component={ColoursInPractice} />,
              },
              {
                name: "Tokens",
                element: <MdxWrapper component={ColoursTokens} />,
              },
              {
                name: "Theme colours",
                element: <MdxWrapper component={ThemeColours} />,
              },
            ],
          },
          {
            name: "Typography",
            header: <MdxWrapper component={TypographyIntro} />,
            tabs: [
              {
                name: "Guidance",
                element: <MdxWrapper component={Typography} />,
              },
              {
                name: "In practice",
                element: <MdxWrapper component={TypographyInPractice} />,
              },
              {
                name: "Scales",
                element: <MdxWrapper component={TypographyScales} />,
              },
              {
                name: "Specimens",
                element: <MdxWrapper component={TypographySpecimens} />,
              },
            ],
          },
          {
            name: "Elevation",
            header: <MdxWrapper component={ElevationIntro} />,
            tabs: [
              {
                name: "Guidance",
                element: <MdxWrapper component={Elevation} />,
              },
              {
                name: "Examples",
                element: <MdxWrapper component={ElevationExamples} />,
              },
            ],
          },
          {
            name: "Borders",
            element: <MdxWrapper component={Borders} />,
          },
          {
            name: "Icons",
            element: <MdxWrapper component={Icons} />,
          },
          {
            name: "Outline plan",
            element: <MdxWrapper component={FoundationsOutline} />,
          },
        ],
      },
      {
        name: "Components",
        icon: <Shapes />,
        pages: [
          {
            name: "Overview",
            soon: true,
            element: <MdxWrapper component={Components} />,
          },
          {
            name: "Inputs",
            soon: true,
            element: <MdxWrapper component={Inputs} />,
          },
          {
            name: "Navigation",
            soon: true,
            element: <MdxWrapper component={Navigation} />,
          },
          {
            name: "Feedback",
            header: <MdxWrapper component={FeedbackIntro} />,
            tabs: [
              {
                name: "Feedback and status",
                element: <MdxWrapper component={Feedback} />,
              },
              {
                name: "Errors and recovery",
                element: <MdxWrapper component={FeedbackErrors} />,
              },
            ],
          },
          {
            name: "Outline plan",
            element: <MdxWrapper component={ComponentsOutline} />,
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
            soon: true,
            element: <MdxWrapper component={NavigationP} />,
          },
          {
            name: "Outline plan",
            element: <MdxWrapper component={PatternsOutline} />,
          },
        ],
      },
      {
        name: "Standards",
        icon: <ShieldCheck />,
        pages: [
          {
            name: "Overview",
            soon: true,
            element: <MdxWrapper component={Standards} />,
          },
          {
            name: "Accessibility",
            soon: true,
            element: <MdxWrapper component={Accessibility} />,
          },
          {
            name: "Interaction Standards",
            soon: true,
            element: <MdxWrapper component={InteractionStandards} />,
          },
          {
            name: "Outline plan",
            element: <MdxWrapper component={StandardsOutline} />,
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

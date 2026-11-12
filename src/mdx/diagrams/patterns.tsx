import { describeLayout, summariseLayout } from "./describe";
import { grid } from "./grid";
import { Layout, type LayoutConfig } from "./layout";
import { resolveLayout, type PatternName } from "./presets";
import { Canvas } from "./skeleton";

/**
 * A layout drawn as a skeleton diagram. Name one of the patterns, and change
 * parts of it by passing `layout`. Or pass `layout` and `title` on their own to
 * draw a layout that isn't one of the patterns. The description for screen
 * readers is generated from the layout unless you pass one.
 */
export function LayoutDiagram({
  pattern,
  layout,
  title,
  description,
}: {
  pattern?: PatternName;
  layout?: LayoutConfig;
  title?: string;
  description?: string;
}) {
  const resolved = resolveLayout(pattern, layout);

  return (
    <Canvas
      title={title ?? resolved.title ?? "Layout"}
      description={
        description ?? summariseLayout(describeLayout(resolved.layout))
      }
      width={grid.width}
      height={grid.height}
    >
      <Layout {...resolved.layout} />
    </Canvas>
  );
}

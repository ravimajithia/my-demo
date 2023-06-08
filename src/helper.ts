import * as WebglApi from "@novorender/webgl-api";
import * as DataJsApi from "@novorender/data-js-api";
import { HierarcicalObjectReference } from "@novorender/webgl-api";

export const dataApi = DataJsApi.createAPI({
  serviceUrl: process.env.SERVICE_URL,
});

export const api = WebglApi.createAPI();

/**
 * Execute render loop.
 * @param view {WebglApi.View} view.
 * @param canvas {HTMLCanvasElement} canvas.
 */
export async function run(view: WebglApi.View, canvas: HTMLCanvasElement): Promise<void> {
  // Handle canvas resizes
  new ResizeObserver((entries) => {
    for (const entry of entries) {
      canvas.width = entry.contentRect.width;
      canvas.height = entry.contentRect.height;
      view.applySettings({
        display: { width: canvas.clientWidth, height: canvas.clientHeight },
      });
    }
  }).observe(canvas);

  // Create a bitmap context to display render output
  const ctx = canvas.getContext("bitmaprenderer");

  // render loop
  while (true) {
    // Render frame
    const output = await view.render();
    {
      // Finalize output image
      const image = await output.getImage();
      if (image) {
        // Display the given ImageBitmap in the canvas associated with this rendering context.
        ctx?.transferFromImageBitmap(image);
        // release bitmap data
        image.close();
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (output as any).dispose();
  }
}

/**
 * Iterate through list of objects.
 * @param param0 {iterator, count, abortSignal} iterator, count, abortSignal.
 * @returns {T[]} list of objects.
 */
export async function iterateAsync<T = HierarcicalObjectReference>({
  iterator,
  count,
  abortSignal,
}: {
  iterator: AsyncIterableIterator<T>;
  count: number;
  abortSignal?: AbortSignal;
}): Promise<[T[], boolean]> {
  let values: T[] = [];
  let done = false;

  for (let i = 0; i < count; i++) {
      if (abortSignal?.aborted) {
          break;
      }

      const next = await iterator.next();

      if (next.done) {
          done = true;
          break;
      }

      values = [...values, next.value];
  }

  return [values, done];
}

/**
 * Isolate objects.
 * @param scene {WebglApi.Scene} scene.
 * @param nodes {HierarcicalObjectReference[]} list of nodes found during search.
 */
export function isolateObjects(scene: WebglApi.Scene, nodes: HierarcicalObjectReference[]): void {
  scene.objectHighlighter.objectHighlightIndices.fill(255);
  nodes.forEach((node) => (scene.objectHighlighter.objectHighlightIndices[node.id] = 0));
  scene.objectHighlighter.commit();
}

/**
 * Show all objects.
 * @param view {WebglApi.View} view.
 * @param scene {WebglApi.Scene} scene.
 * @param api {WebglApi.API} api.
 */
export function showAllObjects(view: WebglApi.View, scene: WebglApi.Scene, api: WebglApi.API): void {
  view.settings.objectHighlights = [
    api.createHighlight({ kind: "neutral" })
  ];
  scene.objectHighlighter.objectHighlightIndices.fill(0);
  scene.objectHighlighter.commit();
}
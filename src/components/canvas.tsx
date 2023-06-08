/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, RefCallback, useCallback, useState } from 'react';
import './canvas.scss';
import { run, dataApi, api } from "../helper";
import { View, Scene } from "@novorender/webgl-api";
import Button from './button';
import Search from './search';

export default function Canvas() {

  const [canvas, setCanvas] = useState<HTMLCanvasElement | null>(null);
  const [view, setView] = useState<View | null>(null);
  const [scene, setScene] = useState<Scene | null>(null);
  const [error, setError] = useState('');
  const canvasRef: RefCallback<HTMLCanvasElement> = useCallback((node) => {
    if (node !== null) {
      setCanvas(node);
    }
  }, []);

  useEffect(() => {
    initView();
    async function initView() {

      try {
        const sceneData = await dataApi
          // Condos scene ID, but can be changed to any public scene ID
          .loadScene(`${process.env.SCENE_ID}`)
          .then((res) => {
            if ("error" in res) {
              throw res;
            } else {
              return res;
            }
          });

        // Destructure relevant properties into variables
        const { url, db, settings, camera: cameraParams } = sceneData;

        // Load scene
        const scene = await api.loadScene(url, db);

        // The code above is all you need to load the scene,
        // however there is more scene data loaded that you can apply

        // Create a view with the scene's saved settings
        const view = await api.createView(settings, canvas!);

        // Set resolution scale to 1
        view.applySettings({ quality: { resolution: { value: 1 } } });

        // Create a camera controller with the saved parameters with turntable as fallback
        // available controller types are static, orbit, flight and turntable
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const camera = cameraParams ?? ({ kind: "flight" } as any);
        view.camera.controller = api.createCameraController(camera, canvas!);

        // Assign the scene to the view
        view.scene = scene;
        setView(view);
        setScene(scene);
        // Run render loop and the resizeObserver
        run(view, canvas!);
      } catch (e) {
        console.error(e);
        setError('Something went wrong. Please contact support.');
      }
    }
  }, [canvas]);

  return (
    <>
      <div className='button-container'>
        { view  && (
          <>
            <Button sceneView={view}/>
            <Button sceneView={view}/>
            <Button sceneView={view}/>
            { view && scene && api && <Search view={view} scene={scene} /> }
          </>)  }
      </div>
      { error && <div className='error'>{error}</div> }
      <canvas ref={canvasRef} height="100vh" width="100vw" tabIndex={-1}></canvas>
    </>
  );
}
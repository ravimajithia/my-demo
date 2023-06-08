import React, { useState } from "react";
import { vec3, vec4 } from "gl-matrix";
import type { Camera} from "@novorender/webgl-api";
import { View } from "@novorender/webgl-api";

export default function Button({ sceneView }: { sceneView: View }) {
  // Position type
  type CameraPosition = Pick<Camera, "position" | "rotation">;
  type ClickHandler = (e: React.MouseEvent) => void;

  // retrieve relvant camera position from sceneView
  const sceneViewPosition = {
    position: vec3.clone(sceneView.camera.position),
    rotation: vec4.clone(sceneView.camera.rotation)
  }
  // create state to save camera position of custom object
  const [currentPosition, setCurrentPosition] =
    useState<CameraPosition>(sceneViewPosition);
  const [flag, setFlag] = useState(false);

  const handleClick: ClickHandler = (e) => {
    if (e.shiftKey) {
      // set current camera position
      setCurrentPosition({
        position: vec3.clone(sceneView.camera.position),
        rotation: vec4.clone(sceneView.camera.rotation),
      });
      setFlag(true);
      return;
    }

    // Redirect to previous position
    flag && sceneView.camera.controller.moveTo(
      currentPosition.position,
      currentPosition.rotation
    );
  }

  return (
    <button className='position' onClick={handleClick}>
      Record Position
    </button>
  );
}
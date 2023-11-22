import { useEffect, useRef, useState } from "react";
import FollowMouse from "./FollowMouse";

function AnimationCanvas({
  dimensions: { width, height },
  draw,
  updateOnAnimation,
}: {
  dimensions: { width: number; height: number };
  draw: DrawFunction;
  updateOnAnimation: UpdateOnAnimationFunction;
}) {
  const canvasRef = useRef(null);
  const [menuItems, setMenuItems] = useState([
    { label: "erase", function: () => console.log("erase") },
    { label: "color", function: () => console.log("color") },
    { label: "fill", function: () => console.log("fill") },
    { label: "air", function: () => console.log("air") },
  ])

  useEffect(() => {
    const canvas: HTMLCanvasElement | any = canvasRef.current;
    const context: CanvasRenderingContext2D = canvas.getContext("2d");

    setMenuItems(items => {
      const newItems = [...items];
      newItems[0].function = () => {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
      newItems[1].function = () => {
        context.strokeStyle = "red";
        console.log("set stroke style");
      }
      return newItems;
    })
  }, [])

  useEffect(() => {
    const canvas: HTMLCanvasElement | any = canvasRef.current;
    const context: CanvasRenderingContext2D = canvas.getContext("2d");

    let frameCount: number = 0;
    let animationFrameId: number;

    const render = () => {
      draw(context, canvas.width, canvas.height, frameCount);
      updateOnAnimation(frameCount);
      frameCount++;
      animationFrameId = window.requestAnimationFrame(render);
    };

    context.clearRect(0, 0, canvas.width, canvas.height);
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);
  
  return (
    <>
      <FollowMouse menuLabelsAndFunctions={menuItems} />
      <canvas ref={canvasRef} width={width} height={height} />
    </>
  );
}

export default AnimationCanvas;

type UpdateOnAnimationFunction = (frameCount: number) => void;

type DrawFunction = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frameCount: number
) => void;

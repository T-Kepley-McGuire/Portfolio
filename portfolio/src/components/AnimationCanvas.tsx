import { useEffect, useRef } from "react";

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

  return <canvas ref={canvasRef} width={width} height={height} />;
}

export default AnimationCanvas;

type UpdateOnAnimationFunction = (frameCount: number) => void;

type DrawFunction = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frameCount: number
) => void;

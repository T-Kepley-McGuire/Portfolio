import { useEffect, useReducer, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AnimationCanvas, { UpdateOnAnimationFunction } from "../AnimationCanvas";

export default function CanvasCard() {
  const [hovering, setHovering] = useState(false);
  const none = { x: 0, y: 0 };
  const init: { x: number; y: number }[] = [];
  for (let i = 0; i < 50; i++) {
    init.push(none);
  }
  const mousePos = useRef([...init]);
  const currentPos = useRef({ ...none });
  const update: UpdateOnAnimationFunction = (frameCount: number) => {
    mousePos.current = [
      ...mousePos.current.filter((_, i: number) => i > 0),
      currentPos.current,
    ];
  };

  const returnDraw = (hoveringStatus: boolean) => {
    return (ctx: CanvasRenderingContext2D) => {
      if (hoveringStatus) {
        console.log(hoveringStatus)
        ctx.lineWidth = 2;
        ctx.beginPath();
        mousePos.current.forEach(({ x, y }) => ctx.lineTo(x, y));
        ctx.stroke();
      }
    };
  };
  return (
    <div key="canvas" className="page-card">
      <Link
        onMouseOver={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={`page-card-content `}
        to={`/canvas`}
      >
        <h3>canvas</h3>
        <AnimationCanvas
          dimensions={{ width: 200, height: 200 }}
          draw={returnDraw(hovering)}
          updateOnAnimation={update}
        />
      </Link>
    </div>
  );
}

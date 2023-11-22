import { resourceUsage } from "process";
import React, { useEffect, useRef, useState } from "react";

import "../css/canvas.css";
import AnimationCanvas from "../components/AnimationCanvas";
import FollowMouse from "../components/FollowMouse";

function Canvas() {
  const none = { x: 0, y: 0 };
  const init: { x: number; y: number }[] = [];
  for (let i = 0; i < 50; i++) {
    init.push(none);
  }
  const initKeys: { [index: string]: boolean } = {};
  const initStyle: { [index: string]: string } = {};
  const mousePos = useRef([...init]);
  const currentPos = useRef({ ...none });
  const mouseDown = useRef(false);


  const menuRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      currentPos.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseDown = (event: MouseEvent) => {
      mouseDown.current = true;
    };
    const handleMouseUp = (event: MouseEvent) => {
      mouseDown.current = false;
    };

    

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  
  const draw = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    //ctx.clearRect(0, 0, width, height);
    ctx.lineWidth = 1;
    //ctx.filter = "opacity(50%)";

    if (mouseDown.current) {
      ctx.beginPath();
      ctx.moveTo(mousePos.current[0].x, mousePos.current[0].y);
      ctx.quadraticCurveTo(
        mousePos.current[Math.floor(mousePos.current.length / 2)].x,
        mousePos.current[Math.floor(mousePos.current.length / 2)].y,
        mousePos.current[mousePos.current.length - 1].x,
        mousePos.current[mousePos.current.length - 1].y
      );
      ctx.stroke();
    }
  };

  // const draw = (
  //   ctx: CanvasRenderingContext2D,
  //   width: number,
  //   height: number
  // ) => {
  //   const imageData = ctx.createImageData(width, height);

  //   const color = { r: 0, g: 150, b: 150 };
  //   const factor = 2;

  //   const colorPixel = (
  //     x: number,
  //     y: number,
  //     r: number,
  //     g: number,
  //     b: number
  //   ) => {
  //     const index = 4 * (x + y * imageData.width);
  //     imageData.data[index + 0] = r;
  //     imageData.data[index + 1] = g;
  //     imageData.data[index + 2] = b;
  //     imageData.data[index + 3] = 255;
  //   };

  //   const circle = (
  //     x: number,
  //     y: number,
  //     radius: number,
  //     { r, g, b }: { r: number; g: number; b: number }
  //   ) => {
  //     for (let ox = -radius; ox <= radius; ox++) {
  //       for (let oy = -radius; oy <= radius; oy++) {
  //         if (ox * ox + oy * oy <= radius) {
  //           colorPixel(x + ox, y + oy, r, g, b);
  //         }
  //       }
  //     }
  //   };

  //   for (let i = 0; i < imageData.width; i += 12) {
  //     for (let j = 0; j < imageData.height; j += 12) {
  //       let maxSize = -1;
  //       for (let m = 0; m < mousePos.current.length; m++) {
  //         const distSquare =
  //           (i - mousePos.current[m].x) * (i - mousePos.current[m].x) +
  //           (j - mousePos.current[m].y) * (j - mousePos.current[m].y);
  //         const size = Math.max(
  //           //0.5*m - 0.01 * m *  distSquare,
  //           15 * factor * (1 - m / mousePos.current.length) -
  //             Math.sqrt(0.04 * factor * distSquare),
  //           0
  //         );
  //         if (maxSize < size) maxSize = size;
  //       }

  //       circle(i, j, Math.floor(maxSize), color);
  //     }
  //   }

  //   ctx.putImageData(imageData, 0, 0);
  // };

  const update = () => {
    mousePos.current = [
      ...mousePos.current.filter((_, i: number) => i > 0),
      currentPos.current,
    ];

    //console.log(menuRef.current);
  };

  const menuItems = [
    { label: "erase", function: () => console.log("erase") },
    { label: "color", function: () => console.log("color") },
    { label: "fill", function: () => console.log("fill") },
    { label: "air", function: () => console.log("air") },
  ];

  return (
    <main>
      {/* <FollowMouse menuLabelsAndFunctions={menuItems}/> */}
      <AnimationCanvas
        dimensions={{ width: window.innerWidth, height: window.innerHeight }}
        draw={draw}
        updateOnAnimation={update}
      />
    </main>
  );
}

export default Canvas;

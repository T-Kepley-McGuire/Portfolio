import { useEffect, useState } from "react";

interface FollowMouseProperties {
  style?: {
    [key: string]: any;
  };
  keyPressFunctionalities?: {
    [key: string]: Function;
  };
}

export default function FollowMouse(props: FollowMouseProperties) {
  const { keyPressFunctionalities = {}, style = {} } = props;
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const [staticCursorPosition, setStaticCursorPosition] = useState({
    top: 0,
    left: 0,
  });

  const [keysDown, setKeysDown] = useState<{ [index: string]: boolean }>({});

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ top: e.clientY, left: e.clientX });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      setKeysDown((keys) => {
        if (keys[e.key] === true) return keys;
        const newKeys = { ...keys };
        newKeys[e.key] = true;
        return newKeys;
      });
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysDown((keys) => {
        const newKeys = { ...keys };
        newKeys[e.key] = false;
        return newKeys;
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const menuItems = ["erase", "color", "hat", "doge", "fill"];

  useEffect(() => {
    Object.keys(keyPressFunctionalities).forEach((key) => {
      if (keysDown[key]) keyPressFunctionalities[key]();
    });
    if (keysDown["Shift"]) {
      setStaticCursorPosition({ ...cursorPosition });
    }
  }, [keysDown]);

  return (
    <div
      className="mouse-menu-container"
      style={
        keysDown["Shift"]
          ? { ...staticCursorPosition, opacity: "1" }
          : { ...cursorPosition, opacity: "0" }
      }
    >
      {/* <div
        className="circle"
        style={keysDown["Shift"] ? { opacity: "0.5" } : {}}
      /> */}

      {menuItems.map((item, index) => {
        const r: number = 50;
        const t: number = Math.PI * (-0.5 + 2 * (index / menuItems.length));
        const x: number = r * Math.cos(t);
        const y: number = r * Math.sin(t);

        const mouseAngle = Math.atan2(
          cursorPosition.top - staticCursorPosition.top,
          cursorPosition.left - staticCursorPosition.left
        );
        const lowerBound =
          Math.PI * (-0.5 + (2 * (index - 0.5)) / menuItems.length);
        const upperBound =
          Math.PI * (-0.5 + (2 * (index + 0.5)) / menuItems.length);

        return (
          <div
            key={index}
            className={`mouse-menu-item ${
              (mouseAngle >= lowerBound && mouseAngle < upperBound) ||
              (mouseAngle + 2 * Math.PI >= lowerBound &&
                mouseAngle + 2 * Math.PI < upperBound)
                ? "highlight"
                : ""
            }`}
            style={{
              top: y,
              left: x,
            }}
          >
            <p>{item}</p>
          </div>
        );
      })}
    </div>
  );
}

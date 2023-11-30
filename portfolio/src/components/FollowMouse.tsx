import { useEffect, useState } from "react";

interface FollowMouseProperties {
  style?: {
    [key: string]: any;
  };
  keyPressFunctionalities?: {
    [key: string]: Function;
  };
  menuLabelsAndFunctions?: Array<{ label: string; function: Function }>;
}

export default function FollowMouse(props: FollowMouseProperties) {
  const {
    // keyPressFunctionalities = {},
    // style = {},
    menuLabelsAndFunctions = [],
  } = props;
  const [cursorPosition, setCursorPosition] = useState({ top: 0, left: 0 });
  const [staticCursorPosition, setStaticCursorPosition] = useState({
    top: 0,
    left: 0,
  });

  const [keysDown, setKeysDown] = useState<{ [index: string]: boolean }>({});
  const [displayMenu, setDisplayMenu] = useState<boolean>(false);

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

  // const menuLabelsAndFunctions = [
  //   { label: "erase", function: () => console.log("erase") },
  //   { label: "color", function: () => console.log("color") },
  //   { label: "fill", function: () => console.log("fill") },
  //   { label: "air", function: () => console.log("air") },
  // ];

  useEffect(() => {
    if (!displayMenu && keysDown["Shift"]) {
      setDisplayMenu(true);
      //setStaticCursorPosition({ ...cursorPosition });
    }

    if (displayMenu && !keysDown["Shift"]) {
      setDisplayMenu(false);
    }
  }, [keysDown]);

  useEffect(() => {
    if (displayMenu) {
      setStaticCursorPosition({ ...cursorPosition });
    } else if (menuLabelsAndFunctions.length > 0) {
      const mouseAngle = Math.atan2(
        cursorPosition.top - staticCursorPosition.top,
        cursorPosition.left - staticCursorPosition.left
      );
      const mouseDist = Math.sqrt(
        (cursorPosition.top - staticCursorPosition.top) ** 2 +
          (cursorPosition.left - staticCursorPosition.left) ** 2
      );

      if (mouseDist > 60) {
        const angles = menuLabelsAndFunctions.map((val, i) => {
          const a = Math.PI * (-0.5 + 2 * (i / menuLabelsAndFunctions.length));
          const diffAngle = Math.abs(a - mouseAngle);

          return Math.min(diffAngle, Math.abs(diffAngle - 2 * Math.PI));
        });

        const selectedIndex = angles.reduce((prevIndex, val, currIndex) => {
          if (val < angles[prevIndex]) return currIndex;
          return prevIndex;
        }, 0);

        
        menuLabelsAndFunctions[selectedIndex].function();
      }
    }
  }, [displayMenu]);

  return (
    <div
      className="mouse-menu-container"
      style={
        displayMenu
          ? { ...staticCursorPosition, opacity: "1" }
          : { ...cursorPosition, opacity: "0" }
      }
    >
      {menuLabelsAndFunctions.map((item, index) => {
        const a = (Math.PI * (1 - 2 / menuLabelsAndFunctions.length)) / 2;
        const r: number = 60 / Math.cos(a);
        const t: number =
          Math.PI * (-0.5 + 2 * (index / menuLabelsAndFunctions.length));
        const x: number = r * Math.cos(t);
        const y: number = r * Math.sin(t);

        const mouseAngle = Math.atan2(
          cursorPosition.top - staticCursorPosition.top,
          cursorPosition.left - staticCursorPosition.left
        );
        const mouseDist = Math.sqrt(
          (cursorPosition.top - staticCursorPosition.top) ** 2 +
            (cursorPosition.left - staticCursorPosition.left) ** 2
        );
        const lowerBound =
          Math.PI *
          (-0.5 + (2 * (index - 0.5)) / menuLabelsAndFunctions.length);
        const upperBound =
          Math.PI *
          (-0.5 + (2 * (index + 0.5)) / menuLabelsAndFunctions.length);

        return (
          <div
            key={index}
            className={`mouse-menu-item ${
              ((mouseAngle >= lowerBound && mouseAngle < upperBound) ||
                (mouseAngle + 2 * Math.PI >= lowerBound &&
                  mouseAngle + 2 * Math.PI < upperBound)) &&
              mouseDist > 60
                ? "highlight"
                : ""
            }`}
            style={{
              transition: displayMenu
                ? `top 0.5s ease ${0.03 * index}s, left 0.5s ease ${
                    0.03 * index
                  }s`
                : "all 0s 0s",
              top: displayMenu ? y : 0,
              left: displayMenu ? x : 0,
            }}
          >
            <p>{item.label}</p>
          </div>
        );
      })}
    </div>
  );
}

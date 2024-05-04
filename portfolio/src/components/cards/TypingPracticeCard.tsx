import { useState } from "react";
import { Link } from "react-router-dom";

import "../../css/typing-practice.css"

export default function TypingPracticeCard() {

  const [hovering, setHovering] = useState(false);

  return (
    <div key="typing-practice" className="page-card">
      <Link
        onMouseOver={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={`page-card-content `}
        to={`/typing-practice`}
      >
        <h3>typing practice</h3>
        <img className="placeholder-img" src="placeholder.png" ></img>
        {/* {[0,1,2,3,4].map((image, index) => {
          return (
            <img
              key={image}
              className="animation-image"
              src="mandelbrot-zoom-part.png"
              alt="typing animation"
              style={{
                animationPlayState: hovering ? "running" : "paused",
                animationDelay: `${-index * 0.815}s`,
              }}
            ></img>
          );
        })} */}
      </Link>
    </div>
  );
}

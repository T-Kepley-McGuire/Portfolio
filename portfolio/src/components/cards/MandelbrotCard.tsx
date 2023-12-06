import { useState } from "react";
import { Link } from "react-router-dom";

export default function MandelbrotCard() {

  const [hovering, setHovering] = useState(false);

  return (
    <div key="mandelbrot" className="page-card">
      <Link
        onMouseOver={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        className={`page-card-content `}
        to={`/mandelbrot`}
      >
        <h3>mandelbrot</h3>
        {[0,1,2,3,4].map((image, index) => {
          return (
            <img
              key={image}
              className="animation-image"
              src="mandelbrot-zoom-part.png"
              alt="mandelbrot set"
              style={{
                animationPlayState: hovering ? "running" : "paused",
                animationDelay: `${-index * 0.815}s`,
              }}
            ></img>
          );
        })}
      </Link>
    </div>
  );
}

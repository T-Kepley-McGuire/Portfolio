import { Link, useLocation } from "react-router-dom";

import "../css/home.css";
import { useState } from "react";

function Home(): JSX.Element {
  const location = useLocation();

  const cardList = [
    {
      link: "nothing",
      option: "mandelbrot",
      icon: "home",
    },
    {
      link: "",
      option: "home",
      icon: "home",
    },
    {
      link: "about",
      option: "about",
      icon: "person",
    },
    {
      link: "projects",
      option: "projects",
      icon: "terminal",
    },
    {
      link: "blog",
      option: "blog",
      icon: "article",
    },
    {
      link: "wordguesser",
      option: "words",
      icon: "spellcheck",
    },
    {
      link: "canvas",
      option: "canvas",
      icon: "lightbulb",
    },
  ];
  const mandelbrotImages = [0, 1, 2, 3, 4];

  return (
    <main>
      <div className="title">
        <div>
          <h1>T. Kepley McGuire</h1>
          <p>I'm a web developer and rendering enthusiast</p>
          <p>Check out my work here</p>
        </div>
      </div>
      <div className="content">
        <div className="page-card-container">
          {cardList.map((card) => {
            if (card.option === "mandelbrot") {
              return (
                <div key={card.option} className="page-card">
                  <Link
                    className={`page-card-content ${
                      location.pathname === `/${card.link}`
                        ? "active"
                        : undefined
                    }`}
                    to={`/${card.link}`}
                  >
                    <h3>{card.option}</h3>
                    <img
                      className="static-image"
                      src="mandelbrot-render.png"
                      alt="mandelbrot set"
                    ></img>
                    {mandelbrotImages.map((image, index) => {
                      return (
                        <img
                          key={image}
                          className="animation-image"
                          src="mandelbrot-zoom-part.png"
                          alt="mandelbrot set"
                          style={{ animationDelay: `${-index * 0.815}s` }}
                        ></img>
                      );
                    })}
                  </Link>
                </div>
              );
            } else
              return (
                <div key={card.option} className="page-card">
                  <Link
                    className={`page-card-content ${
                      location.pathname === `/${card.link}`
                        ? "active"
                        : undefined
                    }`}
                    to={`/${card.link}`}
                  >
                    <h3>{card.option}</h3>
                  </Link>
                </div>
              );
          })}
        </div>

        <h3>Who I am</h3>
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="Frame 1">
            <g id="dark">
              <path
                id="second"
                d="M47 58.2679C48.3333 59.0377 48.3333 60.9623 47 61.7321L15.5 79.9186C14.1667 80.6884 12.5 79.7261 12.5 78.1865V41.8135C12.5 40.2739 14.1667 39.3116 15.5 40.0814L47 58.2679Z"
              />
            </g>
            <g id="light">
              <path
                id="first"
                d="M47 58.268C48.3333 59.0378 48.3333 60.9623 47 61.7321L15.5 79.9186C14.1667 80.6884 12.5 79.7262 12.5 78.1866V41.8135C12.5 40.2739 14.1667 39.3116 15.5 40.0814L47 58.268Z"
              />
              <path
                id="third"
                d="M66 58.2679C67.3333 59.0377 67.3333 60.9623 66 61.7321L34.5 79.9186C33.1667 80.6884 31.5 79.7261 31.5 78.1865V41.8135C31.5 40.2739 33.1667 39.3116 34.5 40.0814L66 58.2679Z"
              />
            </g>
          </g>
        </svg>
        <p>
          When I discovered coding, I knew I had found a passion. As a former
          math enthusiast, coding was an extension of math that I could realize
          onto a computer screen. Although my introduction to coding was through
          a class at Eastern Washington University, I quickly converted it into
          my new favorite hobby. It wasn't long before I was investigating
          algorithms for calculating the prime numbers and the fibbinocci
          sequence.
        </p>
        <p>
          Eventually, I found the game engine Unity. My love for games combined
          with my love of coding and I started making games. Undaunted by the
          mountain of learning ahead of me, I dove right in. I prototyped and
          scrapped tens of projects. During this time, I began experimenting
          with neural networks as well. I pushed my abilities as far as they
          would go and farther.
        </p>
        <p>
          In 2023, I felt the need to expand my hobby to a professional
          enviroment. My time teaching myself to code would be indespensible for
          picking up the new domain of Web Development. I enrolled in an online
          coding academy: Thinkful. Through my time at Thinkful, I picked up all
          the professional skills one would need to succeed in the job place.
          Full stack development through React.js and Express.js prepared me for
          the professional standard of web app engineering
        </p>
      </div>
    </main>
  );
}

export default Home;

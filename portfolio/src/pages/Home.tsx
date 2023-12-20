import { Link, useLocation } from "react-router-dom";

import "../css/home.css";
import { useState } from "react";
import MandelbrotCard from "../components/cards/MandelbrotCard";
import WordsCard from "../components/cards/WordsCard";

function Home(): JSX.Element {
  const location = useLocation();

  const [hovering, setHovering] = useState(false);

  const cardList = [
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
          <MandelbrotCard />
          <WordsCard />
          {/* {cardList.map((card) => {
            return (
              <div key={card.option} className="page-card">
                <Link
                  className={`page-card-content ${
                    location.pathname === `/${card.link}` ? "active" : undefined
                  }`}
                  to={`/${card.link}`}
                >
                  <h3>{card.option}</h3>
                </Link>
              </div>
            );
          })} */}
        </div>

        <h3>Who I am</h3>
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
// function MandelbrotCard(card: { link: string; option: string; icon: string; }, setHovering, location, mandelbrotImages: number[], hovering: boolean) {
//   return <div key={card.option} className="page-card">
//     <Link
//       onMouseOver={() => setHovering(true)}
//       onMouseLeave={() => setHovering(false)}
//       className={`page-card-content ${location.pathname === `/${card.link}`
//           ? "active"
//           : undefined}`}
//       to={`/${card.link}`}
//     >
//       <h3>{card.option}</h3>
//       {mandelbrotImages.map((image, index) => {
//         return (
//           <img
//             key={image}
//             className="animation-image"
//             src="mandelbrot-zoom-part.png"
//             alt="mandelbrot set"
//             style={{
//               animationPlayState: hovering ? "running" : "paused",
//               animationDelay: `${-index * 0.815}s`,
//             }}
//           ></img>
//         );
//       })}
//     </Link>
//   </div>;
// }

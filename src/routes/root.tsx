import { Link, Outlet } from "react-router-dom";

export default function Root(): JSX.Element {
  return (
    <>
      <div className="bg"></div>
      <div className="app">
        <header>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/blog">Blog</Link>
        </header>
        <Outlet />
        <footer>
          <div className="contact-info">
            <a href="https://www.linkedin.com/in/t-kepley-mcguire/">LinkedIn</a>
            <a href="https://github.com/T-Kepley-McGuire">Github</a>
          </div>
        </footer>
      </div>
    </>
  );
}

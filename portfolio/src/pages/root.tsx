import React, { MouseEvent, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import "../css/root.css";

export default function Root(): JSX.Element {
  const menuItems = [
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
      link: "login",
      option: "login",
      icon: "login",
    },
    {
      link: "settings",
      option: "settings",
      icon: "settings",
    },
  ];

  const animationSpeed = 0.05

  const menuItemStyles = menuItems.map((option, index: number): object => {
    return {
      transition: `transform ${0.2 + index * animationSpeed}s ease-in ${
        0.3 + index * animationSpeed
      }s, opacity ${0 + 0 * index * animationSpeed}s ease-in ${0 + 0 * index * animationSpeed}s`,
    };
  });

  const menuItemStylesExpanded = menuItems.map(
    (option, index: number): object => {
      return {
        zIndex: `${menuItems.length - index}`,
        transform: `translateY(${25 + index * 40}px)`,
        transition: `transform ${0.2 + index * animationSpeed}s ease-in ${
          index * animationSpeed
        }s, opacity ${0.2 + index * animationSpeed}s ease-in ${index * animationSpeed}s`,
      };
    }
  );

  const [isActive, setIsActive] = useState(false);

  function menuHover(e: MouseEvent): void {
    e.preventDefault();
    setIsActive(true);
  }

  function menuOff(e: MouseEvent): void {
    e.preventDefault();
    setIsActive(false);
  }

  const location = useLocation();
  return (
    <>
      <div className="bg"></div>
      <div className="app">
        <header>
          <div className="menu-button-container" onMouseLeave={menuOff}>
              <div className={`menu-back-2 ${isActive ? "expanded" : undefined}`} />
              <div className="menu-label" onMouseOver={menuHover}>Menu</div>
              <div
                className={`${isActive ? "expanded" : undefined} menu-button`}
                onMouseOver={menuHover}
              />
            {/* <div className={`menu-back ${isActive ? "expanded" : undefined}`} /> */}
            <ul>
              {menuItems.map((option, index: number): JSX.Element => {
                return (
                  <li
                    style={
                      isActive
                        ? menuItemStylesExpanded[index]
                        : menuItemStyles[index]
                    }
                    key={option.option}
                    className={`${isActive ? "expanded" : undefined}`}
                  >
                    <Link
                      className={`menu-link ${
                        location.pathname === `/${option.link}`
                          ? "active"
                          : undefined
                      }`}
                      to={`/${option.link}`}
                    >
                      <i className="material-icons">{option.icon}</i>
                      <p
                        style={
                          isActive
                            ? {
                                transition: `transform 0.5s ease ${
                                  menuItems.length * 2 * animationSpeed
                                }s, opacity 0.5s ease ${
                                  menuItems.length * 2 * animationSpeed
                                }s`,
                              }
                            : {
                                transition: `transform 0.5s ease 0s, opacity 0.5s ease 0s`,
                              }
                        }
                      >
                        {option.option}
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
        <footer>
          <div className="contact-info">
            <a
              className="footer-link"
              href="https://www.linkedin.com/in/t-kepley-mcguire/"
            >
              LinkedIn
            </a>
            <a
              className="footer-link"
              href="https://github.com/T-Kepley-McGuire"
            >
              Github
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}

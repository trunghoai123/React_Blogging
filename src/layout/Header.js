import React from "react";
import styled from "styled-components";
import { Button } from "../components/button";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";

const HeaderStyles = styled.div`
  padding: 24px 4px 24px 4px;
  .navbar_container {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .logo_container {
    display: inline-block;
  }
  .navbar_list {
    list-style: none;
    display: flex;
    align-items: center;
    justify-content: center;
    row-gap: 20px;
    padding-left: 0;
  }
  .navlink_container {
  }
  .nav_link {
    padding: 12px;
    font-weight: 500;
  }
  .search_container {
    display: flex;
    align-items: center;
    column-gap: 6px;
    border-radius: 6px;
    padding: 6px;
    border: 1px solid lightgray;
    width: 400px;
  }
  .search_input:-ms-input-placeholder {
    color: lightgray;
  }
  .search_input:-webkit-input-placeholder {
    color: red;
  }
  .search_input {
    flex: 1;
  }
  .search_icon {
    width: 20px;
    color: gray;
  }
  .icon_search-container {
    cursor: pointer;
  }
  .navbar_actions {
    display: flex;
    column-gap: 16px;
    align-items: center;
  }
  .username {
    color: ${(props) => props.theme.primary};
    font-weight: 600;
    user-select: none;
  }
  .welcome {
    user-select: none;
    font-weight: 600;
  }
`;

const navlinks = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Blog",
    url: "/blog",
  },
  {
    title: "Contact",
    url: "/contact",
  },
];

const Header = () => {
  const { user } = useAuthContext();
  return (
    <HeaderStyles className="container">
      <div className="navbar_container">
        <ul className="navbar_list">
          <li>
            <NavLink className="logo_container" to="/">
              <img srcSet="monkey_logo.png 6x" alt="" />
            </NavLink>
          </li>
          {navlinks.map((item) => {
            return (
              <li className="navlink_container" key={item.title}>
                <NavLink className="nav_link" to={item.url}>
                  {item.title}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <div className="navbar_actions">
          <div className="search_container">
            <input className="search_input" placeholder="Search posts..." />
            <span className="icon_search-container">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="search_icon h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>
          {user && <span className="welcome">Welcome</span>}
          {user ? (
            <span className="username">{user?.displayName} </span>
          ) : (
            <Button
              to="/"
              type="button"
              style={{ width: "160px", fontWeight: "600" }}
              height="40px"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </HeaderStyles>
  );
};

export default Header;

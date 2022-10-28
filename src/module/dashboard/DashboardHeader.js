import { Button } from "../../components/button";
import React, { useContext } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import Header from '../../layout/Header'
const DashboardHeaderStyles = styled.div`
  background-color: white;
  padding: 20px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
  .header-avatar {
    width: 52px;
    height: 52px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 100rem;
    }
  }
  .navbar_container{
      display: flex;
      align-items: center;
      justify-content: space-between;
  }
  .logo_container{
      display: inline-block;
  }
  .navbar_list{
      margin-right: auto;
      list-style: none;
      display: flex;
      align-items: center;
      justify-content: center;
      row-gap: 20px;
      padding-left: 0;
  } 
  .nav_link{
      padding: 12px;
      font-weight: 500;
  } 
`;

const navlinks = [
  {
      title: 'Home',
      url: '/'
  },
  {
      title: 'Blog',
      url: '/blog'
  },
  {
      title: 'Contact',
      url: '/contact'
  },
]
const DashboardHeader = () => {
  const { user } = useAuthContext();
  return (
    <DashboardHeaderStyles>
        <ul className='navbar_list'>
          {/* <li>
              <NavLink className='logo_container' to='/'>
                <img srcSet='monkey_logo.png 6x' alt=''/>
              </NavLink>
          </li> */}
          {
              navlinks.map((item) => {
                  return <li className='navlink_container' key={item.title}>
                      <NavLink className='nav_link' to={item.url}>{item.title}</NavLink>
                  </li>
              })
          }
      </ul>
      <Button to="/manage/add-post" className="header-button" height="52px">
        Write new post
      </Button>
      <div className="header-avatar">
        <NavLink to={'/profile'}>
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=3270&q=80'}
            alt=""
          />
        </NavLink>
      </div>
    </DashboardHeaderStyles>
  );
};

export default DashboardHeader;

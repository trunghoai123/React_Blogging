import React from "react";
import { Outlet } from "react-router-dom";
import styled from "styled-components";
import { useAuthContext } from "../../contexts/AuthContext";
import NotFoundPage from "../../pages/NotFoundPage";
import DashboardHeader from "./DashboardHeader";
import Sidebar from "./Sidebar";
const DashboardStyles = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  .dashboard {
    &-heading {
      font-weight: bold;
      font-size: 36px;
      margin-bottom: 40px;
      color: ${(props) => props.theme.primary};
      letter-spacing: 1px;
    }
    &-main {
      display: grid;
      grid-template-columns: 300px minmax(0, 1fr);
      padding: 40px 20px;
      gap: 0 40px;
      align-items: start;
    }
  }
`;
const DashboardLayout = ({ children }) => {
  const { user } = useAuthContext();
  console.log(user);
  if( !user ) return <NotFoundPage />
  return (
    <DashboardStyles>
      <DashboardHeader></DashboardHeader>
      <div className="dashboard-main">
        <Sidebar></Sidebar>
        <div className="dashboard-children">
          <Outlet></Outlet>
        </div>
      </div>
    </DashboardStyles>
  );
};

export default DashboardLayout;

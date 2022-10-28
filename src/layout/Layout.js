import React from "react";
import styled from "styled-components";
import Header from "./Header";

const LayoutStyles = styled.div``;
const Layout = ({ children, ...props }) => {
  return (
    <LayoutStyles>
      <Header></Header>
      {children}
    </LayoutStyles>
  );
};

export default Layout;

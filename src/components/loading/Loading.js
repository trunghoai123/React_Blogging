import React from "react";
import styled from "styled-components";

const LoadingStyles = styled.span`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border-radius: 50%;
  display: inline-block;
  /* border: ${(props) => props.borderSize} solid white; */
  border-bottom: ${(props) => props.borderSize} solid orange;
  border-right: ${(props) => props.borderSize} solid yellow;
  border-left: ${(props) => props.borderSize} solid pink;
  border-top: ${(props) => props.borderSize} solid lightsalmon;
  animation: spinner 1s infinite linear;
  @keyframes spinner {
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Loading = ({ size = "20px", borderSize = "4px" }) => {
  return <LoadingStyles size={size} borderSize={borderSize}></LoadingStyles>;
};

export default Loading;

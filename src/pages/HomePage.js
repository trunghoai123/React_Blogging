import React, { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-app/firebase-config";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import Layout from "../layout/Layout";
import HomeBanner from "../module/home/HomeBanner";
import styled from "styled-components";
import HomeFeature from "../module/home/HomeFeature";
import HomeNewest from "../module/home/HomeNewest";

const HomePageStyles = styled.div``;

const HomePage = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    signOut(auth);
    // navigate('/sign-in');
  };
  const { user } = useAuthContext();
  useEffect(() => {
    if (!user) {
      navigate("/sign-in");
    }
  }, [navigate, user]);
  // onAuthStateChanged(auth, (user) => {
  //     if(!user){
  //         navigate('/sign-in');
  //     }
  // });
  return (
    <HomePageStyles>
      <Layout>
        {/* <button onClick={handleLogout}>Sign Out</button> */}
        <HomeBanner></HomeBanner>
        <HomeFeature></HomeFeature>
        <HomeNewest></HomeNewest>
      </Layout>
    </HomePageStyles>
  );
};

export default HomePage;

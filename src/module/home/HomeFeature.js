import Heading from "../../layout/Heading";
import PostFeatureItem from "../../module/post/PostFeatureItem";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from '../../firebase-app/firebase-config';
import { collection, getDocs, doc, onSnapshot, getDoc, where, orderBy, limit, query } from 'firebase/firestore'
const HomeFeatureStyles = styled.div``;

const HomeFeature = () => {
  const [posts, setPosts] = useState([]);
  const collRef = collection(db, 'posts');
  useEffect(() => {
    // const getPosts = () => {
    // }
    // getPosts();
    const q = query(collRef, where('hot', '==', true), orderBy('title'), limit(3));
    onSnapshot(q, (snapshot) => {
        let posts = [];
        snapshot.docs.forEach((doc) => {
            posts.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        setPosts(posts);
        // console.log(posts);
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <HomeFeatureStyles className="home-block">
      <div className="container">
        <Heading>Bài viết nổi bật</Heading>
        <div className="grid-layout">
          {
            posts.length > 0 ?
              posts.map((item) => {
                return <PostFeatureItem key={item.id} item={item}>
                </PostFeatureItem>
              })
            :
            <>
              <PostFeatureItem></PostFeatureItem>
              <PostFeatureItem></PostFeatureItem>
              <PostFeatureItem></PostFeatureItem>
            </>
          }
        </div>
      </div>
    </HomeFeatureStyles>
  );
};

export default HomeFeature;

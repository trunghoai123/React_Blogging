import { collection, doc, getDoc, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { db } from "../../firebase-app/firebase-config";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";
const PostFeatureItemStyles = styled.div`
  width: 100%;
  border-radius: 16px;
  position: relative;
  height: 169px;
  .post {
    &-image {
      width: 100%;
      height: 100%;
      border-radius: 16px;
    }
    &-overlay {
      position: absolute;
      inset: 0;
      border-radius: 16px;
      background: linear-gradient(
        179.77deg,
        #6b6b6b 36.45%,
        rgba(163, 163, 163, 0.622265) 63.98%,
        rgba(255, 255, 255, 0) 99.8%
      );
      mix-blend-mode: multiply;
      opacity: 0.6;
    }
    &-content {
      position: absolute;
      inset: 0;
      z-index: 10;
      padding: 20px;
      color: white;
    }
    &-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
    &-category {
      display: inline-block;
      padding: 8px 12px;
      border-radius: 8px;
      color: #6b6b6b;
      font-size: 14px;
      font-weight: 600;

    }
  }

  @media screen and (min-width: 1024px) {
    height: 272px;
  }
`; 
const PostFeatureItem = ({ item = {}}) => {
  // const [category, setCategory] = useState('');
  // const [author, setAuthor] = useState('');
  // useEffect(() => {
  //   const getCategory = async () => {
  //     if(item.category){
  //       const ref = doc(db, "categories", item.category);
  //       const docSnap = await getDoc(ref);
  //       if(docSnap.data){
  //         setCategory(docSnap.data());
  //       }
  //     }
  //   }
  //   getCategory();
  // }, [item.category]);
  // useEffect(() => {
  //   const getUser = async () => {
  //     if(item.userId){
  //       const ref = doc(db, "users", item.userId);
  //       const docSnap = await getDoc(ref);
  //       // console.log(docSnap.data());
  //       if(docSnap.data){
  //         setAuthor(docSnap.data().fullname);
  //       }
  //     }
  //   }
  //   getUser();
  // }, [item.userId]);
  // const date = item?.createAt?.seconds ? new Date(item?.createAt?.seconds * 1000) : new Date();
  // const formatDate = new Date(date).toLocaleDateString('vi-VI');
  
  const { user, category } = item;
  return (
    <PostFeatureItemStyles>
    <PostImage 
      url={item.imageUrl || 'https://images.unsplash.com/photo-1614624532983-4ce03382d63d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2662&q=80'}
      alt={item.image || 'unsplash'}
    >
    </PostImage>
      {/* <div style={{height: '100%'}}>
        <img
          src="https://images.unsplash.com/photo-1614624532983-4ce03382d63d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2662&q=80"
          alt="unsplash"
          className="post-image"
        />
      </div> */}
      <div className="post-overlay"></div>
      <div className="post-content">
        <div className="post-top">
          <PostCategory categoryTitle={category?.name} to={category?.slug || '/'} className='post-category' type='primary'>
            {category ? category?.name : 'Kiến thức'}
          </PostCategory>
          <PostMeta dateTitle={item?.createdAt} authorTitle={user?.fullname}
            date={item?.createdAt?.slice(-12)} authorName={user?.fullname} color="white"
          ></PostMeta>
        </div>
        <PostTitle to={item?.slug || '/'} className="post-title" size='22px' color='white'>
          {item.title || 'Hướng dẫn setup phòng cực chill dành cho người mới toàn tập'}
        </PostTitle>
      </div>
    </PostFeatureItemStyles>
  );
};

export default PostFeatureItem;

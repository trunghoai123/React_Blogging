import Heading from "../layout/Heading";
import Layout from "../layout/Layout";
import PostCategory from "../module/post/PostCategory";
import PostImage from "../module/post/PostImage";
import PostItem from "../module/post/PostItem";
import PostMeta from "../module/post/PostMeta";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import NotFountPage from './NotFoundPage'
import { useParams } from 'react-router-dom'
import { collection, doc, getDoc, getDocs, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase-app/firebase-config";
import parse from 'html-react-parser';
import RelatedPost from "../module/post/RelatedPost";
import { useAuthContext } from "../contexts/AuthContext";
const PostDetailsPageStyles = styled.div`
  padding-bottom: 100px;
  .post {
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 40px;
      margin: 40px 0;
    }
    &-feature {
      width: 100%;
      max-width: 640px;
      height: 466px;
      border-radius: 20px;
    }
    &-heading {
      font-weight: bold;
      font-size: 36px;
      margin-bottom: 16px;
    }
    &-info {
      flex: 1;
    }
    &-content {
      max-width: 700px;
      margin: 80px auto;
    }
  }
  .author {
    /* margin-top: 40px;
    margin-bottom: 80px; */
    display: flex;
    border-radius: 20px;
    background-color: ${(props) => props.theme.grayF3};
    &-image {
      width: 200px;
      height: 200px;
      flex-shrink: 0;
      border-radius: inherit;
    }
    &-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
    &-content {
      flex: 1;
      padding: 20px;
    }
    &-name {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 20px;
    }
    &-desc {
      font-size: 14px;
      line-height: 2;
    }
  }
  .datePost{
        margin-left: 6px;
        cursor: default;
        user-select: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 80px;
        ${props => props.timeStyle};
    }
    .dotPost {
        margin-right: 12px; 
        margin-left: 12px;
        color: darkgray;
        display: inline-block;
        width: 4px;
        height: 4px;
        background-color: currentColor;
        border-radius: 100rem;
    } 
    .postAuthor{
        cursor: default;
        user-select: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 120px;
        ${props => props.authorStyle};
    }
  @media screen and (max-width: 1023.98px) {
    padding-bottom: 40px;
    .post {
      &-header {
        flex-direction: column;
      }
      &-feature {
        height: auto;
      }
      &-heading {
        font-size: 26px;
      }
      &-content {
        margin: 40px 0;
      }
    }
    .author {
      flex-direction: column;
      &-image {
        width: 100%;
        height: auto;
      }
    }
  }
`;

const PostDetailsPage = () => {
  const { slug } = useParams();
  console.log(slug);
  const [postInfo, setPostInfo] = useState();
  useEffect(() => {
    const colRef = query(collection(db, 'posts', ), where('slug', '==', slug));
    onSnapshot(colRef, (snapshot) => {
      snapshot.forEach((doc) => {
        doc.data() && setPostInfo(doc.data());
      });
    });
  }, [slug]);
  useEffect(() => {
    // window.scroll(0, 0);
    document.body.scrollIntoView({ behavior: 'smooth', block: 'start'});
  }, [slug])
  if(!slug) return <NotFountPage></NotFountPage>
  if(!postInfo?.title) return null;
  return (
    <PostDetailsPageStyles>
      <Layout>
        <div className="container">
          <div className="post-header">
            <PostImage
              url={postInfo?.imageUrl || 'https://images.unsplash.com/photo-1649837867356-6c7ef7057f32?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80'}
              className="post-feature"
            ></PostImage>
            <div className="post-info">
              <PostCategory className="mb-6">{postInfo?.category?.name}</PostCategory>
              <h1 className="post-heading">
                {postInfo?.title || 'Hướng dẫn setup phòng cực chill dành cho người mới toàn tập'}
              </h1>
              <span className={`datePost`}>{postInfo?.createdAt}</span>
              <span className="dotPost"></span>
              <span className={`postAuthor`}>{postInfo?.user?.fullname}</span>
              {/* <PostMeta timeClass="" authorStyle={{marginBottom: '20px'}} className="mb-2"></PostMeta> */}
            </div>
          </div>
          <div className="post-content">
            <div className="entry-content">
              {parse(postInfo.content || '<h1>Empty</h1>')}
            </div>
            <div className="author">
              <div className="author-image">
                <img
                  src={postInfo?.user?.avatar || 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80'}
                  alt={postInfo?.user?.fullname || ''}
                />
              </div>
              <div className="author-content">
                <h3 className="author-name">{postInfo.user?.fullname}</h3>
                <p className="author-desc">
                  {postInfo?.description || <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                    Dignissimos non animi porro voluptates quibusdam optio nulla
                    quis nihil ipsa error delectus temporibus nesciunt, nam
                    officiis adipisci suscipit voluptate eum totam!</p>}
                </p>
              </div>
            </div>
          </div>
          <RelatedPost categoryId={postInfo?.category?.id}></RelatedPost>
        </div>
      </Layout>
    </PostDetailsPageStyles>
  );
};

export default PostDetailsPage;

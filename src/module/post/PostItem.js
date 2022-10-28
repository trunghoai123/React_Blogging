import React from "react";
import styled from "styled-components";
import PostCategory from "./PostCategory";
import PostImage from "./PostImage";
import PostMeta from "./PostMeta";
import PostTitle from "./PostTitle";
const PostItemStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .meta-container{
    display: flex;
    align-items: center;
    column-gap: 8px;
  }
  .dotInf {
      display: inline-block;
      width: 4px;
      height: 4px;
      background-color: currentColor;
      border-radius: 100rem;
  } 
  .timeInf{
      cursor: default;
      user-select: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 80px;
      font-size: 13px;
      color: gray;
  }
  .authorInf{
      cursor: default;
      user-select: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 120px;
      max-width: 120px;
      font-size: 13px;
      color: gray;
    }
  .post {
    &-image {
      height: 202px;
      margin-bottom: 20px;
      display: block;
      width: 100%;
      border-radius: 16px;
    }
    &-category {
      margin-bottom: 16px;
    } 
    &-title {
      margin-bottom: 8px;
    }
  }
`;

const PostItem = ({item, ...props}) => {
  return (
    <PostItemStyles>
      <PostImage
        to={item?.slug} 
        url={item?.imageUrl || 'https://images.unsplash.com/photo-1570993492881-25240ce854f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2290&q=80'}
      ></PostImage>
      <PostCategory to={item?.category?.slug} className='post-category' type="primary">
        {item?.category?.name || 'Kiến thức'}
      </PostCategory>
      <PostTitle
        to={item?.slug} className="post-title">
        {item?.title || 'Hướng dẫn setup phòng cực chill dành cho người mới toàn tập'}
      </PostTitle>
      <div className="meta-container">
        <span title={item?.createdAt} className={`timeInf`}>{item?.createdAt}</span>
        <span className="dotInf"></span>
        <span title={item?.user?.fullname} className={`authorInf`}>{item?.user?.fullname}</span>
      </div>
    </PostItemStyles>
  );
};

export default PostItem;

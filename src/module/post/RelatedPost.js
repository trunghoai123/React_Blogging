import { collection, onSnapshot, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase-app/firebase-config';
import Heading from '../../layout/Heading';
import PostItem from './PostItem';
import styled from 'styled-components';

const RelatedPostStyles = styled.div`

`


const RelatedPost = ({categoryId = ''}) => {
    const [posts, setPosts] = useState([]);
    useEffect(() => {
        const colRef = query(collection(db, 'posts', ), where('category.id', '==', categoryId));
        onSnapshot(colRef, (snapshot) => {
            const listPosts = [];
            snapshot.forEach((doc) => {
                listPosts.push(doc.data());
            });
            setPosts(listPosts);
        });
    }, [categoryId]);
    return (
        <div className="post-related">
          <Heading>Bài viết liên quan</Heading>
          <div className="grid-layout grid-layout--primary">
            {
                posts.length > 0 && posts.map((item) => {
                    return <PostItem item={item}></PostItem>
                })
            }
          </div>
        </div>
    );
};

export default RelatedPost;
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled from 'styled-components';

const PostImageStyles = styled.div`
    /* height: 100%; */
    display: block;
    width: 100%;
    a{
        border-radius: inherit;
    }
    img {
        border-radius: inherit;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
`

const PostImage = ({url = '', to = '', alt = '', className, ...props}) => {
    return (
        <PostImageStyles {...props} className={`post-image ${className}`}>
        {
            to !== '' ? // if tag has link to sanother page then add NavLink to the image
            <Link to={`/${to}`}>
                <img
                // https://images.unsplash.com/photo-1570993492881-25240ce854f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2290&q=80
                    src={url}
                    alt={alt}
                />
            </Link>
            :
            <img
                // https://images.unsplash.com/photo-1570993492881-25240ce854f4?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2290&q=80
                src={url}
                alt={alt}
            />
        }
        </PostImageStyles>
    );
};
export default PostImage;
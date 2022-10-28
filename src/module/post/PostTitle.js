import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import styled, { css } from 'styled-components';

const PostTitleStyles = styled.div`
    line-height: 1.5;
    display: block;
    font-weight: bold;
    ${props => props.color === 'white' ? 
        css`
            color: white;
        `
    :
        css`
            color: black; 
        `
    };
    font-size: ${props => props.size};
    a{
        display: inline-block ;
    }
`

const PostTitle = ({children = '', size = '18px', color = '', to = '/',  ...props}) => {
    return (
        <PostTitleStyles color={color} size={size} {...props}>
            <Link to={`/${to}`}>
                {children}
            </Link>
        </PostTitleStyles>
    );
};

export default PostTitle;